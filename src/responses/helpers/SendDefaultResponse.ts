import { Response } from 'express';
import { ApiResponse } from '../interfaces/ApiResponse';

export function sendResponse<T>(
  res: Response,
  {
    success,
    message,
    data,
    error,
    statusCode,
  }: Omit<ApiResponse<T>, 'timestamp'>
) {
  const response: ApiResponse<T> = {
    success,
    message,
    data,
    error,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
}