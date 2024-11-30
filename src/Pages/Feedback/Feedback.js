import "../../Styles/Layout.css";
import "../../Styles/Component.css";
import React, { useState, useEffect } from "react";
import { TextField, Button, TextareaAutosize } from "@mui/material";
import axios from "axios";
import { fetchSingleData } from "../../utils/Utils";
import MultiSelectAutocomplete from "../../components/MultiSelectAutocomplete/MultiSelectAutocomplete";

const FeedBack = () => {
  const [feedbackDescription, setFeedbackDescription] = useState("");

  const API_URL = process.env.REACT_APP_URL;

  const handleUpload = async () => {
    if (!feedbackDescription) {
      alert("피드백 내용을 입력해주세요.");
      return;
    }

    const feedbackData = { ["description"]: feedbackDescription };

    console.log(feedbackData);

    try {
      const response = await axios.post(
        `${API_URL}/feedback/register`,
        feedbackData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("피드백이 성공적으로 등록되었습니다!");
      setFeedbackDescription(""); // 피드백 제출 후 초기화
    } catch (error) {
      console.error("피드백 등록 중 오류 발생:", error);
      alert("피드백 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">피드백을 남겨주시면 감사하겠습니다.</h2>
        <div className="inputField">
          <label className="label">피드백 작성란</label>
          <TextareaAutosize
            aria-label="content"
            minRows={5}
            style={{
              width: "100%",
              height: "100px",
              resize: "none",
              borderRadius: "12px", // borderRadius를 12로 설정
              backgroundColor: "#2A2830", // 배경색을 설정
              color: "#eaeaea", // value 색상을 설정
              border: "none", // 테두리 제거 (원하는 경우)
            }}
            placeholder="내용을 입력해주세요."
            value={feedbackDescription}
            onChange={(e) => setFeedbackDescription(e.target.value)}
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

export default FeedBack;
