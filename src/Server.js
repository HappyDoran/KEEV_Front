const express = require("express");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes");
const eventTypeRoutes = require("./routes/eventTypeRoutes");
const countryRoutes = require("./routes/countryRoutes");
const genreRoutes = require("./routes/genreRoutes");
const placeRoutes = require("./routes/placeRoutes");
const artistRoutes = require("./routes/artistRoutes");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use("/event", eventRoutes);
app.use("/eventType", eventTypeRoutes);
app.use("/country", countryRoutes);
app.use("/genre", genreRoutes);
app.use("/place", placeRoutes);
app.use("/artist", artistRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
