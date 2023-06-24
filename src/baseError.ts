type statusCodeTypes = 200 | 500 | 400 | 404;

class BaseError extends Error {
  statusCode;
  isOperational;
  status;
  constructor(
    statusCode: statusCodeTypes,
    message: string,
    isOperational: boolean,
    status: string = "failed"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = status;
  }
}

export default BaseError;
