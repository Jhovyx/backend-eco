import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

@ValidatorConstraint({ name: 'isValidDocumentNumber', async: false })
export class IsValidDocumentNumberConstraint implements ValidatorConstraintInterface {

  validate(documentNumber: string, args: ValidationArguments) {
    const documentType = args.object['documentType'];

    if (documentType === 'DNI') {
      return documentNumber.length === 8;
    } else if (documentType === 'RUC') {
      return documentNumber.length === 11;
    } else if (documentType === 'PASAPORTE') {
      return documentNumber.length >= 6 && documentNumber.length <= 9;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const documentType = args.object['documentType'];
    if (documentType === 'DNI') {
      return 'El DNI debe tener 8 dígitos.';
    } else if (documentType === 'RUC') {
      return 'El RUC debe tener 11 dígitos.';
    } else if (documentType === 'PASAPORTE') {
      return 'El número de pasaporte debe tener entre 6 y 9 caracteres alfanuméricos.';
    }
    return 'Número de documento inválido.';
  }
}
