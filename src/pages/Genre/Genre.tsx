import SingleForm from '../../components/SingleForm';
import { useGenre } from '../../apis/genre';
import { ApiError, ApiResponse } from '../../types/common';
import { GenreParams } from '../../apis/genre.types';

const Genre = () => {
  const onSuccess = (data: ApiResponse<null>) => {
    alert('장르 등록 성공');
    window.location.reload();
  };

  const onError = (error: ApiError) => {
    console.error('장르 등록 실패:', error);
    alert('장르 등록 실패');
  };

  // useGenre 훅을 호출합니다.
  const { mutate } = useGenre(onSuccess, onError);

  // 폼 제출 핸들러
  const handleSubmit = (inputValue: string) => {
    if (!inputValue.trim()) {
      alert('장르 이름을 입력해주세요.');
      return;
    }

    const data: GenreParams = { genreName: inputValue };

    mutate(data);
  };

  return (
    <SingleForm
      title="장르 등록"
      label="장르 이름*"
      textLabel="장르 이름"
      value="genre"
      handleSubmit={handleSubmit}
    />
  );
};

export default Genre;
