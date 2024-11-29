import "../../Styles/Layout.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ButtonGroup,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
} from "@mui/material";
import FeedbackDetail from "./components/FeedbackDetail";
import { fetchSingleData } from "../../utils/Utils";

const FeedbackBoard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  useEffect(() => {
    fetchSingleData(
      "feedback/get",
      (data) => {
        setFeedbacks(data.description);
      },
      "이벤트 목록 가져오기 실패"
    );
  }, []);

  const handleDetail = (feedbackData) => {
    console.log(feedbackData);

    setSelectedFeedback(feedbackData);
    setOpenEditDialog(true);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">피드백 목록</h2>
        <List>
          {feedbacks.length === 0 ? (
            <Typography
              variant="body2"
              style={{
                color: "#7556ff",
              }}
            >
              등록된 피드백이 없습니다.
            </Typography>
          ) : (
            feedbacks.map((item) => (
              <ListItem
                key={item.id}
                className="inputField"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "10px 0",
                }}
              >
                <Box
                  flexGrow={1}
                  style={{ display: "flex", alignItems: "flex-start" }}
                >
                  <Typography style={{ color: "#EAEAEA" }} variant="body2">
                    {item.description}
                  </Typography>
                </Box>
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    style={{
                      color: "#eaeaea",
                      backgroundColor: "#E6234C",
                      border: "none",
                    }}
                    onClick={() => handleDetail(item)}
                  >
                    자세히 보기
                  </Button>
                </ButtonGroup>
              </ListItem>
            ))
          )}
        </List>
      </div>

      {/* 피드백 대화상자 */}
      {openEditDialog && (
        <FeedbackDetail
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          selectedFeedback={selectedFeedback}
        />
      )}
    </div>
  );
};

export default FeedbackBoard;
