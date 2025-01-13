import SingleForm from '../../components/SingleForm';
import { useCountry } from '../../apis/country';
import { ApiError, ApiResponse } from '../../types/common';
import { CountryParams } from '../../apis/country.types';

const Country = () => {
  const onSuccess = (data: ApiResponse<null>) => {
    alert('나라 등록 성공');
    window.location.reload();
  };

  const onError = (error: ApiError) => {
    console.error('나라 등록 실패:', error);
    alert('나라 등록 실패');
  };

  const { mutate } = useCountry(onSuccess, onError);

  const handleSubmit = (inputValue: string) => {
    if (!inputValue.trim()) {
      alert('나라 이름을 입력해주세요.');
      return;
    }

    const data: CountryParams = { countryName: inputValue };

    mutate(data);
  };

  return (
    <SingleForm
      title="나라 등록"
      label="나라 이름*"
      textLabel="나라 이름"
      value="country"
      handleSubmit={handleSubmit}
    />
  );
};

export default Country;
