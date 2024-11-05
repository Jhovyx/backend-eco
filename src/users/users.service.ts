import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
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

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOneByEmail(createUserDto.email)
    if(userExist && userExist.length > 0)
      throw new NotFoundException('El correo ingresado ya esta registrado.');
    const {userAdminId, ...user} = createUserDto;
    if(userAdminId) await this.findOneByIdAdmin(userAdminId);
    const passwordEncripted = await bcrypt.hash(createUserDto.password, 10);
    const userType = userAdminId ? 'admin' : 'cliente';
    const newUser: User = {
      primaryKey: uuid(),
      createdAt: new Date().getTime(),
      ...user,
      password: passwordEncripted,
      status: true,
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

  async findAll() {
    const command = new ScanCommand({
      TableName: 'users',
      ProjectionExpression: 'primaryKey, firstName, lastName, documentType, documentNumber, phoneNumber, email, profilePictureUrl, userType'
    });
    const result = await this.dynamoService.dynamoCliente.send(command);
    const users = result.Items.map(item => this.formatUser(item));
    return users
  }

  async findOne(id: string) {
    const command = new GetCommand({
      TableName: 'users',
      ProjectionExpression: 'primaryKey, firstName, lastName, documentType, documentNumber, phoneNumber, email, profilePictureUrl, userType',
      Key: {
        primaryKey: id,
      },
    });
    const result = await this.dynamoService.dynamoCliente.send(command);
    if(!result.Item)
      throw new NotFoundException('Usuario no encontrado.')
    return result.Item
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
      await this.findOne(id);
      const {documentNumber,documentType,email,firstName,lastName,phoneNumber,profilePictureUrl} = updateUserDto;
      if(!documentNumber && !documentType && !email && !firstName && !lastName && !phoneNumber && !profilePictureUrl)
        throw new NotFoundException('No hay datos para actulizar.');
      const command = new GetCommand({
        TableName: 'users',
        Key: {
          primaryKey: id
        }
      });
      const result = await this.dynamoService.dynamoCliente.send(command);
      const userBD = result.Item;
      userBD.updatedAt = new Date().getTime();
      if(email){
        const userId = await this.findOneByEmail(email);
        if(userId && userId !== id){
          throw new NotFoundException('El correo electrónico ya está en uso por otro usuario.');
        }else{
          userBD.email = email;
        }
      }  
      // Guardar el tipo de documento y el número original
      const originalDocumentType = userBD.documentType;
      const originalDocumentNumber = userBD.documentNumber;

      // Validar y actualizar el tipo de documento
      if (documentType) {
        // Validaciones de longitud de documento según el nuevo tipo
        if (documentType === 'DNI') {
          if (!documentNumber || documentNumber.length !== 8) {
            throw new NotFoundException('El DNI debe tener 8 dígitos.');
          }
        } else if (documentType === 'RUC') {
          if (!documentNumber || documentNumber.length !== 11) {
            throw new NotFoundException('El RUC debe tener 11 dígitos.');
          }
        } else if (documentType === 'PASAPORTE') {
          if (!documentNumber || (documentNumber.length < 6 || documentNumber.length > 9)) {
            throw new NotFoundException('El número de pasaporte debe tener entre 6 y 9 caracteres alfanuméricos.');
          }
        }
        
        userBD.documentType = documentType; // Solo se asigna si las validaciones son exitosas
      }

      // Validar y actualizar el número de documento
      if (documentNumber) {
        // Solo valida el número si se está cambiando el tipo o el número
        if (documentType !== originalDocumentType || documentNumber !== originalDocumentNumber) {
          // Validaciones según el nuevo tipo de documento
          if (documentType === 'DNI' && documentNumber.length !== 8) {
            throw new NotFoundException('El DNI debe tener 8 dígitos.');
          } else if (documentType === 'RUC' && documentNumber.length !== 11) {
            throw new NotFoundException('El RUC debe tener 11 dígitos.');
          } else if (documentType === 'PASAPORTE' && (documentNumber.length < 6 || documentNumber.length > 9)) {
            throw new NotFoundException('El número de pasaporte debe tener entre 6 y 9 caracteres alfanuméricos.');
          }
        }
        
        userBD.documentNumber = documentNumber; // Solo se asigna si las validaciones son exitosas
        userBD.updatedAt = new Date().getTime(); // Actualiza el timestamp
      }
      if(firstName) userBD.firstName = firstName;
      if(lastName) userBD.lastName = lastName;
      if(phoneNumber) userBD.phoneNumber = phoneNumber;
      if(profilePictureUrl) userBD.profilePictureUrl = profilePictureUrl;
      const putCommand = new PutCommand({
        TableName: 'users',
        Item: {...userBD}
      });
      await this.dynamoService.dynamoCliente.send(putCommand);
      await this.activitiesService.create({
        userId: id,
        action: 'Actualizacion de usuario.',
        detail: `Usuario actualizado correctamente.`,
      });
      return await this.findOne(id);
  }

  async updatePasswordUser(id: string, dto: UpdatePasswordDTO) {
    await this.findOne(id)
    const command = new GetCommand({
      TableName: 'users',
      Key: {
        primaryKey: id
      }
    });
    const result = await this.dynamoService.dynamoCliente.send(command);
    const userBD = result.Item;
    const passwordMatch = await bcrypt.compare(dto.oldPassword, userBD.password)
    if (!passwordMatch) 
      throw new NotFoundException('Contraseña incorrecta.')
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 15);
    const putCommand = new PutCommand({
      TableName: 'users',
      Item: {
        ...userBD,
        password: hashedNewPassword
      }
    });
    await this.dynamoService.dynamoCliente.send(putCommand);
    await this.activitiesService.create({
      userId: id,
      action: 'Actualizacion de contraseña usuario.',
      detail: `Contraseña actualizada correctamente.`,
    });
    return { message: 'Contraseña actualizada correctamente.'};
  }

  async login(loginUserDTO: LoginDTO) {
    const userBDId = await this.findOneByEmail(loginUserDTO.email);
    const command = new GetCommand({
      TableName: 'users',
      Key: {
        primaryKey: userBDId
      }
    });
    const result = await this.dynamoService.dynamoCliente.send(command);
    const userBD = result.Item;
    const passwordMatch = await bcrypt.compare(loginUserDTO.password, userBD.password)
    if(!passwordMatch)
      throw new NotFoundException('Contraseña incorrecta.')
    await this.activitiesService.create({
      userId: userBDId,
      action: 'Inicio de sesión.',
      detail: 'Inicio de sesión exitoso',
    });
    return await this.findOne(userBDId);
  }
  
  //buscar por email
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
    const command = new GetCommand({
        TableName: 'users',
        Key: {
            primaryKey: id 
        }
    });
    const result = await this.dynamoService.dynamoCliente.send(command);
    if (!result.Item) 
        throw new NotFoundException('El usuario que desea crear administradores no fue encontrado.');
    const userType = result.Item.userType.S;
    if (userType === "cliente")
        throw new NotFoundException('Este usuario no está permitido que cree administradores.');
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
          userType: item.userType.S
      };
  }

}
