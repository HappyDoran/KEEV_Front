import { useMutation, useQuery } from '@tanstack/react-query';
import { instance } from './instance';
import { GenreFnType, GenreParams, GetGenreFnType } from './genre.types';

export const useGetGenreList: GetGenreFnType = () => {
  const getGenreList = () => {
    return instance.get('/genre/get');
  };
  return useQuery({
    queryKey: ['getGenre'],
    queryFn: getGenreList,
    select: ({ data }) => {
      return data.genres;
    },
  });
};

export const useGenre: GenreFnType = (onSuccess, onError) => {
  const genre = (params: GenreParams) => {
    return instance.post('/genre/register', params);
  };

  return useMutation({
    mutationFn: genre,
    onSuccess: onSuccess,
    onError: onError,
  });
};
