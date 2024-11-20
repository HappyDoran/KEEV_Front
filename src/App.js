import "./Styles/App.css";
import React, { useState } from "react"; // useState 추가
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Event from "./Pages/Event/Event";
import Board from "./Pages/Board/Board";
import EventType from "./Pages/EventType/EventType";
import Country from "./Pages/Country/Country";
import Genre from "./Pages/Genre/Genre";
import Place from "./Pages/Place/Place";
import Artist from "./Pages/Artist/Artist";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar 상태 관리

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Sidebar 열기/닫기 토글
  };

  return (
    <Router>
      <div>
        <div style={{ display: "flex" }}>
          <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main
            style={{
              flexGrow: 1,
              padding: "20px",
              transition: "margin-left 0.3s ease", // 부드러운 전환 효과 추가
              marginLeft: sidebarOpen ? "250px" : "0", // Sidebar가 열릴 때 margin 조정
            }}
          >
            <Routes>
              <Route path="/eventType/create" element={<EventType />} />
              <Route path="/country/create" element={<Country />} />
              <Route path="/genre/create" element={<Genre />} />
              <Route path="/place/create" element={<Place />} />
              <Route path="/artist/create" element={<Artist />} />
              <Route path="/event/create" element={<Event />} />
              <Route path="/board" element={<Board />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
