const fs = require("fs");
const path = require("path");

const eventTypeFilePath = path.join(__dirname, "../data/eventType.json");
let nextEventTypeId = 1;

// 이벤트 등록
const addEventType = (req, res) => {
  const { eventTypeName } = req.body; // 'eventTypeName'으로 수정

  // 필수 필드 확인
  if (!eventTypeName) {
    return res.status(400).json({ message: "이벤트 종류가 필요합니다." });
  }

  // 기존 이벤트 종류 데이터 읽기
  let eventTypeData = { eventTypes: [] };
  if (fs.existsSync(eventTypeFilePath)) {
    const data = fs.readFileSync(eventTypeFilePath, "utf-8");
    try {
      eventTypeData = JSON.parse(data);
      if (!Array.isArray(eventTypeData.eventTypes)) {
        eventTypeData.eventTypes = [];
      }
      // 다음 이벤트 종류 ID 계산
      if (eventTypeData.eventTypes.length > 0) {
        nextEventTypeId =
          eventTypeData.eventTypes[eventTypeData.eventTypes.length - 1].id + 1; // 'id'로 변경
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  }

  // 새로운 이벤트 종류 추가
  const newEventType = { id: nextEventTypeId++, name: eventTypeName }; // 'id'와 'eventTypeName'으로 수정
  eventTypeData.eventTypes.push(newEventType);

  // eventType.json 파일에 저장
  try {
    fs.writeFileSync(eventTypeFilePath, JSON.stringify(eventTypeData, null, 2));
    res.status(201).json({
      message: "이벤트 종류 등록 성공",
      id: newEventType.id, // 'id'로 변경
    });
  } catch (error) {
    console.error("Error writing to eventType.json:", error);
    return res.status(500).json({ message: "서버 오류: 파일 쓰기 오류" });
  }
};

// 이벤트 목록 조회
const getEventTypes = (req, res) => {
  if (fs.existsSync(eventTypeFilePath)) {
    const data = fs.readFileSync(eventTypeFilePath, "utf-8");
    try {
      const eventTypeData = JSON.parse(data);

      // 클라이언트가 기대하는 형식으로 응답
      res.json({ eventTypes: eventTypeData.eventTypes });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    res.json({ eventTypes: [] }); // 파일이 없으면 빈 배열 반환
  }
};

// 특정 이벤트 타입 조회
const getEventTypeById = (req, res) => {
  const { id } = req.params; // URL에서 ID 가져오기

  if (fs.existsSync(eventTypeFilePath)) {
    const data = fs.readFileSync(eventTypeFilePath, "utf-8");
    try {
      const eventTypeData = JSON.parse(data);
      const eventType = eventTypeData.eventTypes.find(
        (type) => type.id === parseInt(id)
      ); // ID로 이벤트 타입 찾기

      if (eventType) {
        res.json(eventType); // 해당 이벤트 타입 반환
      } else {
        res.status(404).json({ message: "이벤트 타입을 찾을 수 없습니다." }); // 이벤트 타입이 없을 경우
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    res.status(404).json({ message: "이벤트 타입 파일이 존재하지 않습니다." }); // 파일이 없을 경우
  }
};

// 이벤트 수정
const updateEventTypes = (req, res) => {
  // 이벤트 타입 수정 로직...
};

// 이벤트 삭제
const deleteEventTypes = (req, res) => {
  // 이벤트 타입 삭제 로직...
};

module.exports = {
  addEventType,
  getEventTypes,
  getEventTypeById,
  updateEventTypes,
  deleteEventTypes,
};
