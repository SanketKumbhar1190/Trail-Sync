import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import SearchEventByLocation from "./SearchEventByLocation";
import About from "./About";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search-events" element={<SearchEventByLocation />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
