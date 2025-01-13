import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ApiError, ApiResponse, ErrorFunctionType, SuccessFunctionType } from '../types/common';
import { Country } from './country.types';
import { Genre } from './genre.types';

export type Artist = {
  id: number;
  name: string;
  profileImage: string;
  description: string;
  countries: Country[];
  genres: Genre[];
  events: any[];
};

export type GetArtistFnType = () => UseQueryResult<Artist[]>;

export type ArtistDataParams = {
  artistName: string;
  genreIDs: number[];
  description: string | null;
  countryIDs: number[];
};

export type ArtistParams = {
  file: File;
  data: ArtistDataParams;
};

export type ArtistFnType = (
  onSuccess: SuccessFunctionType<null>,
  onError: ErrorFunctionType,
) => UseMutationResult<ApiResponse<null>, ApiError, ArtistParams>;

export type ArtistSummary = Omit<
  Artist,
  'description' | 'countries' | 'genres' | 'events' | 'profileImage'
> & {
  profileImageURL: string;
};
