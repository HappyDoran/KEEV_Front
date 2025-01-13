import { useMutation, useQuery } from '@tanstack/react-query';
import { GetArtistFnType, ArtistFnType, ArtistParams } from './artist.types';
import { instance } from './instance';

export const useGetArtistList: GetArtistFnType = () => {
  const getArtistLst = () => {
    return instance.get('/artist/get');
  };

  return useQuery({
    queryKey: ['getArtist'],
    queryFn: getArtistLst,
    select: ({ data }) => {
      return data.artists;
    },
  });
};

export const useArtist: ArtistFnType = (onSuccess, onError) => {
  const artist = async ({ file, data }: ArtistParams) => {
    const formData = new FormData();

    formData.append('artistData', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('profileImage', file);
    }

    return instance.post('/artist/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return useMutation({
    mutationFn: artist,
    onSuccess: onSuccess,
    onError: onError,
  });
};
