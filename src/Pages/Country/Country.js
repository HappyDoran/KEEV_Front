import React from "react";
import SingleForm from "../../components/SingleForm/SingleForm";

const Country = () => {
  return (
    <SingleForm
      title="나라 등록"
      label="나라 이름*"
      textLabel="나라 이름"
      value="countryName"
      apiEndpoint="country/register"
      successMessage="나라 등록 성공"
      errorMessage="나라 등록 실패"
    />
  );
};

export default Country;
