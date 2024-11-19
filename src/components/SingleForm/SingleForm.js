import "../../Styles/Layout.css";
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { handleUploadSingleData } from "../../utils/Utils";

const SingleForm = ({
  title,
  label,
  textLabel,
  value,
  apiEndpoint,
  successMessage,
  errorMessage,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleUpload = async () => {
    const data = { [value]: inputValue }; // 동적으로 키를 설정

    await handleUploadSingleData(
      data,
      apiEndpoint,
      successMessage,
      errorMessage,
      value
    );
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">{title}</h2>
        <div className="inputField">
          <label className="label">{label}</label>
          <TextField
            label={textLabel}
            variant="outlined"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // 상태 업데이트
            sx={{
              "& .MuiInputLabel-root": {
                color: "white", // label 색상을 흰색으로 설정
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // borderRadius를 12로 설정
                backgroundColor: "#2A2830", // 배경색을 흰색으로 설정
                "& input": {
                  color: "#eaeaea", // value 색상을 흰색으로 설정
                },
              },
            }}
          />
        </div>

        <div className="buttonContainer">
          <Button
            onClick={handleUpload}
            variant="contained"
            sx={{
              backgroundColor: "#7556ff",
              "&:hover": {
                backgroundColor: "#292346",
              },
            }}
          >
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleForm;
