import "./Styles/App.css";
import React from "react";
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
  return (
    <Router>
      <div>
        {/* <Topbar /> */}
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: "20px" }}>
            {" "}
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
