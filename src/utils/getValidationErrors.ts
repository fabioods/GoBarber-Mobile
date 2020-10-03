import { ValidationError } from 'yup';

interface Error {
  [key: string]: string;
}

const getValidationErros = (error: ValidationError): Error => {
  const validationError: Error = {};

  error.inner.forEach(err => {
    validationError[err.path] = err.message;
  });

  return validationError;
};

export default getValidationErros;
