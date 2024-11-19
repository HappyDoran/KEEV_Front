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
import { fetchSingleData } from "../../utils/Utils";

const Board = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const API_URL = process.env.REACT_APP_URL;

  useEffect(() => {
    fetchSingleData(
      "event/get",
      (data) => {
        setEvents(data.events);
        setFilteredEvents(data.events); // 초기 필터링된 이벤트 목록 설정
      },
      "이벤트 목록 가져오기 실패"
    );
  }, []);

  // 이벤트 검색
  const handleSearchChange = (event, value) => {
    setSearchTerm(value);
    const filtered = events.filter(
      (event) => event.name.toLowerCase().includes(value.toLowerCase()) // 이름에 검색어가 포함된 이벤트 필터링
    );
    setFilteredEvents(filtered);
  };

  // 이벤트 삭제
  const handleDelete = async (eventID) => {
    try {
      await axios.delete(`${API_URL}/event/${eventID}`);
      alert(`${eventID}번 이벤트 삭제를 성공했습니다!`);
      fetchSingleData(
        "event/get",
        (data) => {
          setEvents(data.events);
          setFilteredEvents(data.events);
        },
        "이벤트 목록 가져오기 실패"
      );
    } catch (error) {
      console.error(error);
      alert("이벤트 삭제 실패");
    }
  };

  // 이벤트 수정 대화상자 열기
  const handleEdit = (eventData) => {
    setSelectedEvent(eventData);
    setOpenEditDialog(true);
  };

  // 수정 완료
  const handleEditSubmit = async () => {
    try {
      const updatedEvent = { ...selectedEvent };

      await axios.put(`${API_URL}/event/${selectedEvent.id}`, updatedEvent);
      alert("이벤트 수정 성공");
      setOpenEditDialog(false);
      fetchSingleData(
        "event/get",
        (data) => {
          setEvents(data.events);
          setFilteredEvents(data.events); // 수정 후 목록 새로 고침
        },
        "이벤트 목록 가져오기 실패"
      );
    } catch (error) {
      console.error(error);
      alert("이벤트 수정 실패");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">이벤트 목록</h2>

        {/* 검색창 추가 */}
        <Autocomplete
          freeSolo
          options={events.map((option) => option.name)} // 이벤트 이름을 옵션으로 설정
          onInputChange={handleSearchChange} // 검색어 변경 시 호출
          renderInput={(params) => (
            <TextField
              {...params}
              label="이벤트 검색"
              variant="outlined"
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
          )}
          // filterOptions={(options, { inputValue }) => {
          //   const filtered = options.filter((option) =>
          //     option.name.toLowerCase().includes(inputValue.toLowerCase())
          //   );

          //   return filtered.slice(0, 5); // 최대 5개 항목만 표시
          // }}
        />

        <List>
          {filteredEvents.length === 0 ? (
            <Typography
              variant="body2"
              style={{
                color: "#7556ff",
              }}
            >
              등록된 이벤트가 없습니다.
            </Typography>
          ) : (
            filteredEvents.map((item) => (
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
                  {item.posterImageURL && (
                    <img
                      src={item.posterImageURL}
                      alt={item.name}
                      style={{
                        width: "100px",
                        height: "auto",
                        marginRight: "15px",
                      }}
                    />
                  )}
                  <Box>
                    <Typography style={{ color: "#EAEAEA" }}>
                      제목: {item.name}
                    </Typography>
                    <Typography style={{ color: "#EAEAEA" }} variant="body2">
                      시작일 - 종료일: {item.startDate} - {item.endDate}
                    </Typography>
                  </Box>
                </Box>
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    style={{
                      color: "#eaeaea",
                      backgroundColor: "#E6234C",
                      border: "none",
                    }}
                    onClick={() => handleEdit(item)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outlined"
                    style={{
                      color: "#eaeaea",
                      backgroundColor: "#818181",
                      border: "none",
                    }}
                    onClick={() => handleDelete(item.id)}
                  >
                    삭제
                  </Button>
                </ButtonGroup>
              </ListItem>
            ))
          )}
        </List>
      </div>

      {/* 수정 대화상자 */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        style={{}}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#100f11", // 배경색을 #100f11로 설정
            color: "#7556ff",
          }}
        >
          이벤트 수정
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: "#100f11", // 배경색을 #100f11로 설정
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            label="제목"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedEvent?.name || ""}
            onChange={(e) =>
              setSelectedEvent((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
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
          <TextField
            margin="dense"
            label="설명"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedEvent?.description || ""}
            onChange={(e) =>
              setSelectedEvent((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
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
          <TextField
            margin="dense"
            label="시작일"
            type="date"
            fullWidth
            variant="outlined"
            value={selectedEvent?.startDate || ""}
            onChange={(e) =>
              setSelectedEvent((prev) => ({
                ...prev,
                startDate: e.target.value,
              }))
            }
            InputLabelProps={{
              shrink: true,
            }}
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
          <TextField
            margin="dense"
            label="종료일"
            type="date"
            fullWidth
            variant="outlined"
            value={selectedEvent?.endDate || ""}
            onChange={(e) =>
              setSelectedEvent((prev) => ({
                ...prev,
                endDate: e.target.value,
              }))
            }
            InputLabelProps={{
              shrink: true,
            }}
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
          <TextField
            margin="dense"
            label="포스터 이미지 URL"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedEvent?.posterURL || ""}
            onChange={(e) =>
              setSelectedEvent((prev) => ({
                ...prev,
                posterURL: e.target.value,
              }))
            }
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
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "#100f11", // 배경색을 #100f11로 설정
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
            취소
          </Button>
          <Button
            onClick={handleEditSubmit}
            sx={{
              color: "#eaeaea",
              backgroundColor: "#7556ff",
              "&:hover": {
                backgroundColor: "#292346",
              },
            }}
          >
            수정 완료
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Board;
