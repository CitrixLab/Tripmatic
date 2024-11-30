import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./LoginValidation";
import ReCAPTCHA from 'react-google-recaptcha';

const UserForm = ({ setIsLoggedIn }) => {
  // Accept setIsLoggedIn as a prop
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
    
  const [errors, setErrors] = useState({});
  const [isShowForgotPassword, setShowForgotPassword] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null); // Define captchaToken state
  const navigate = useNavigate();
  const recaptchaRef = useRef(null); // Define recaptchaRef
  let newToken = null;
  const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
    
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


  const handleSubmit = async (event) => {
  event.preventDefault();

  // Validate form data before making the request
  const errors = Validation(values);
  setErrors(errors); // Update errors state with validation results
  // Only proceed if validation passes
  if (Object.keys(errors).length === 0) {
    try {
      // Execute ReCaptcha and handle possible failure
      const newToken = await recaptchaRef.current.executeAsync();
      if (!newToken) {
        setErrors({ password: 'ReCaptcha verification failed. Please try again.' });
        return;
      }

        //alert(newToken);
      setCaptchaToken(newToken); // Set the token after successful verification

      const res = await axios.post(
        "http://localhost:8081/login",
        { ...values, token: newToken } // Ensure the token is named 'token'
      );
      if (res.status === 200) {
        const authToken = res.data.token;

        // Store the token securely (e.g., use secure cookie storage or state management)
        localStorage.setItem("userToken", authToken);
        localStorage.setItem('isLoggedIn', true);

        setIsLoggedIn(true); // Update login state

        // Redirect to a different page
        navigate("/feed");
      } else {
        // Handle login failure
        setErrors({
          password: res.data.message || 'Login failed', // Handle backend error message
        });
      }
    } catch (err) {
      console.error('Error during login:', err.response?.data || err);
      //alert('An error occurred during login: ' + (err.response?.data?.message || 'Please try again.'));
      setErrors({
        //password: 'An error occurred during login. Please try again.',
      });
    }
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
            <ReCAPTCHA
              ref={recaptchaRef}
              //sitekey= "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              sitekey={RECAPTCHA_SITE_KEY} // Use the environment variable
              size="invisible"
            />
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
