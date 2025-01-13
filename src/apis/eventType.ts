import { useMutation, useQuery } from '@tanstack/react-query';
import { instance } from './instance';
import { EventTypeFnType, EventTypeParams, GetEventTypeFnType } from './eventType.types';

export const useGetEventTypeList: GetEventTypeFnType = () => {
  const getEventTypeList = () => {
    return instance.get('/eventType/get');
  };
  return useQuery({
    queryKey: ['getEventType'],
    queryFn: getEventTypeList,
    select: ({ data }) => {
      return data.eventTypes;
    },
  });
};

export const useEventType: EventTypeFnType = (onSuccess, onError) => {
  const eventType = (params: EventTypeParams) => {
    return instance.post('/eventType/register', params);
  };

  return useMutation({
    mutationFn: eventType,
    onSuccess: onSuccess,
    onError: onError,
  });
};
