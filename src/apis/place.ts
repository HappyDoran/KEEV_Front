import { useMutation, useQuery } from '@tanstack/react-query';
import { instance } from './instance';
import { GetPlaceFnType, PlaceFnType, PlaceParams } from './place.types';

export const useGetPlaceList: GetPlaceFnType = () => {
  const getPlaceList = () => {
    return instance.get('/place/get');
  };

  return useQuery({
    queryKey: ['getPlace'],
    queryFn: getPlaceList,
    select: ({ data }) => {
      return data.places;
    },
  });
};

export const usePlace: PlaceFnType = (onSuccess, onError) => {
  const place = (params: PlaceParams) => {
    return instance.post('/place/register', params);
  };

  return useMutation({
    mutationFn: place,
    onSuccess: onSuccess,
    onError: onError,
  });
};
