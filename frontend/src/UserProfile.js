// export default UserProfile;
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import ReactFileReader from 'react-file-reader'; // Assuming you have this library
import MyMap from './MyMap'; // Assuming you have this component
import styled from 'styled-components'; // Import styled if used
import "./userprofile.css";
import "./styles.css";
import UserDropdown from "./UserDropdown";

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
  }
  .circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  label {
    right: 23em !important;
    position: absolute;
    width: 48px;
    height: 48px;
    background: #312e38;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      display: none;
    }
    svg {
      width: 20px;
      height: 20px;
      color: #f4ede8;
    }
    &:hover {
      background: blue;
    }
  }
`;

function UserProfile() {
    const [showModal, setShowModal] = useState(false);
    const [display, setDisplay] = useState("publish");
    const [isCopied, setIsCopied] = useState(false);
    const [userData, setUserData] = useState({});
    const [url, setUrl] = useState("https://placehold.co/400");
    const [profileCard, setProfileCard] = useState("https://placehold.co/400");
    const [profileFile, setProfileFile] = useState();
    const [initialValues, setInitialValue] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        location: "",
        website: ""
    });

    const imgRef = useRef(null);
    const canvasRef = useRef(null); // Use useRef for the canvas
    const token = localStorage.getItem('userToken');

    const handleEditClick = () => {
        setShowModal(true);
    };
    

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === document.querySelector('.modal'))   
      { // Target the modal element directly
        setShowModal(false);
      }
    }
    
    const fetchCurrentUser  = async () => {
        if (token) {
            const response = await axios.get("http://localhost:8081/user", {
                headers: {
                    'Authorization': token
                }
            });
            const { data } = response;
            setInitialValue({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                bio: data.bio || "",
                location: data.location || "",
                website: data.website || ""
            });
            setProfileCard(data.profile_url || "https://placehold.co/400");
            setUserData(data);
        }
    };

    useEffect(() => {
        fetchCurrentUser ();
    }, []);

    useEffect(() => {
      if (imgRef.current && canvasRef.current) {
          const imgElement = imgRef.current;
          imgElement.crossOrigin = "anonymous"; // Set CORS attribute
          imgElement.src = profileCard; // Set the image source
  
          imgElement.onload = function () {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
  
              canvas.width = imgElement.width;
              canvas.height = imgElement.height;
              ctx.drawImage(imgElement, 0, 0);
              const imageDataURL = canvas.toDataURL(); // This should work if the image is not tainted
              localStorage.setItem('profileCard', imageDataURL);
          };
      }
  }, [profileCard]);


    const handleSaveClick = () => {
        setShowModal(false);
    };

    const handleCopy = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        });
    };

    const onSubmit = async (values) => {
        try {
            if (token) {
                const response = await axios.put("http://localhost:8081/user", values, {
                    headers: {
                        'Authorization': token
                    }
                });
                if (!url.includes('http') && profileFile) {
                    const formData = new FormData();
                    formData.append('file', profileFile .fileList[0]);
                    await axios.post(`http://localhost:8081/upload-profile/${userData.id}`, formData, {
                        headers: {
                            'Authorization': token
                        }
                    });
                }
                if (response.status === 200) {
                    fetchCurrentUser ();
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setShowModal(false);
        }
    };

    const handleFiles = (files) => {
        setProfileFile(files);
        setUrl(files.base64);
    };

    const UserProfileContent = () => (
        <div className="container-fluid">
            <div className="row">
                <div className="profile-card col-3">
                    <img alt="Profile picture" src={profileCard} ref={imgRef} />
                    <h2>{userData.firstName} {userData.lastName}</h2>
                    <p className="card-text text-muted">@{userData.username}</p>
                    <p className="card-text">{userData.bio}</p>
                    {userData.website && (
                        <a href={userData.website} className="btn btn-outline-primary mb-3" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-facebook"></i> {userData.website}
                        </a>
                    )}
                    <div className="stats">
                        <div>
                            <p>0</p>
                            <span>FOLLOWERS</span>
                        </div>
                        <div>
                            <p>0</p>
                            <span>FOLLOWING</span>
                        </div>
                    </div>
                    <div className="actions">
                        <button className="edit" onClick={handleEditClick}>
                            <img src="./edit.png" alt="Edit icon" />
                            Edit
                        </button>
                        <button className="copy-link" onClick={handleCopy}>
                            <i className="fas fa-link"></i>
                            Copy Link
                        </button>
                    </div>
                </div>
                <div className="map-container col-7">
                    <MyMap />
                    <div className="button-container">
                        <div className="menu">
                            <nav className="nav">
                                <a className={`nav-link menu-item ${display === 'publish' ? 'saved' : ''}`} onClick={() => setDisplay("publish")} href="#"><i className="fas fa-print"></i> <b>Published</b></a>
                                <a className={`nav-link menu-item ${display === 'drafts' ? 'saved' : ''}`} onClick={() => setDisplay("drafts")} href="#"><i className="fas fa-envelope"></i> <b>Drafts</b></a>
                                <a className={`nav-link menu-item ${display === 'saved' ? 'saved' : ''}`} onClick={() => setDisplay("saved")} href="#"><i className="fas fa-bookmark"></i> <b>Saved</b></a>
                            </nav>
                        </div>
                    </div>
                    {display === 'publish' && <div className="mt-3"><center>There is nothing here. <br /> Create itineraries to publish!</center></div>}
                    {display === 'drafts' && <div className="mt-3"><center>There is nothing here. <br /> Start creating itineraries!</center></div>}
                    {display === 'saved' && <div className="mt-3"><center>There is nothing here. <br /> View other itineraries to save!</center></div>}
                </div>
            </div>

            {showModal && (
                <div className="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', width: '25vw', height: '60%' }}>
                        <div className="modal-header pt-1">
                            <h2>Edit Profile</h2>
                            <span className="close-icon" onClick={() => setShowModal(false)}>&times;</span>
                        </div>
                        <div className="profile-icon">
                            <AvatarInput>
                                <img src={url} alt="Avatar Placeholder" />
                            </AvatarInput>

                            <ReactFileReader
                                fileTypes={[".png", ".jpg"]}
                                base64={true}
                                handleFiles={handleFiles}
                            >
                            <i className="fas fa-pencil-alt edit-icon"></i>
                            </ReactFileReader>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            enableReinitialize
                        >
                            {({ values, isSubmitting, errors }) => (
                                <Form>
                                    <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ flex: 1, marginRight: '10px' }}>
                                            <label htmlFor="first-name">First Name</label>
                                            <Field
                                                type='text'
                                                name='firstName'
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label htmlFor="last-name">Last Name</label>
                                            <Field
                                                type='text'
                                                name='lastName'
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bio">Bio</label>
                                        <Field
                                            type='text'
                                            name='bio'
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="location">Location</label>
                                        <Field
                                            type='text'
                                            name='location'
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="website">Website</label>
                                        <Field
                                            type='text'
                                            name='website'
                                        />
                                    </div>
                                    <div className="text-center">
                                        <button className="save-btn" type="submit" disabled={isSubmitting}>Save</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Hidden canvas element */}
        </div>
    );

    const Placeholder = () => (
        <div className="container-fluid">
            <div className="row">
                <div className="profile-card col-3">
                    <img alt="Profile picture placeholder" src="./addprofilepic.png" />
                    <h2>Jette Smith</h2>
                    <p className="card-text text-muted">@jettesmith_123</p>
                    <p className="card-text">To Travel is to Live. ✈️</p>
                    <a href="https://facebook.com/" className="btn btn-outline-primary mb-3" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-facebook"></i> facebook.com/jettyysmith
                    </a>
                    <div className="stats">
                        <div>
                            <p>0</p>
                            <span>FOLLOWERS</span>
                        </div>
                        <div>
                            <p>0</p>
                            <span>FOLLOWING</span>
                        </div>
                    </div>
                    <div className="actions">
                        <button className="edit" onClick={handleEditClick}>
                            <img src="./edit.png" alt="Edit icon" />
                            Edit
                        </button>
                        <button className="copy-link" onClick={handleCopy}>
                            <i className="fas fa-link"></i>
                            Copy Link
                        </button>
                    </div>
                </div>
                <div className="map-container col-7">
                    <MyMap />
                    <div className="button-container">
                        <div className="menu">
                            <nav className="nav">
                                <a className={`nav-link menu-item ${display === 'publish' ? 'saved' : ''}`} onClick={() => setDisplay("publish")} href="#"><i className="fas fa-print"></i> <b>Published</b></a>
                                <a className={`nav-link menu-item ${display === 'drafts' ? 'saved' : ''}`} onClick={() => setDisplay("drafts")} href="#"><i className="fas fa-envelope"></i> <b>Drafts</b></a>
                                <a className={`nav-link menu-item ${display === 'saved' ? 'saved' : ''}`} onClick={() => setDisplay("saved")} href="#"><i className="fas fa-bookmark"></i> <b>Saved</b></a>
                            </nav>
                        </div>
                    </div>
                    {display === 'publish' && (
                        <div className="mt-3">
                            <center>There is nothing here. <br /> Create itineraries to publish!</center>
                        </div>
                    )}
                    {display === 'drafts' && (
                        <div className="mt-3">
                            <center>There is nothing here. < br /> Start creating itineraries!</center>
                        </div>
                    )}
                    {display === 'saved' && (
                        <div className="mt-3">
                            <center>There is nothing here. <br /> View other itineraries to save!</center>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {userData ? <UserProfileContent /> : <Placeholder />}
        </>
    );
  }

export default UserProfile;
