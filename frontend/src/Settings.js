import React, { useEffect, useState, useRef } from 'react';
import './Settings.css';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

    
    // Inside your component
    let userData = null;

function Settings({ setUserData }) {

    const recaptchaRef = useRef();
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
    const [activeButton, setActiveButton] = useState('account');
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        captchaToken: '',
        privacy: 'public', // Default privacy setting
    });
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem('userToken');
    
    // Fetch user data from the server
    const fetchUserData = async () => {
        if (token) {
            try {
                const response = await axios.get("http://localhost:8081/user", { 
                    headers: { 'Authorization': `Bearer ${token}` } // Ensure 'Bearer ' is included
                });
                const { data } = response;
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    username: data.username || '',
                    email: data.email || '',
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    captchaToken: data.reCaptcha_token || '',
                    privacy: data.privacy || 'public', // Set privacy from fetched data
                });

                userData = data;
                setUserData(data); // Initialize user data in parent
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error);
                setErrors({
                    general: 'Failed to fetch user data. Please try again.',
                });
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };
    
    // Updated for error handling
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Use functional updates to avoid stale state issues
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    
        // Clear the specific field error
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear only the error for the current field
        }));
    };

    const validate = () => {
        const newErrors = {};
        const firstNameInput = document.querySelector('input[name="firstName"]');
        const lastNameInput = document.querySelector('input[name="lastName"]');
        const usernameInput = document.querySelector('input[name="username"]');
        const emailInput = document.querySelector('input[name="email"]');

        if (formData.firstName.length > 50) {
            newErrors.firstName = 'First name must not exceed 50 characters.';
            firstNameInput.focus();
        } else {
            newErrors.firstName = "";
        }

        if (formData.lastName.length > 50) {
            newErrors.lastName = 'Last name must not exceed 50 characters.';
            lastNameInput.focus();
        } else {
            newErrors.lastName = "";
        }

        if (formData.username.length > 50) {
            newErrors.username = 'Username must not exceed 50 characters.';
            usernameInput.focus();
        } else {
            newErrors.username = "";
        }

        // Email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const trimmedEmail = formData.email ? formData.email.trim() : '';
        if (!trimmedEmail) {
            newErrors.email = "Email should not be empty";
        } else if (trimmedEmail.length > 254) {
            newErrors.email = "Email is too long (maximum 254 characters)";
            emailInput.focus();
        } else if (!emailPattern.test(trimmedEmail)) {
            newErrors.email = "Invalid email format";
            emailInput.focus();
        } else {
            newErrors.email = "";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const validatePassword = () => {
        const newErrors = {};
        const oldPasswordInput = document.querySelector('input[name="oldPassword"]');
        const newPasswordInput = document.querySelector('input[name="newPassword"]');
        
        // Password validation
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!formData.oldPassword) {
            newErrors.oldPassword = "Password is required";
        } else if (formData.oldPassword.length > 128) {
            newErrors.oldPassword = "Password is too long (maximum 128 characters)";
            oldPasswordInput.focus();
        } else if (!passwordPattern.test(formData.oldPassword)) {
            newErrors.oldPassword = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
            oldPasswordInput.focus();
        } else {
            newErrors.oldPassword = "";

            // Confirm Password validation 
            if (formData.newPassword === formData.oldPassword) {
                newErrors.oldPassword = "You have reused your previous password";
            } else {
                newErrors.oldPassword = "";

                if (!formData.confirmPassword) {
                    newErrors.confirmPassword = "Please confirm your password";
                } else if (formData.newPassword !== formData.confirmPassword) {
                    newErrors.confirmPassword = "Passwords do not match";
                } else {
                    newErrors.confirmPassword = "";

                    if (!formData.newPassword) {
                        newErrors.newPassword = "Password is required";
                    } else if (formData.newPassword.length > 128) {
                        newErrors.newPassword = "Password is too long (maximum 128 characters)";
                        newPasswordInput.focus();
                    } else if (!passwordPattern.test(formData.newPassword)) {
                        newErrors.newPassword = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
                        newPasswordInput.focus();
                    } else {
                        newErrors.newPassword = "";
                    }
                }
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Check if any fields have been modified
      if (userData.firstName + userData.lastName + userData.username + userData.email !== formData.firstName + formData.lastName + formData.username + formData.email) {
        const confirmSave = window.confirm("Are you sure you want to save these changes?");

        if (confirmSave) { 
          // Validate form data before making the request
          const errors = validate();
          setErrors(errors); // Update errors state with validation results

          //alert(errors);   
            
          // Validate form data
          if (errors!==true && validate) {            
              
              // Execute ReCaptcha and handle possible failure
              const newToken = await recaptchaRef.current.executeAsync();
              
              if (!newToken) {
                alert('ReCaptcha verification failed. Please try again.');
                setLoading(false); // Reset loading state after request
                return;
              }
              setCaptchaToken(newToken); // Set the token after successful verification
    
            //alert(token);
            //console.log(token);
            try {
              
              setLoading(true); // Set loading state before the request

              // Proceed to update user data if validation and ReCaptcha pass
              const response = await axios.put("http://localhost:8081/updateUser", {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                captchaToken: newToken // Include the ReCaptcha token with the request
              }, {
                headers: { 'Authorization': `Bearer ${token}`  } // Authorization header with user token
              });
    
              if (response.status === 200) {
                console.log('User data updated successfully:', response.data);
                alert('User data updated successfully');
                setUserData(response.data); // Update user data in parent component
                fetchUserData(); // Optionally refresh user data
              } else {
                alert('No change has been done!');
              }
            } catch (error) {
              console.error('Error updating user data:', error);
              alert('Error updating user data: ', error);
            }
          }
        } else {
          alert('No change has been detected');
        }
      } else {
        alert('No changes have been made!');
      }
    setLoading(false); // Reset loading state after request
    };

    
    // Handle password change request
    const handleChangePassword = async (e) => {
      e.preventDefault();
    
      const newPassword = e.target.elements.newPassword.value;
      const oldPassword = e.target.elements.oldPassword.value;
      const userEmail = userData.email;
    
      const errors = validatePassword();
      setErrors(errors); // Update errors state with validation results
        //alert(errors);

      // First, validate passwords
      if (errors !== true) {
          // Confirm the password change
          const confirmSave = window.confirm("Are you sure you want to change your password?");
          if (confirmSave) {
            try {              
              //setLoading(true); // Set loading state before the request

              // Execute ReCaptcha and handle possible failure
              const recaptchaToken = await recaptchaRef.current.executeAsync();

              if (!recaptchaToken) {
                //setLoading(false); // Reset loading state after request
                alert('ReCaptcha verification failed. Please try again.');
                return;
              }
              setCaptchaToken(recaptchaToken); // Set the token after successful verification
    
                //alert(recaptchaToken); 
                //alert(token);
        
              // Proceed with password change request
              const response = await axios.put('http://localhost:8081/change-password', {
                oldPassword,
                newPassword,
                userEmail, 
                recaptchaToken // Include the ReCaptcha token with the request
              }, {
                headers: { 'Authorization': `Bearer ${token}`  } // Authorization header with user token
              });
                
              //setLoading(false); // Reset loading state after request
              
              alert('Password changed successfully');
              return;
            } catch (error) {
              // Log the full error to understand its structure
              console.error('Error changing password: ', error);
            
              // Display a custom error message depending on the error structure
              if (error.response && error.response.data && error.response.data.message) {
                alert('Error changing password: ' + error.response.data.message);
              } else {
                alert('Error changing password: ' + error);
              }
            }
          }
        } else { 
          //alert('Password validation failed');
          return; // Stop if validation fails
        }
    };

    const handlePrivacyChange = (e) => {
        setFormData({ ...formData, privacy: e.target.value });
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (confirmDelete) {
            const token = localStorage.getItem('authToken'); // Make sure token is fetched from local storage or your auth mechanism
            if (!token) {
                console.error('No token found');
                alert('No token found. Please log in again.');
                return;
            }
    
            try {
                const response = await axios.delete("http://localhost:8081/deleteUser", {
                    headers: { 'Authorization': `Bearer ${token}` }  // Pass the token in the Authorization header
                });
    
                if (response.status === 200) {
                    console.log('Account deleted successfully');
                    alert('Account deleted successfully');
                    // Optionally, redirect to login or home page after deletion
                    window.location.href = "/login";  // Redirecting user after successful account deletion
                } else {
                    console.error('Failed to delete account');
                    alert('Failed to delete account');
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized request. Please log in again.');
                    alert('Unauthorized request. Please log in again.');
                } else if (error.response && error.response.status === 403) {
                    console.error('Forbidden action. You are not allowed to delete this account.');
                    alert('Forbidden action. You are not allowed to delete this account.');
                } else {
                    console.error('Error deleting account:', error);
                    alert('Error deleting account. Please try again later.');
                }
            }
        }
    };


    return (
        <div className="settings-container">
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <>
                    <div className="sidebar">
                        <h2>Settings</h2>
                        <button
                            className={`sidebar-button ${activeButton === 'account' ? 'active' : ''}`}
                            onClick={() => handleButtonClick('account')}
                        >
                            Account
                        </button>
                        <button
                            className={`sidebar-button ${activeButton === 'privacy' ? 'active' : ''}`}
                            onClick={() => handleButtonClick('privacy')}
                        >
                            Privacy and Security
                        </button>
                    </div>
    
                    <div className="settings-content">
                        {/* Account Settings Section */}
                        {activeButton === 'account' && (
                            <form onSubmit={handleSubmit}>
                                <h2>Account Settings</h2>
                                <div className="form">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                                </div>
                                <div className="form">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.lastName && <span className="error">{errors.lastName}</span>}
                                </div>
                                <div className="form">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                    {errors.username && <span className="error">{errors.username}</span>}
                                </div>
                                <div className="form">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>
                                <div className="form">
                                    <ReCAPTCHA
                                      ref={recaptchaRef}
                                      sitekey= {RECAPTCHA_SITE_KEY}
                                      //sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY} // Use the environment variable
                                      size="invisible"
                                    />
                                    <button type="submit">Save Changes</button>
                                </div>
                            </form>
                        )}
    
                        {/* Privacy and Security Settings Section */}
                        {activeButton === 'privacy' && (
                            <div className="privacy-form">
                                <h2>Privacy Settings</h2>
                                {/* Privacy radio buttons */}
                                <div className="pcontainer">
                                    <div className="privacy-option">
                                        <input
                                            type="radio"
                                            name="privacy"
                                            id="public"
                                            value="public"
                                            checked={formData.privacy === 'public'}
                                            onChange={handlePrivacyChange}
                                        />
                                        <label htmlFor="public">
                                            <span>Public</span>
                                            <span className="description">Anyone on or off Tripmatic</span>
                                        </label>
                                    </div>
                                    <div className="privacy-option">
                                        <input
                                            type="radio"
                                            name="privacy"
                                            id="private"
                                            value="private"
                                            checked={formData.privacy === 'private'}
                                            onChange={handlePrivacyChange}
                                        />
                                        <label htmlFor="private">
                                            <span>Private</span>
                                            <span className="description">Only I can see what I post</span>
                                        </label>
                                    </div>
                                </div>
    
                                {/* Change Password */}
                                <form onSubmit={handleChangePassword}>
                                    <h3>Change Password</h3>
                                    <div className="form">
                                        <label>Old Password</label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={formData.oldPassword}
                                            onChange={handleInputChange}
                                        />
                                        {errors.oldPassword && <span className="error">{errors.oldPassword}</span>}
                                    </div>
                                    <div className="form">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                        />
                                        {errors.newPassword && <span className="error">{errors.newPassword}</span>}
                                    </div>
                                    <div className="form">
                                        <label>Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                                    </div>
                                    <div className="form">
                                        <ReCAPTCHA
                                          ref={recaptchaRef}
                                          sitekey= {RECAPTCHA_SITE_KEY}
                                          //sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY} // Use the environment variable
                                          size="invisible"
                                        />
                                        <button type="submit">Change Password</button>
                                    </div>
                                </form>
    
                                {/* Delete Account */}
                                <div className="form">
                                    <hr />
                                    <a href="#" onClick={handleDeleteAccount} style={{ textDecoration: 'none', color: '#FA5252' }}>
                                        <img src="../icons8-trash-16.png" alt="Delete Account" /> Delete Account
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );

}
export default Settings;
