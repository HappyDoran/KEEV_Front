const fs = require("fs");
const path = require("path");

// 이벤트 데이터가 저장될 파일 경로 설정
const eventFilePath = path.join(__dirname, "../data/event.json");

// 이벤트 등록 (POST 요청)
const addEvent = (req, res) => {
  const {
    eventName,
    description,
    placeIDs,
    genreIDs,
    artistIDs,
    eventTypeID,
    startDate,
    endDate,
    startTime,
    reservationStartDate,
  } = req.body;

  const posterImage = req.files?.posterImage; // Multer를 통해 업로드된 포스터 이미지
  const descriptionImages = req.files?.descriptionImages || []; // 여러 설명 이미지를 처리

  // console.log(req.body);
  console.log(req.file);
  // console.log(req.files?.descriptionImages);

  // 필수 항목 확인
  if (
    !eventName ||
    !posterImage ||
    !startDate ||
    !endDate ||
    !genreIDs ||
    !eventTypeID ||
    !placeIDs
  ) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  // 나라 및 장르 ID 배열 파싱
  let parsedPlaceIDs, parsedGenreIDs, parsedArtistIDs;
  try {
    parsedPlaceIDs = JSON.parse(placeIDs);
    parsedGenreIDs = JSON.parse(genreIDs);
    parsedArtistIDs = artistIDs ? JSON.parse(artistIDs) : [];
  } catch (error) {
    return res.status(400).json({ message: "잘못된 형식의 데이터입니다." });
  }

  // 기존 이벤트 데이터를 읽어옴
  fs.readFile(eventFilePath, (err, data) => {
    if (err && err.code !== "ENOENT") {
      return res.status(500).json({ message: "파일 읽기 실패" });
    }

    let eventData = { events: [] };

    // 파일이 비어있지 않으면 기존 데이터를 파싱
    if (data && data.length > 0) {
      try {
        eventData = JSON.parse(data);
        if (!Array.isArray(eventData.events)) {
          return res.status(500).json({ message: "잘못된 데이터 형식입니다." });
        }
      } catch (parseError) {
        return res.status(500).json({ message: "파일 파싱 실패" });
      }
    }

    // 새 이벤트 ID 생성 (기존 이벤트 수에 따라 증가)
    const newEventId = eventData.events.length + 1;

    const posterImagePath = posterImage.map((file) => file.path);
    // 설명 이미지 경로 배열 생성
    const descriptionImagePaths = descriptionImages.map((file) => file.path);

    // 새 이벤트 객체 생성
    const newEvent = {
      id: newEventId,
      name: eventName,
      description,
      placeIDs: parsedPlaceIDs,
      genreIDs: parsedGenreIDs,
      artistIDs: parsedArtistIDs,
      eventTypeID: parseInt(eventTypeID),
      startDate,
      endDate,
      startTime,
      posterURL: posterImagePath[0], // 포스터 이미지 경로 저장
      descriptionImageURL: descriptionImagePaths, // 설명 이미지 경로 배열 저장
    };

    // 새 이벤트 데이터를 배열에 추가
    eventData.events.push(newEvent);

    // 업데이트된 데이터를 다시 파일에 저장
    fs.writeFile(eventFilePath, JSON.stringify(eventData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "파일 쓰기 실패" });
      }
      res.status(201).json({ message: "이벤트 등록 성공", id: newEvent.id });
    });
  });
};

// 이벤트 목록 조회
const getEvents = (req, res) => {
  if (fs.existsSync(eventFilePath)) {
    const data = fs.readFileSync(eventFilePath, "utf-8");
    try {
      const eventData = JSON.parse(data);

      res.json({ events: eventData.events });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    res.json({ events: [] }); // 파일이 없으면 빈 배열 반환
  }
};

// 이벤트 수정
const updateEvent = (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;

  if (fs.existsSync(eventFilePath)) {
    const data = fs.readFileSync(eventFilePath, "utf-8");
    try {
      const dbData = JSON.parse(data);
      const index = dbData.events.findIndex(
        (event) => event.id === parseInt(id)
      );

      if (index !== -1) {
        dbData.events[index] = { ...dbData.events[index], ...updatedEvent };
        fs.writeFileSync(eventFilePath, JSON.stringify(dbData, null, 2));
        return res.status(200).json(updatedEvent);
      } else {
        return res.status(404).json({ message: "이벤트를 찾을 수 없습니다." });
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    return res
      .status(404)
      .json({ message: "이벤트 파일이 존재하지 않습니다." });
  }
};

// 이벤트 삭제
const deleteEvent = (req, res) => {
  const { id } = req.params;

  if (fs.existsSync(eventFilePath)) {
    const data = fs.readFileSync(eventFilePath, "utf-8");
    try {
      const dbData = JSON.parse(data);
      const updatedEvents = dbData.Events.filter(
        (event) => event.eventID !== parseInt(id)
      );

      dbData.Events = updatedEvents;
      fs.writeFileSync(eventFilePath, JSON.stringify(dbData, null, 2));
      return res.status(204).send(); // No Content
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    return res
      .status(404)
      .json({ message: "이벤트 파일이 존재하지 않습니다." });
  }
};

module.exports = {
  addEvent,
  getEvents,
  updateEvent,
  deleteEvent,
};
