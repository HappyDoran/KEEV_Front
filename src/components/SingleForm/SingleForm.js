import "../../Styles/Layout.css";
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { handleUploadSingleData } from "../../utils/Utils";

const SingleForm = ({
  title,
  label,
  value,
  apiEndpoint,
  successMessage,
  errorMessage,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleUpload = async () => {
    const data = { [value]: inputValue }; // 동적으로 키를 설정
    console.log(data);

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
            label={label}
            variant="outlined"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // 상태 업데이트
          />
        </div>

        <div className="buttonContainer">
          <Button
            onClick={handleUpload}
            variant="contained"
            sx={{
              backgroundColor: "#34495e",
              "&:hover": {
                backgroundColor: "#2c3e50",
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
