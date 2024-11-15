import React from "react";
import SingleForm from "../../components/SingleForm/SingleForm";

const EventType = () => {
  return (
    <SingleForm
      title="공연 종류 등록"
      label="공연 종류 제목"
      value="eventTypeName"
      apiEndpoint="eventType/register"
      successMessage="이벤트 타입 등록 성공"
      errorMessage="이벤트 타입 등록 실패"
    />
  );
};

export default EventType;
