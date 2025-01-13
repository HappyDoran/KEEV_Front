import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
  EventEditFnType,
  EventEditParams,
  EventFnType,
  EventParams,
  GetEventByIDFnType,
  GetEventFnType,
  GetPagingationEventFnType,
  GetSearchedEventFnType,
} from './event.types';
import { instance } from './instance';

export const useGetEventList: GetEventFnType = () => {
  const getEventList = () => {
    return instance.get('/event/get');
  };

  return useQuery({
    queryKey: ['getEvent'],
    queryFn: getEventList,
    select: ({ data }) => {
      return data.events;
    },
  });
};

export const useGetEventById: GetEventByIDFnType = (eventId: string) => {
  const getEventById = (eventId: string) => {
    return instance.get(`/event/get/${eventId}`);
  };

  return useQuery({
    queryKey: ['getEvent', eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
    select: ({ data }) => {
      return data.events;
    },
  });
};

export const useGetEventByPagination: GetPagingationEventFnType = () => {
  const getEventListByPagination = (page: number) => {
    return instance.get(`/event/get/sortBy?page=${page}`);
  };

  return useInfiniteQuery({
    queryKey: ['infiniteEvents'],
    queryFn: ({ pageParam = 0 }) => getEventListByPagination(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data.contents.length) return undefined;
      return allPages.length + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page.data.contents);
    },
  });
};

export const useGetSearchedEvent: GetSearchedEventFnType = (name: string) => {
  const getSearchedEvent = (page: number, searchName: string) => {
    return instance.get(`/event/get/search`, {
      params: {
        page,
        name: searchName,
      },
    });
  };

  return useInfiniteQuery({
    queryKey: ['searchEvents', name],
    queryFn: ({ pageParam = 0 }) => getSearchedEvent(pageParam, name),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data.contents.length) return undefined;
      return allPages.length + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page.data.contents);
    },
    enabled: Boolean(name),
  });
};

export const useDeleteEvent = () => {
  const deleteEvent = (event_num: string) => instance.delete(`/event/delete/${event_num}`);

  return useMutation({ mutationFn: deleteEvent });
};

export const useEditEvent: EventEditFnType = (onSuccess, onError) => {
  const editEvent = async ({ file, files, data, event_num }: EventEditParams) => {
    const formData = new FormData();

    formData.append('eventData', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('posterImage', file);
    }

    files.forEach((file) => {
      formData.append('descriptionImages', file);
    });

    return instance.patch(`/event/update/${event_num}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return useMutation({
    mutationFn: editEvent,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useEvent: EventFnType = (onSuccess, onError) => {
  const event = async ({ file, files, data }: EventParams) => {
    const formData = new FormData();

    formData.append('eventData', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('posterImage', file);
    }

    files.forEach((file) => {
      formData.append('descriptionImages', file);
    });

    return instance.post('/event/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return useMutation({
    mutationFn: event,
    onSuccess: onSuccess,
    onError: onError,
  });
};
