import React, { Fragment, useContext } from 'react';
import { Routes, Route, Outlet, BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import Login from '../pages/Login';
import appContext from '../context/appContext';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Complaints from '../pages/Complaints';
import Chatbot from '../pages/Chatbot';
import Mail from '../pages/Mail';
import ComplaintDetails from '../pages/ComplaintDetails';
import TablePage from '../pages/TablePage';
function Router() {
  const { userDetails } = useContext(appContext);
  return (
    <Fragment>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={(userDetails) ? <Home /> : <Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/ai-chat" element={<Chatbot />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/tablepage" element={<TablePage />}/>
        </Routes>
        <Outlet />
      </BrowserRouter>
    </Fragment>
  );
}

export default Router;
