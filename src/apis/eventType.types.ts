import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ApiError, ApiResponse, ErrorFunctionType, SuccessFunctionType } from '../types/common';

// 서버에서 response 해오는 타입의 형태
export type EventType = {
  id: number;
  name: string;
};

export type GetEventTypeFnType = () => UseQueryResult<EventType[]>;

export type EventTypeParams = {
  eventTypeName: string;
};

export type EventTypeFnType = (
  onSuccess: SuccessFunctionType<null>,
  onError: ErrorFunctionType,
) => UseMutationResult<ApiResponse<null>, ApiError, EventTypeParams>;
