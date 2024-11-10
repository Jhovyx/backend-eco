import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { GetItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { PutCommand, } from '@aws-sdk/lib-dynamodb';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { LoginDTO } from './dto/login-users.dto';
import { ActivitiesService } from 'src/activities/activities.service';
@Injectable()
export class UsersService {
  //create, findAll, findOne, update-user, update-password and login
  constructor(
    private readonly dynamoService: DynamodbService,
    private readonly activitiesService: ActivitiesService
  ){}

  //crear
  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOneByEmail(createUserDto.email)
    if(userExist && userExist.length > 0)
      throw new NotFoundException('El correo ingresado ya esta registrado.');
    const {userAdminId,firstName,lastName,password, ...user} = createUserDto;
    if(userAdminId) await this.findOneByIdAdmin(userAdminId);
    const passwordEncripted = await bcrypt.hash(password, 10);
    const userType = userAdminId ? 'admin' : 'cliente';
    const newUser: User = {
      primaryKey: uuid(),
      createdAt: new Date().getTime(),
      ...user,
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      password: passwordEncripted,
      estado: true,
      userType,
      updatedAt: null
    };
    const command = new PutCommand({
      TableName: 'users',
      Item: {
        ...newUser
      }
    })
    await this.dynamoService.dynamoCliente.send(command);
    await this.activitiesService.create({
      userId: newUser.primaryKey,
      action: 'Creacion de usuario.',
      detail: userAdminId 
        ? `Usuario administrador creado por ${userAdminId}.` 
        : `Usuario cliente creado.`,
    });
    return { message: 'Usuario creado con éxito.' };
  }

  //obtener todos
  async findAll() {
    const command = new ScanCommand({
      TableName: 'users',
      FilterExpression: 'estado = :estadoValue',
      ProjectionExpression: 'primaryKey, firstName, lastName, documentType, documentNumber, phoneNumber, email, profilePictureUrl, userType, createdAt, updatedAt',
      ExpressionAttributeValues: {
        ':estadoValue': { BOOL: true }
      }
    });
    const result = await this.dynamoService.dynamoCliente.send(command);
    return result.Items.map(item => this.formatUser(item));
  }

  //obtener po id
  async findOne(id: string) {
    const command = new GetItemCommand({
      TableName: 'users',
      Key: {
        primaryKey: { S: id },  // Clave de partición
      },
      ProjectionExpression: 'primaryKey, firstName, lastName, documentType, documentNumber, phoneNumber, email, profilePictureUrl, userType, createdAt, updatedAt, estado',
    });
    
    const result = await this.dynamoService.dynamoCliente.send(command);
  
    if (!result.Item)
      throw new NotFoundException('Usuario no encontrado.');
    // Comprobar si el estado es true
    const userStatus = result.Item.estado?.BOOL;
    if (userStatus !== true) 
      throw new NotFoundException('Usuario no encontrado.');
    return this.formatUser(result.Item);
  }

  //actulizar usuario
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Desestructurar los datos de updateUserDto
      const {documentNumber,documentType,email,firstName,lastName,phoneNumber,profilePictureUrl} = updateUserDto;
      if(!documentNumber && !documentType && !email && !firstName && !lastName && !phoneNumber && !profilePictureUrl)
        throw new NotFoundException('No hay datos para actulizar.');
     //Verificar que el usuario exista
      const userBD = await this.findOne(id);

      userBD.updatedAt = new Date().getTime();
      if(email){
        const userId = await this.findOneByEmail(email);
        if(userId && userId !== id){
          throw new NotFoundException('El correo electrónico ya está en uso por otro usuario.');
        }
        userBD.email = email;
      }
      // Actualizar los otros campos
    if (documentType) userBD.documentType = documentType;
    if (documentNumber) userBD.documentNumber = documentNumber;
    if (firstName) userBD.firstName = firstName.toUpperCase();
    if (lastName) userBD.lastName = lastName.toUpperCase();
    if (phoneNumber) userBD.phoneNumber = phoneNumber;
    if (profilePictureUrl) userBD.profilePictureUrl = profilePictureUrl;

    const updateCommand = new UpdateItemCommand({
      TableName: 'users',
      Key: { 
        primaryKey: { S: userBD.primaryKey },
      },
      UpdateExpression: 'set email = :email, documentType = :documentType, documentNumber = :documentNumber, updatedAt = :updatedAt, firstName = :firstName, lastName = :lastName, phoneNumber = :phoneNumber, profilePictureUrl = :profilePictureUrl',
      ExpressionAttributeValues: {
        ':email': { S: userBD.email },
        ':documentType': { S: userBD.documentType },
        ':documentNumber': { S: userBD.documentNumber },
        ':updatedAt': { N: new Date().getTime().toString() },
        ':firstName': { S: userBD.firstName },
        ':lastName': { S: userBD.lastName },
        ':phoneNumber': { S: userBD.phoneNumber },
        ':profilePictureUrl': { S: userBD.profilePictureUrl || ""  },
      },
    }); 
    await this.dynamoService.dynamoCliente.send(updateCommand);
    await this.activitiesService.create({
      userId: id,
      action: 'Actualizacion de usuario.',
      detail: `Usuario actualizado correctamente.`,
    });
    return userBD;
  }

  //actulizar contraseña
  async updatePasswordUser(id: string, dto: UpdatePasswordDTO) {
    // Verificamos que el usuario exista
    const userDB = await this.findOne(id);
    // Consultamos solo la contraseña para evitar exponer datos innecesarios
    const command = new QueryCommand({
      TableName: 'users',
      KeyConditionExpression: 'primaryKey = :primaryKeyValue',
      FilterExpression: 'estado = :estadoValue', // Filtrar por estado activo
      ExpressionAttributeValues: {
        ':primaryKeyValue': { S: userDB.primaryKey },
        ':estadoValue': { BOOL: true },  // Aseguramos que el usuario esté activo
      },
      ProjectionExpression: 'password',  // Solo obtenemos la contraseña
    });
    const result = await this.dynamoService.dynamoCliente.send(command);

    if (!result.Items || result.Items.length === 0)
      throw new NotFoundException('Usuario no encontrado.');
    const userBD = result.Items[0]; // Obtener el primer (y único) item
    const passwordMatch = await bcrypt.compare(dto.oldPassword, userBD.password.S);
    if (!passwordMatch)
      throw new NotFoundException('Contraseña incorrecta.');
    //Hash de la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 15);
    //Actualizamos la contraseña en la base de datos
    const updateCommand = new UpdateItemCommand({
      TableName: 'users',
      Key: {
        primaryKey: { S: id },
      },
      UpdateExpression: 'SET password = :password, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':password': { S: hashedNewPassword },  // Actualizamos la contraseña
        ':updatedAt': { N: new Date().getTime().toString() },  // Timestamp de actualización
      },
    });
    await this.dynamoService.dynamoCliente.send(updateCommand);

    //Registrar la actividad de cambio de contraseña
    await this.activitiesService.create({
      userId: id,
      action: 'Actualizacion de contraseña usuario.',
      detail: `Contraseña actualizada correctamente.`,
    });
    return { message: 'Contraseña actualizada correctamente.'};
  }

  //loguear
  async login(loginUserDTO: LoginDTO) {
    const userBDId = await this.findOneByEmail(loginUserDTO.email);
    if (!userBDId) 
      throw new NotFoundException('Usuario no encontrado.');
    const command = new QueryCommand({
      TableName: 'users',
      KeyConditionExpression: 'primaryKey = :primaryKeyValue',
      FilterExpression: 'estado = :estadoValue', // Filtrar por estado
      ExpressionAttributeValues: {
        ':primaryKeyValue': { S: userBDId },
        ':estadoValue': { BOOL: true },
      },
      ProjectionExpression: 'password, estado',  // Solo obtenemos los campos necesarios
    });
    // 3. Ejecutamos el comando y esperamos el resultado
    const result = await this.dynamoService.dynamoCliente.send(command);

    // 4. Verificamos si encontramos el usuario y su estado es true
    if (!result.Items || result.Items.length === 0 || result.Items[0].estado.BOOL === false) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // 5. Comparamos la contraseña
    const passwordMatch = await bcrypt.compare(loginUserDTO.password, result.Items[0].password.S);
    if (!passwordMatch) {
      throw new NotFoundException('Contraseña incorrecta.');
    }
    await this.activitiesService.create({
      userId: userBDId,
      action: 'Inicio de sesión.',
      detail: 'Inicio de sesión exitoso',
    });
    return await this.findOne(userBDId);
  }

  //eliminar usuario
  async deleteUser(id: string, updateUserDto: UpdateUserDto){
    if(updateUserDto.userAdminId.length !== 0){
      const userBD = await this.findOne(id); // Retorna el usuario formateado
      await this.findOneByIdAdmin(updateUserDto.userAdminId);
      const updateCommand = new UpdateItemCommand({
        TableName: 'users',
        Key: {
          primaryKey: { S: id },
        },
        UpdateExpression: 'SET estado = :estado, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':estado': { BOOL: false },  // Marcar como eliminado
          ':updatedAt': { N: new Date().getTime().toString() },  // Marca el tiempo de la actualización
        },
      });
      await this.dynamoService.dynamoCliente.send(updateCommand);
      await this.activitiesService.create({
        userId: updateUserDto.userAdminId,
        action: 'User deletion',
        detail: `Usuario con ID ${id} eliminado.`,
      });
      return { message: 'Usuario eliminado correctamente.' };
    }else{
      throw new NotFoundException('Este usuario no puede realizar esta acción.')
    }
  }
  
  //buscar por email y retorna el id del email
  private async findOneByEmail(email: string) {
    const command = new QueryCommand({
      TableName: 'users',
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email },
      },
    });
    const result = await this.dynamoService.dynamoCliente.send(command);
    if(result.Items && result.Items.length > 0) return result.Items[0].primaryKey.S;
    return;
  }

  //buscar si es admin
  private async findOneByIdAdmin(id: string) {
    const userBD = await this.findOne(id);
    if (userBD.userType !== "admin")
        throw new NotFoundException('Este usuario no está permitido que realize esta acción.');
    return;
  }

  //formatear a un json legible
  private formatUser(item: any) {
      return {
          primaryKey: item.primaryKey.S,
          firstName: item.firstName.S,
          lastName: item.lastName.S,
          documentType: item.documentType.S,
          documentNumber: item.documentNumber.S,
          phoneNumber: item.phoneNumber.S,
          email: item.email.S,
          profilePictureUrl: item.profilePictureUrl?.S || null,
          userType: item.userType.S,
          createdAt: item.createdAt.N,
          updatedAt: item.updatedAt?.N || null
      };
  }

}