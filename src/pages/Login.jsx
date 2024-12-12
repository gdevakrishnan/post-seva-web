import React, { Fragment, useContext, useState } from 'react';
import '../static/login.css'; // Using the same CSS for consistent styling
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { loginUserDetails } from '../services/serviceWorker';
import appContext from '../context/appContext';

function SignIn() {
  const initialState = {
    userId: "",
    postalCode: "",
    password: "",
  }
  const [userDetails, setUserDetails] = useState(initialState);
  const nav = useNavigate();

  const handleEdit = (e) => {
    e.preventDefault();
    setUserDetails({ ...userDetails, [e.target.id]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const key in userDetails) {
      if (userDetails[key].trim() === "") {
        alert("Enter all the fields");
        return;
      }
    }

    console.log("Submitting user details:", userDetails);

    loginUserDetails(userDetails)
      .then((response) => {
        if (response.message == "Login successful") {
          alert(response.message);
          setUserDetails(initialState);
          localStorage.setItem("post-seva-token", response.token);
          nav('/');
        }
      })
      .catch((error) => {
        alert(error.message);
        console.error("Error during registration:", error.message);
      });
  };

  return (
    <Fragment>
      <div className="container login_page">
        {/* Left Side: India Post Branding Section */}
        <div className="branding-section">
          <div className="branding-content">
            <img src={logo} alt="India Post Logo" className="logo" />
            <h1 style={{color: "#FFFFFF"}}>भारतीय डाक</h1>
            <h3>डाक सेवा-जन सेवा</h3>
            <h2>India Post</h2>
            <p>Dak Sewa-Jan Sewa</p>
            <Link to={'/register'}>
              <button className="signin-button">Create an Account</button>
            </Link>
          </div>
        </div>

        {/* Right Side: Sign-in Form Section */}
        <div className="form-section">
          <div className="form-container">
            <h2>Sign In to your account</h2>
            <form>
              <label htmlFor="userId">User ID</label>
              <input type="text" id="userId" placeholder="User ID" onChange={(e) => handleEdit(e)} />

              <label htmlFor="postalCode">Postal Code</label>
              <input type="text" id="postalCode" placeholder="Postal Code" onChange={(e) => handleEdit(e)} />

              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Password" onChange={(e) => handleEdit(e)} />

              <div className="form-buttons">
                <button type="submit" className="signup-button" onClick={(e) => handleSubmit(e)}>Sign-in</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default SignIn;