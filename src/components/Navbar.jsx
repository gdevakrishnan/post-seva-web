import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for routing
import '../static/navbar.css';
import { FaHome, FaChartLine, FaFileAlt, FaTasks } from 'react-icons/fa';
import { IoExitOutline, IoConstruct } from 'react-icons/io5';
import { IoIosChatbubbles } from 'react-icons/io';
import { MdReport } from 'react-icons/md';
import appContext from '../context/appContext';
// import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import logo from '../assets/logo.png';
import { FaUserAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const Navbar = () => {
  const { setSidebarIsCollapse, setUserDetails, userDetails } = useContext(appContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const nav = useNavigate();

  return (
    <Fragment>
      <nav>
        <Link to={'/'}>
          <div className="image" title='post-seva'><img src={logo} alt="postseva" className="logo" /></div>
        </Link>
        <h1 className="brand">POST SEVA</h1>
        <div className="group">
          {
            (userDetails) && <div className="user_details">
              <p title='user'><FaUserAlt /> {userDetails.userId} / {userDetails.postalCode}</p>
            </div>
          }
          <button className='logout' title='logout' onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem('post-seva-token');
            setUserDetails(null);
            nav('/login')
          }}><IoExitOutline /></button>
        </div>
      </nav>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
        onMouseEnter={() => {
          setIsCollapsed(!isCollapsed);
          setSidebarIsCollapse(!isCollapsed);
        }}
        onMouseLeave={() => {
          setIsCollapsed(!isCollapsed);
          setSidebarIsCollapse(!isCollapsed);
        }}
      >
        <div className="sidebar-header">
          {/* Toggle Sidebar Button */}
          {/* <div className="toggle-btn" onClick={toggleSidebar}>
            {isCollapsed ? <FaCaretRight className="toggle-icon" /> : <FaCaretLeft className="toggle-icon" />}
          </div> */}
        </div>
        <ul className="nav-links">
          {/* Navigation Links */}
          <li title="Home">
            <Link to="/" className="nav-item">
              <span className="nav-icon"><FaHome /></span>
              <span>Home</span>
            </Link>
          </li>
          <li title="Dashboard">
            <Link to="/dashboard" className="nav-item">
              <span className="nav-icon"><FaChartLine /></span>
              <span>Dashboard</span>
            </Link>
          </li>
          {/* <li title="Appeal">
          <Link to="/register" className="nav-item">
            <span className="nav-icon"><FaFileAlt /></span>
            <span>Appeal</span>
          </Link>
        </li> */}
          <li title="Grievance">
            <Link to="/complaints" className="nav-item">
              <span className="nav-icon"><MdReport /></span>
              <span>Grievance</span>
            </Link>
          </li>
          <li title="Mail">
            <Link to="/mail" className="nav-item">
              <span className="nav-icon"><IoMdMail /></span>
              <span>Mail</span>
            </Link>
          </li>
          {/* <li title="Under Process">
          <Link to="/under-process" className="nav-item">
            <span className="nav-icon"><FaTasks /></span>
            <span>Under Process</span>
          </Link>
        </li>
        <li title="Monitoring Desk">
          <Link to="/monitoring-desk" className="nav-item">
            <span className="nav-icon"><IoConstruct /></span>
            <span>Monitoring Desk</span>
          </Link>
        </li> */}
          {/* <li title="Reports">
          <Link to="/reports" className="nav-item">
            <span className="nav-icon"><FaFileAlt /></span>
            <span>Reports</span>
          </Link>
        </li> */}
          <li title="AI Chat">
            <Link to="/ai-chat" className="nav-item">
              <span className="nav-icon"><IoIosChatbubbles /></span>
              <span>AI Chat</span>
            </Link>
          </li>
        </ul>
      </div>
    </Fragment >
  );
};

export default Navbar;