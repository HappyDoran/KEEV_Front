import SingleForm from '../../components/SingleForm';
import { useEventType } from '../../apis/eventType';
import { ApiError, ApiResponse } from '../../types/common';
import { EventTypeParams } from '../../apis/eventType.types';

const Type = () => {
  const onSuccess = (data: ApiResponse<null>) => {
    alert('이벤트 타입 등록 성공');
    window.location.reload();
  };

  const onError = (error: ApiError) => {
    console.error('이벤트 타입 등록 실패:', error);
    alert('이벤트 타입 등록 실패');
  };

  // useEventType 훅을 호출합니다.
  const { mutate } = useEventType(onSuccess, onError);

  // 폼 제출 핸들러
  const handleSubmit = (inputValue: string) => {
    if (!inputValue.trim()) {
      alert('공연 종류 제목을 입력해주세요.');
      return;
    }

    const data: EventTypeParams = { eventTypeName: inputValue };

    mutate(data);
  };

  return (
    <SingleForm
      title="공연 종류 등록"
      label="공연 종류 제목*"
      textLabel="공연 종류 제목"
      value="eventType"
      handleSubmit={handleSubmit}
    />
  );
};

export default Type;
