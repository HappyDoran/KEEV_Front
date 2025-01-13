import { useMutation, useQuery } from '@tanstack/react-query';
import { instance } from './instance';
import { CountryFnType, CountryParams, GetCountryFnType } from './country.types';

export const useGetCountryList: GetCountryFnType = () => {
  const getCountryList = () => {
    return instance.get('/country/get');
  };
  return useQuery({
    queryKey: ['getCountry'],
    queryFn: getCountryList,
    select: ({ data }) => {
      return data.countries;
    },
  });
};

export const useCountry: CountryFnType = (onSuccess, onError) => {
  const country = (params: CountryParams) => {
    return instance.post('/country/register', params);
  };

  return useMutation({
    mutationFn: country,
    onSuccess: onSuccess,
    onError: onError,
  });
};
