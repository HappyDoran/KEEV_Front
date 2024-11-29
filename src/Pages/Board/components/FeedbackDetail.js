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

const FeedbackDetail = ({
  selectedFeedback,
  openEditDialog,
  setOpenEditDialog,
}) => {
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
        피드백을 자세히 보기
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
