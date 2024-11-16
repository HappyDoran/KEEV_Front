import "../../Styles/Layout.css";
import "../../Styles/Component.css";
import React, { useState, useEffect } from "react";
import { TextField, Button, TextareaAutosize } from "@mui/material";
import axios from "axios";
import { handleAddItem, handleRemoveItem } from "../../utils/Utils";
import MultiSelectAutocomplete from "../../components/MultiSelectAutocomplete/MultiSelectAutocomplete";
import SingleSelectAutocomplete from "../../components/SingleSelectAutocomplete/SingleSelectAutocomplete";

const Event = () => {
  const [event, setEvent] = useState({
    eventName: "",
    placeIDs: [],
    genreIDs: [],
    artistIDs: [],
    eventTypeID: null,
    startDate: "",
    endDate: "",
    startTime: "",
    description: "",
    reservationStartDate: "",
  });

  const [places, setPlaces] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [posterImage, setPosterImage] = useState(null);
  const [descriptionImages, setDescriptionImages] = useState([]);
  const [previewPosterImage, setPreviewPosterImage] = useState(null);
  const [previewDescriptionImages, setPreviewDescriptionImages] = useState([]);

  const handleImage = (type, e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (type === "poster") {
          setPosterImage(file);
          setPreviewPosterImage(reader.result);
        } else if (type === "description") {
          setDescriptionImages((prevImages) => [...prevImages, file]);
          setPreviewDescriptionImages((prevPreviews) => [
            ...prevPreviews,
            reader.result,
          ]);
        }
      };
    });
  };

  const handleRemoveDescriptionImage = (indexToRemove) => {
    setDescriptionImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setPreviewDescriptionImages((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemovePosterImage = () => {
    setPosterImage(null);
    setPreviewPosterImage(null);
  };

  const handleUpload = async () => {
    // 필수 값 체크
    if (
      !event.eventName ||
      !posterImage ||
      !event.startDate ||
      !event.endDate ||
      !event.genreIDs.length ||
      !event.eventTypeID ||
      !event.placeIDs.length
    ) {
      alert("빈칸없이 채워주세요");
      return;
    }

    // 이벤트 데이터 객체 생성
    const eventData = {
      eventName: event.eventName,
      description: event.description,
      placeIDs: event.placeIDs,
      genreIDs: event.genreIDs,
      artistIDs: event.artistIDs,
      eventTypeID: event.eventTypeID,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime !== "" ? `${event.startTime}:00` : "00:00:00",
      reservationStartDate: event.reservationStartDate,
    };

    // FormData 객체 생성
    const formData = new FormData();

    // Blob으로 변환하여 FormData에 추가
    const json = JSON.stringify(eventData);

    const blob = new Blob([json], { type: "application/json" });
    formData.append("eventData", blob);

    // posterImage 추가
    formData.append("posterImage", posterImage);

    // descriptionImages 추가
    descriptionImages.forEach((file) => {
      formData.append("descriptionImages", file);
    });

    // 디버깅을 위한 콘솔 로그
    for (const x of formData.entries()) {
      console.log(x);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/event/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Content-Type을 명시적으로 설정
          },
        }
      );
      alert("이벤트 등록 성공: " + response.data.id);
      window.location.reload();
    } catch (error) {
      console.error("이벤트 등록 실패:", error);
      alert("이벤트 등록 실패");
    }
  };

  const fetchSingleData = async (url, setData, errorMessage) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/${url}`);
      setData(response.data);
    } catch (error) {
      console.error(`${errorMessage}:`, error);
    }
  };

  useEffect(() => {
    fetchSingleData(
      "place/get",
      (data) => setPlaces(data.places),
      "장소 목록 가져오기 실패"
    );

    fetchSingleData(
      "genre/get",
      (data) => setGenres(data.genres),
      "장르 목록 가져오기 실패"
    );

    fetchSingleData(
      "artist/get",
      (data) => setArtists(data.artists),
      "아티스트 목록 가져오기 실패"
    );

    fetchSingleData(
      "eventType/get",
      (data) => setEventTypes(data.eventTypes),
      "공연 종류 목록 가져오기 실패"
    );
  }, []);

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">이벤트 등록</h2>

        {/* 이벤트 이름 */}
        <div className="inputField">
          <label className="label">이벤트 이름</label>
          <TextField
            label="이벤트 이름"
            variant="outlined"
            fullWidth
            value={event.eventName}
            onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
          />
        </div>

        {/* 장소 선택 */}
        <MultiSelectAutocomplete
          options={places}
          selectedIds={event.placeIDs}
          setSelectedIds={(ids) => setEvent({ ...event, placeIDs: ids })}
          label="이벤트 장소 선택"
          textLabel="장소 선택"
        />

        {/* 선택된 장소 목록 */}
        <div className="selectedCountries" style={{ marginTop: "20px" }}>
          {event.placeIDs.map((id) => (
            <div key={id} className="countryChip">
              <span>{places.find((p) => p.id === id)?.name}</span>
              <button
                className="removeButton"
                onClick={() =>
                  handleRemoveItem("placeIDs", setEvent, event, id)
                }
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* 장르 선택 */}
        <MultiSelectAutocomplete
          options={genres}
          selectedIds={event.genreIDs}
          setSelectedIds={(ids) => setEvent({ ...event, genreIDs: ids })}
          label="이벤트 장르 선택"
          textLabel="장르 선택"
        />

        {/* 선택된 장르 목록 */}
        <div className="selectedCountries" style={{ marginTop: "20px" }}>
          {event.genreIDs.map((id) => (
            <div key={id} className="countryChip">
              <span>{genres.find((g) => g.id === id)?.name}</span>
              <button
                className="removeButton"
                onClick={() =>
                  handleRemoveItem("genreIDs", setEvent, event, id)
                }
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* 아티스트 선택 */}
        <MultiSelectAutocomplete
          options={artists}
          selectedIds={event.artistIDs}
          setSelectedIds={(ids) => setEvent({ ...event, artistIDs: ids })}
          label="아티스트 선택 선택"
          textLabel="아티스트 선택"
        />

        {/* 선택된 아티스트 목록 */}
        <div className="selectedCountries" style={{ marginTop: "20px" }}>
          {event.artistIDs.map((id) => (
            <div key={id} className="countryChip">
              <span>{artists.find((a) => a.id === id)?.name}</span>
              <button
                className="removeButton"
                onClick={() =>
                  handleRemoveItem("artistIDs", setEvent, event, id)
                }
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* 공연 종류 선택 */}
        <SingleSelectAutocomplete
          options={eventTypes}
          selectedID={event.eventTypeID}
          setSelectedID={(id) => setEvent({ ...event, eventTypeID: id })}
          label="공연 종류 선택"
          textLabel="공연 종류 선택"
        />

        {/* 날짜 및 시간 입력 */}
        <div className="inputField">
          <TextField
            label="시작 날짜"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={event.startDate}
            onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
          />
        </div>

        <div className="inputField">
          <TextField
            label="종료 날짜"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={event.endDate}
            onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
          />
        </div>

        {/* 시간 입력 */}
        <div className="inputField">
          <TextField
            label="시작 시간"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={event.startTime}
            onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
          />
        </div>

        {/* 설명 입력 */}
        <div className="inputField">
          <label className="label">공연 설명</label>
          <TextareaAutosize
            aria-label="content"
            minRows={5}
            style={{ width: "100%", height: "50px", resize: "none" }}
            placeholder="상세 설명을 입력해주세요."
            value={event.description || ""}
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value })
            }
          />
        </div>

        {/* 포스터 이미지 업로드 */}
        <div className="inputField">
          <label className="label">포스터 이미지 업로드</label>
          <input
            type="file"
            accept=".png,.jpeg"
            onChange={(e) => handleImage("poster", e)}
          />
        </div>

        {/* 포스터 이미지 미리보기 */}
        {previewPosterImage && (
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <img
              src={previewPosterImage}
              alt="포스터 미리보기"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <button
              onClick={handleRemovePosterImage}
              style={{
                position: "relative",
                top: "-175px",
                right: "25px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        )}

        {/* 상세 이미지 업로드 */}
        <div className="inputField">
          <label className="label">상세 이미지 업로드</label>
          <input
            type="file"
            accept=".png,.jpeg"
            onChange={(e) => handleImage("description", e)}
          />
        </div>

        {/* 선택된 상세 이미지 목록 */}
        {previewDescriptionImages.length > 0 && (
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {previewDescriptionImages.map((previewUrl, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={previewUrl}
                    alt={`description-${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={() => handleRemoveDescriptionImage(index)}
                    style={{
                      position: "relative",
                      top: "-75px",
                      right: "25px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 예약 시작일 입력 */}
        <div className="inputField">
          <TextField
            label="예약 시작일"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={event.reservationStartDate}
            onChange={(e) =>
              setEvent({ ...event, reservationStartDate: e.target.value })
            }
          />
        </div>

        {/* 등록 버튼 */}
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

export default Event;
