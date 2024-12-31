import "./Styles/Layout.css";
import React, { useState, useEffect } from "react"; // useState 추가
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Topbar from "./components/Topbar/Topbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Event from "./Pages/Event/Event";
import EventBoard from "./Pages/Board/EventBoard";
import EventType from "./Pages/EventType/EventType";
import Country from "./Pages/Country/Country";
import Genre from "./Pages/Genre/Genre";
import Place from "./Pages/Place/Place";
import Artist from "./Pages/Artist/Artist";
import Home from "./Pages/Home/Home";
import Auth from "./Pages/Auth/Auth";
import FeedBack from "./Pages/Feedback/Feedback";
import FeedbackBoard from "./Pages/Board/FeedbackBoard";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Sidebar 열기/닫기 토글
  };

  useEffect(() => {
    const user = localStorage.getItem("admin");
    if (user) {
      setIsAuthenticated(true);
    } else {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <Router>
      <div>
        {isAuthenticated && <Topbar />}
        <div style={{ display: "flex" }}>
          {isAuthenticated && (
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
          )}
          <main
            style={{
              flexGrow: 1,
              marginLeft: sidebarOpen ? "250px" : "0", // Sidebar가 열릴 때 margin 조정
            }}
          >
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/eventType/create" element={<EventType />} />
                  <Route path="/country/create" element={<Country />} />
                  <Route path="/genre/create" element={<Genre />} />
                  <Route path="/place/create" element={<Place />} />
                  <Route path="/artist/create" element={<Artist />} />
                  <Route path="/event/create" element={<Event />} />
                  <Route path="/eventBoard" element={<EventBoard />} />
                  <Route path="/feedbackBoard" element={<FeedbackBoard />} />
                </>
              ) : (
                <Route
                  path="*"
                  element={<Auth setIsAuthenticated={setIsAuthenticated} />}
                />
              )}
              <Route path="/feedback" element={<FeedBack />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
