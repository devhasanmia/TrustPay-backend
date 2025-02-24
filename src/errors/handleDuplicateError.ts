

export const handleDuplicateError = (err: any) => {
  const statusCode = 409; 
  const regex = /E11000 duplicate key error collection: \w+\.\w+ index: (\w+)_\d+ dup key: { (\w+): "([^"]+)" }/;
  const match = err.message.match(regex);
  let errorMessages = [];
  if (match) {
    const [, _indexName, fieldName, fieldValue] = match;
    errorMessages = [
      {
        path: fieldName,
        message: `${fieldValue} This ${fieldName} already exists in database`,
      },
    ];
  } else {
    errorMessages = [
      {
        path: "",
        message: "Duplicate entry. Please check.",
      },
    ];
  }
  return {
    statusCode,
    message: "Duplicate entry. Please check.",
    errorMessages,
  };
};