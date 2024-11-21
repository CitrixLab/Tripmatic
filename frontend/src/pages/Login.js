import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./LoginValidation";

const UserForm = ({ setIsLoggedIn }) => {
  // Accept setIsLoggedIn as a prop
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isShowForgotPassword, setShowForgotPassword] = useState(false);
  const [emailValue, setEmailValue] = useState('');												   
  const navigate = useNavigate(); // Hook for navigation

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleForgotPassword = () => {
    try {
      if(!emailValue){
        alert('Please Provide an Email');
      } else {
        axios
          .post("http://localhost:8081/forgot-password", {email: emailValue})
          .then((res) => {
            if (res.status === 200) {
              alert(res.data.message);
            } else {
              alert("No record exists.");
            }
          })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCloseModal = () => {
    setEmailValue('');
    setShowForgotPassword(false);
  }  
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));

    // Ensure the errors are empty before making the login request
    if (!errors.email && !errors.password) {
      axios
        .post("http://localhost:8081/login", values)
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            if(res.data.token) {
              // Save the token to localStorage to maintain login state
              localStorage.setItem("userToken", res.data.token); // Replace 'your-auth-token' with actual token
              localStorage.setItem('isLoggedIn', true);
              // Update the login state and set it in localStorage
              setIsLoggedIn(true);
  
              // Redirect to a different page
              navigate("/feed");
            } else {
              setErrors({
                password: res.data.message,
              });
            }		 
          } else {
            alert("No record exists.");
            setErrors({
              email: "",
              password: "",
            });		   
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setTimeout(() => {
            setErrors({
              email: "",
              password: "",
            });
          }, 3000);
        });
    }
  };

  return (
    <div className="loginSuccess">
      <div className="login">
        <div className="loginLogo">
          <img src="../logo.png" alt="logo" />
        </div>
        <form action="" className="loginForm" onSubmit={handleSubmit}>
          <div>
            <p className="welcomeTxt">Hi! Welcome,</p>
            <p className="createTxt">create your plan today.</p>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={handleInput}
              className="inputForms"
            />
          </div>
          <div>
            {errors.email && (
              <span className="errorInput"> {errors.email}</span>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleInput}
              className="inputForms"
            />
          </div>
          <div>
            {errors.password && (
              <span className="errorInput"> {errors.password}</span>
            )}
          </div>
          <div>
            <a href="#" className="forgotPasstxt" onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </a>
          </div>
          <div>
            <button type="submit" className="buttonLogin">
              Login
            </button>
          </div>
          <div
            style={{
              marginTop: "5px",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
            className="bottomQuestion"
          >
            <p>Don't have an account?</p>
            <Link to="/Register" className="registerAccnt">
              Register an account
            </Link>
          </div>
        </form>
      </div>
      {isShowForgotPassword && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{borderBottom: 'none'}}>
                <h2>Reset Password</h2>
                <span className="btn-close" onClick={() => handleCloseModal()}></span>
              </div>
              <form>
                <div className="form-group">
                  <label for="email">Email</label>
                  <input type="text"
                    id="email"
                    value={emailValue}
                    placeholder="Email"
                    onChange={(e) => {setEmailValue(e.target.value)}}
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button className="save-btn align-center w-75" onClick={()=> handleForgotPassword()}>Reset Password</button>
                </div>
                  
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm;
