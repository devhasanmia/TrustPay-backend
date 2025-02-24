import mongoose from 'mongoose';
import { TGenericErrorMessage } from '../interface/error';

const handleValidationError = (error: mongoose.Error.ValidationError) => {
  const errors: TGenericErrorMessage[] = Object.values(error.errors).map((el) => ({
    path: el.path,
    message: el.message,
  }));
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
