import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ApiError, ApiResponse, ErrorFunctionType, SuccessFunctionType } from '../types/common';

// 서버에서 response 해오는 타입의 형태
export type Genre = {
  id: number;
  name: string;
};

export type GetGenreFnType = () => UseQueryResult<Genre[]>;

export type GenreParams = {
  genreName: string;
};

export type GenreFnType = (
  onSuccess: SuccessFunctionType<null>,
  onError: ErrorFunctionType,
) => UseMutationResult<ApiResponse<null>, ApiError, GenreParams>;
