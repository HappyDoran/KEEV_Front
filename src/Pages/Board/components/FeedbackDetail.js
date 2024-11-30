import "../../../Styles/Layout.css";
import "../../../Styles/Component.css";
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";

const FeedbackDetail = ({
  selectedFeedback,
  openEditDialog,
  setOpenEditDialog,
}) => {
  const API_URL = process.env.REACT_APP_URL;

  const handleDelete = async (feedbackID) => {
    try {
      await axios.delete(`${API_URL}/feedback/delete/${feedbackID}`);
      alert(`피드백 삭제를 성공했습니다!`);
      setOpenEditDialog(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("피드백 삭제 실패");
    }
  };

  return (
    <Dialog
      open={openEditDialog}
      onClose={() => setOpenEditDialog(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          backgroundColor: "#100f11",
          color: "#7556ff",
        }}
      >
        피드백 자세히 보기
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "#100f11",
        }}
      >
        <div className="inputField">
          <Typography
            variant="body2"
            style={{
              color: "#EAEAEA",
              wordBreak: "break-word", // 단어가 길어도 줄바꿈
              lineHeight: 1.5, // 줄 간격 조정
              overflowWrap: "break-word", // 긴 단어가 있을 경우 줄바꿈
            }}
          >
            {selectedFeedback.description}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#100f11",
        }}
      >
        <Button
          onClick={() => handleDelete(selectedFeedback.id)}
          sx={{
            color: "#eaeaea",
            backgroundColor: "#E6234C",
            "&:hover": {
              backgroundColor: "#2A2830",
            },
          }}
        >
          삭제
        </Button>
        <Button
          onClick={() => setOpenEditDialog(false)}
          sx={{
            color: "#eaeaea",
            backgroundColor: "#818181",
            "&:hover": {
              backgroundColor: "#2A2830",
            },
          }}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDetail;
