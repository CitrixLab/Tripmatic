import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import image from '../assets/logo.png';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { hash, token } = useParams();
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (event) => {
    event.preventDefault();
    if(password === confirmPassword && (password.length > 0 && confirmPassword.length > 0)) {
      const inputData = {
        hash: hash,
        token: token,
        password: password
      }
      axios
        .post("http://localhost:8081/change-password", inputData)
        .then((res) => {
          if (res.status === 200) {
            navigate("/login");
          } else {
            alert("No record exists.");
          }
        })
        .catch((err) => {
          console.log(err)
          alert("Invalid Request")
        });
    } else {
      alert('Password not Match');
    }
  };

  return (
    <div className="loginSuccess">
      <div className="login">
        <div className="loginLogo">
          <img src={image} alt="logo" />
        </div>
        <form action="" className="loginForm" onSubmit={handleSubmit}>
          <div>
            <p className="welcomeTxt">Reset Password</p>
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="inputForms"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              id="confirm_password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="inputForms"
            />
          </div>
          <div>
            <button type="submit" className="buttonLogin mt-4">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
