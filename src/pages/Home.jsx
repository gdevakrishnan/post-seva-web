import React, { Fragment, useContext } from 'react';
import '../static/home.css'; // Make sure the CSS file has the styles for background and layout
import appContext from '../context/appContext';
import bgImg from '../assets/postal-bg-image.jpg';

function Home() {
  const { sidebarIsCollapse } = useContext(appContext);

  return (
    <Fragment>
      <section
        className="page home_page"
        style={{
          background: `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.3)), url(${bgImg})`,
          backgroundSize: 'cover', // Ensure the image covers the whole section
          backgroundPosition: 'center', // Center the image
          minHeight: '100vh', // Full-screen height
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white', // Set text color to white for contrast
        }}
      >
        <div className="home-content">
          <p className="home-description">
            A one-stop solution for all your postal needs. Stay updated with
            the latest services, track your parcels, and manage postal services
            efficiently.
          </p>
          <button className="cta-button">Explore Services</button>
        </div>
      </section>
    </Fragment>
  );
}

export default Home;