import { AxiosError, AxiosResponse } from 'axios';

export type ResponseSuccessType<T> = {
  status: number;
  data: T;
};

export type ResponseErrorType = {
  statusCode: number;
  message: string;
};

export type ApiResponse<T> = AxiosResponse<ResponseSuccessType<T>>;
export type ApiError = AxiosError<ResponseErrorType>;

export type SuccessFunctionType<T> = (data: ApiResponse<T>) => void;

export type ErrorFunctionType = (err: AxiosError<ResponseErrorType>) => void;
