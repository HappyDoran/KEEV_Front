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
import Event from "../Event/Event";
import MultiSelectAutocomplete from "../../components/MultiSelectAutocomplete/MultiSelectAutocomplete";
import { fetchSingleData } from "../../utils/Utils";
import Edit from "./Edit";

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
    console.log(eventData);

    setSelectedEvent(eventData);
    setOpenEditDialog(true);
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

                    <Typography style={{ color: "#EAEAEA" }} variant="body2">
                      공연장:{" "}
                      {item.places && item.places.length > 0
                        ? item.places
                            .map((place, index) => place.name)
                            .join(", ")
                        : "등록된 공연장이 없습니다."}
                    </Typography>

                    <Typography style={{ color: "#EAEAEA" }} variant="body2">
                      아티스트:{" "}
                      {item.artists && item.artists.length > 0
                        ? item.artists
                            .map((artist, index) => artist.name)
                            .join(", ")
                        : "등록된 공연장이 없습니다."}
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
      {openEditDialog && (
        <Edit
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setEvents={setEvents}
          setFilteredEvents={setFilteredEvents}
        />
      )}
    </div>
  );
};

export default Board;
