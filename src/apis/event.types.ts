import { UseInfiniteQueryResult, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ApiError, ApiResponse, ErrorFunctionType, SuccessFunctionType } from '../types/common';
import { EventType } from './eventType.types';
import { ArtistSummary } from './artist.types';
import { Genre } from './genre.types';
import { Place } from './place.types';

export type KeevEvent = {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  reservationStartDate: string | null;
  name: string;
  eventType: EventType[];
  artists: ArtistSummary[];
  genres: Genre[];
  places: Place[];
  descriptionImageURLS: string[];
  posterImageURL: string;
  createDate: string;
};

export type GetEventFnType = () => UseQueryResult<KeevEvent[]>;

export type GetEventByIDFnType = (eventId: string) => UseQueryResult<KeevEvent[]>;

export type PaginationEvent = {
  id: string;
  reservationStartDate: string | null;
  startDate: string;
  endDate: string;
  name: string;
  createdDate: string;
  posterURL: string;
  placeNames: string[];
};

export type GetPagingationEventFnType = () => UseInfiniteQueryResult<PaginationEvent[]>;

export type GetSearchedEventFnType = (name: string) => UseInfiniteQueryResult<PaginationEvent[]>;

export type EventDataParams = {
  eventName: string;
  placeIDs: number[];
  genreIDs: number[];
  artistIDs: number[];
  eventTypeID: number;
  startDate: string;
  endDate: string;
  startTime: string;
  description: string;
  reservationStartDate: string;
};

export type EventParams = {
  file: File;
  files: File[];
  data: EventDataParams;
};

export type EventFnType = (
  onSuccess: SuccessFunctionType<null>,
  onError: ErrorFunctionType,
) => UseMutationResult<ApiResponse<null>, ApiError, EventParams>;

export type EventEditParams = {
  file: File;
  files: File[];
  data: EventDataParams;
  event_num: string;
};

export type EventEditFnType = (
  onSuccess: SuccessFunctionType<null>,
  onError: ErrorFunctionType,
) => UseMutationResult<ApiResponse<null>, ApiError, EventEditParams>;
