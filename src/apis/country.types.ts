import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ApiError, ApiResponse, ErrorFunctionType, SuccessFunctionType } from '../types/common';

export type Country = {
  id: number;
  name: string;
};

export type GetCountryFnType = () => UseQueryResult<Country[]>;

export type CountryParams = {
  countryName: string;
};

export type CountryFnType = (
  onSuccess: SuccessFunctionType<null>,
  onError: ErrorFunctionType,
) => UseMutationResult<ApiResponse<null>, ApiError, CountryParams>;
