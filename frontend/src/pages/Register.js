import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./RegisterValidation";
import axios from "axios";

function Register() {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    try {
      if (Object.values(validationErrors).every((error) => error === "") && values.password === values.cpassword) {
        console.log("Sending request to server:", values);
        axios
          .post("http://localhost:8081/register", values)
          .then((res) => {
            console.log("Registration successful:", res);
            navigate("/login");
          })
          .catch((err) => console.error("Registration error:", err));
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      setErrors({});
      console.log(error);
    } finally {
      setTimeout(()=> {
        setErrors({});
      }, 2000)
    }
  };

  return (
    <div className="loginSuccess">
      <div className="login">
        <div className="registerLogo">
          <img src="../logo.png" alt="logo" />
        </div>
        <form className="registerForm" onSubmit={handleSubmit}>
          <div>
            <p className="welcomeTxt">Hi! Welcome,</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="First Name"
              name="firstname"
              onChange={handleInput}
              className="inputForms"
            />
            {errors.firstname && (
              <span className="errorInput"> {errors.firstname}</span>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              name="lastname"
              onChange={handleInput}
              className="inputForms"
            />
            {errors.lastname && (
              <span className="errorInput"> {errors.lastname}</span>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleInput}
              className="inputForms"
            />
            {errors.username && (
              <span className="errorInput"> {errors.username}</span>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={handleInput}
              className="inputForms"
            />
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
            {errors.password && (
              <span className="errorInput"> {errors.password}</span>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              name="cpassword"
              onChange={handleInput}
              className="inputForms"
            />
            {errors.cpassword && (
              <span className="errorInput"> {errors.cpassword}</span>
            )}
          </div>

          <div className="checkBox">
            <input type="checkbox" id="usr" required />
            <label htmlFor="usr" className="checkBoxLabel">
              I accept the Tripmatic{" "}
              <span>
                <a href="#">User Agreement</a>{" "}
              </span>
              and have read the <a href="#">Privacy Statement</a>.
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="buttonRegister"
              value="Register Account"
            >
              Register Account
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
            <p>Already have an account?</p>
            <Link to="/login" className="loginAccnt">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
