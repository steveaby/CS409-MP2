import React from 'react';
// Only import Routes and Route, no need for the Router/BrowserRouter
import { Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home';
import DetailView from './pages/DetailView/DetailView';

function App() {
  return (
    // Now App only contains the Routes
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:id" element={<DetailView />} />
    </Routes>
  );
}

export default App;