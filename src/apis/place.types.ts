import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ApiError, ApiResponse, ErrorFunctionType, SuccessFunctionType } from '../types/common';

export type Place = {
  address: string;
  countryName: string;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
};

export type GetPlaceFnType = () => UseQueryResult<Place[]>;

export type PlaceParams = {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  countryID: number;
};

export type PlaceFnType = (
  onSuccess: SuccessFunctionType<null>,
  onError: ErrorFunctionType,
) => UseMutationResult<ApiResponse<null>, ApiError, PlaceParams>;
