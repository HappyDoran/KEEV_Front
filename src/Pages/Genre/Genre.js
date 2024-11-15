import React from "react";
import SingleForm from "../../components/SingleForm/SingleForm";

const Genre = () => {
  return (
    <SingleForm
      title="장르 등록"
      label="장르 이름"
      value="genreName"
      apiEndpoint="genre/register"
      successMessage="장르 등록 성공"
      errorMessage="장르 등록 실패"
    />
  );
};

export default Genre;
