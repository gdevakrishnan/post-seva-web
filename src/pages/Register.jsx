
import React, { Fragment, useState } from 'react';
import '../static/register.css';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { createUserDetails, verifyId } from '../services/serviceWorker';
function Register() {
  const initialState = {
    userId: "",
    postalCode: "",
    fullName: "",
    password: "",
    confirmPassword: ""
  }
  const [userDetails, setUserDetails] = useState(initialState);
  const [isAvailable, setIsAvailable] = useState(null);
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

    if (userDetails.password.trim() !== userDetails.confirmPassword.trim()) {
      alert("Password mismatch");
      return;
    }

    console.log("Submitting user details:", userDetails);

    createUserDetails(userDetails)
      .then((response) => {
        if (response.message == "User registered successfully") {
          console.log("Registration successful:", response);
          alert(response.message);
          setUserDetails(initialState);
          nav('/login');
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
        console.error("Error during registration:", error.message);
      });
  };

  const handleCheckIdAvailability = (e) => {
    e.preventDefault();

    if (userDetails.userId.trim() === "") {
      alert("Enter the User ID");
      return;
    }

    verifyId({ userId: userDetails.userId })
      .then((response) => {
        console.log(response.isAvailable);
        setIsAvailable(response.isAvailable);
      })
      .catch((e) => console.log(e.message));
  }

  return (
    <Fragment>
      <div className="container register_page">
        {/* Left Side: India Post Branding Section */}
        <div className="branding-section">
          <div className="branding-content">
            <img src={logo} alt="India Post Logo" className="logo" />

            <h1 style={{ color: "#FFFFFF" }}>भारतीय डाक</h1>
            <h3>डाक सेवा-जन सेवा</h3>
            <h2>India Post</h2>
            <p>Dak Sewa-Jan Sewa</p>
            <Link to={'/login'}>
              <button className="signin-button">Sign-in</button>
            </Link>
          </div>
        </div>

        {/* Right Side: Login Form Section */}
        <div className="form-section">
          <div className="form-container">
            <h2>Create your account</h2>
            <form>
              <label htmlFor="userId">User ID</label>
              <div className="user-id-container">
                <div>
                  <input type="text" id="userId" placeholder="Enter User ID" onChange={(e) => handleEdit(e)} />
                </div>
                <div>
                  <button type="button" className="availability-button" onClick={(e) => handleCheckIdAvailability(e)}>Check Availability</button>
                </div>
              </div>
              {
                isAvailable !== null && (
                  isAvailable ? <p className='availability available'>Available</p> : <p className='availability not-available'>Not Available</p>
                )
              }

              <div className="name-inputs">
                <div>
                  <label htmlFor="fullName">Full name</label>
                  <input type="text" id="fullName" placeholder="Full name" onChange={(e) => handleEdit(e)} />
                </div>
                <div>
                  <label htmlFor="postalCode">Postal Code</label>
                  <input type="text" id="postalCode" placeholder="Postal Code" onChange={(e) => handleEdit(e)} />
                </div>
              </div>

              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter Password" onChange={(e) => handleEdit(e)} />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" placeholder="Confirm Password" onChange={(e) => handleEdit(e)} />

              <div className="form-buttons">
                <button
                  type="submit"
                  className="signup-button"
                  onClick={(e) => handleSubmit(e)}
                >Sign-up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Register;
