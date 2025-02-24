import { ZodError } from 'zod';

const handleZodError = (error: ZodError) => {
  const errors = error.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1] || 'unknown',
    message: issue.message,
  }));
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleZodError;
