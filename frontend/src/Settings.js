import React, { useEffect, useState } from 'react';
import './Settings.css';
import axios from 'axios';

function Settings({ setUserData }) {
    const [activeButton, setActiveButton] = useState('account');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        privacy: 'public', // Default privacy setting
    });
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem('userToken');

    // Fetch user data from the server
    const fetchUserData = async () => {
        if (token) {
            try {
                const response = await axios.get("http://localhost:8081/user", {
                    headers: {
                        'Authorization': token
                    }
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
                    privacy: data.privacy || 'public', // Set privacy from fetched data
                });
                setUserData(data); // Initialize user data in parent
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    const validate = () => {
        const newErrors = {};
        if (formData.firstName.length > 50) {
            newErrors.firstName = 'First name must not exceed 50 characters.';
        }
        if (formData.lastName.length > 50) {
            newErrors.lastName = 'Last name must not exceed 50 characters.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (formData.username.length > 50) {
            newErrors.username = 'Username must not exceed 50 characters.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmSave = window.confirm("Are you sure you want to save these changes?");
        if (confirmSave) {
            if (validate()) {
                try {
                    const response = await axios.put("http://localhost:8081/user", {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        username: formData.username,
                        email: formData.email,
                    }, {
                        headers: {
                            'Authorization': token
                        }
                    });
                    if (response.status === 200) {
                        console.log('User  data updated successfully:', response.data);
                        setUserData(response.data); // Update user data in parent component
                        fetchUserData(); // Optionally refresh user data
                    }
                } catch (error) {
                    console.error('Error updating user data:', error);
                }
            }
        }
    };

    const handlePrivacyChange = (e) => {
        setFormData({ ...formData, privacy: e.target.value });
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete("http://localhost:8081/user", {
                headers: {
                    'Authorization': token
                }
            });
            console.log('Account deleted');
            // Optionally, handle user logout or redirect here
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="settings-container">
            <div className="sidebar">
                <h2>Settings</h2>
                <button 
                    className={`sidebar-button ${activeButton === 'account' ? 'active' : ''}`} 
                    onClick={() => handleButtonClick('account')}
                >
                    Account
                </button>
                <button 
                    className={`sidebar-button ${activeButton === 'privacy' ? ' active' : ''}`} 
                    onClick={() => handleButtonClick('privacy')}
                >
                    Privacy
                </button>
            </div>
            <div className="content-input">
                {activeButton === 'account' && (
                    <form onSubmit={handleSubmit}>
                        <div className='form'>
                            <label>First Name:</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                value={formData.firstName} 
                                onChange={handleInputChange} 
                                required
                            />
                            {errors.firstName && <span className="error">{errors.firstName}</span>}
                        </div>
                        <div className='form'>
                            <label>Last Name:</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                value={formData.lastName} 
                                onChange={handleInputChange} 
                                required
                            />
                            {errors.lastName && <span className="error">{errors.lastName}</span>}
                        </div>
                        <div className='form'>
                            <label>Username:</label>
                            <input 
                                type="text" 
                                name="username" 
                                value={formData.username} 
                                onChange={handleInputChange} 
                                required
                            />
                            {errors.username && <span className="error">{errors.username}</span>}
                        </div>
                        <div className='form'>
                            <label>Email:</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange}
                                required 
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                )}
                {activeButton === 'privacy' && (
                    <div>
                        <h3>Set Privacy Settings</h3>
                        <div className='pcontainer'>
                            <input 
                                type='radio' 
                                name='privacy' 
                                id='public' 
                                value='public' 
                                checked={formData.privacy === 'public'} 
                                onChange={handlePrivacyChange} 
                            />
                            <label htmlFor='public'>
                                <span>Public</span>
                                <span className="description">Anyone on or off Tripmatic</span>
                            </label>
                            <input 
                                type='radio' 
                                name='privacy' 
                                id='private' 
                                value='private' 
                                checked={formData.privacy === 'private'} 
                                onChange={handlePrivacyChange} 
                            />
                            <label htmlFor='private'>
                                <span>Private</span>
                                <span className="description">Only I can see what I post</span>
                            </label>
                        </div>
                        <h4>Change Password</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="form">
                                <label>
                                    Enter Old Password
                                    <input 
                                        type="password" 
                                        name="oldPassword" 
                                        value={formData.oldPassword} 
                                        onChange={handleInputChange}                                        
                                        required 
                                    />
                                </label>
                            </div>
                            <div className="form">
                                <label>
                                    Enter New Password
                                    <input 
                                        type="password" 
                                        name="newPassword" 
                                        value={formData.newPassword} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </label>
                            </div>
                            <div className="form">
                                <label>
                                    Confirm New Password
                                    <input 
                                        type="password" 
                                        name="confirmPassword" 
                                        value={formData.confirmPassword} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </label>
                            </div>
                            <button type="submit" className="save-button">Change Password</button>
                        </form>
                        <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
                        <button className="delete-account-button" onClick={handleDeleteAccount}>
                            Delete Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Settings;

// import React, { useEffect, useState } from 'react';
// import './Settings.css';
// import axios from 'axios';

// function Settings({ setUserData }) {
//     const [activeButton, setActiveButton] = useState('account');
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         username: '',
//         email: '',
//         password: '',
//         newPassword: '',
//         confirmPassword: '',
//         privacy: 'public', // Default privacy setting
//     });
//     const [errors, setErrors] = useState({});
//     const token = localStorage.getItem('userToken');

//     // Fetch user data from the server
//     const fetchUserData = async () => {
//         if (token) {
//             try {
//                 const response = await axios.get("http://localhost:8081/user", {
//                     headers: {
//                         'Authorization': token
//                     }
//                 });
//                 const { data } = response;
//                 setFormData({
//                     firstName: data.firstName || '',
//                     lastName: data.lastName || '',
//                     username: data.username || '',
//                     email: data.email || '',
//                     password: data.password || '',
//                     newPassword: '',
//                     confirmPassword: '',
//                     privacy: data.privacy || 'public', // Set privacy from fetched data
//                 });
//                 setUserData(data); // Initialize user data in parent
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         }
//     };

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//     const handleButtonClick = (button) => {
//         setActiveButton(button);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//         setErrors({ ...errors, [name]: '' }); // Clear error on change
//     };

//     const validate = () => {
//         const newErrors = {};
//         if (formData.firstName.length > 50) {
//             newErrors.firstName = 'First name must not exceed 50 characters.';
//         }
//         if (formData.lastName.length > 50) {
//             newErrors.lastName = 'Last name must not exceed 50 characters.';
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email address.';
//         }
//         if (formData.username.length > 50) {
//             newErrors.username = 'Username must not exceed 50 characters.';
//         }
//         if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'New password and confirmation do not match.';
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0; // Return true if no errors
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const confirmSave = window.confirm("Are you sure you want to save these changes?");
//         if (confirmSave) {
//             if (validate()) {
//                 try {
//                     const response = await axios.put("http://localhost:8081/user", {
//                         firstName: formData.firstName,
//                         lastName: formData.lastName,
//                         username: formData.username,
//                         email: formData.email,
//                         privacy: formData.privacy // Include privacy if needed
//                     }, {
//                         headers: {
//                             'Authorization': token
//                         }
//                     });
//                     if (response.status === 200) {
//                         console.log('User data updated successfully:', response.data);
//                         setUserData(response.data); // Update user data in parent component
//                         fetchUserData(); // Optionally refresh user data
//                     }
//                 } catch (error) {
//                     console.error('Error updating user data:', error);
//                 }
//             }
//         }
//     };

//     const handlePasswordChange = async (e) => {
//         e.preventDefault();
//         const confirmChange = window.confirm("Are you sure you want to change your password?");
//         if (confirmChange) {
//             if (formData.password && formData.newPassword === formData.confirmPassword) {
//                 try {
//                     const response = await axios.put("http://localhost:8081/user/change-password", {
//                         password: formData.password,
//                         newPassword: formData.newPassword,
//                     }, {
//                         headers: {
//                             'Authorization': token
//                         }
//                     });
//                     if (response.status === 200) {
//                         console.log('Password changed successfully:', response.data);
//                         setFormData({ ...formData, password: '', newPassword: '', confirmPassword: '' }); // Reset password fields
//                     }
//                 } catch (error) {
//                     console.error('Error changing password:', error);
//                     setErrors({ ...errors, password: 'Current password is incorrect.' }); // Handle incorrect current password
//                 }
//             } else {
//                 setErrors({ ...errors, confirmPassword: 'New password and confirmation do not match.' });
//             }
//         }
//     };

//     const handlePrivacyChange = (e) => {
//         setFormData({ ...formData, privacy: e.target.value });
//     };

//     const handleDeleteAccount = async () => {
//         try {
//             await axios.delete("http://localhost:8081/user", {
//                 headers: {
//                     'Authorization': token
//                 }
//             });
//             console.log('Account deleted');
//             // Optionally, handle user logout or redirect here
//         } catch (error) {
//             console.error('Error deleting account:', error);
//         }
//     };

//     return (
//         <div className="settings-container">
//             <div className="sidebar">
//                 <h2>Settings</h2>
//                 <button 
//                     className={`sidebar-button ${activeButton === 'account' ? 'active' : ''}`} 
//                     onClick={() => handleButtonClick('account')}
//                 >
//                     Account
//                 </button>
//                 <button 
//                     className={`sidebar-button ${activeButton === 'privacy' ? 'active' : ''}`} 
//                     onClick={() => handleButtonClick('privacy')}
//                 >
//                     Privacy
//                 </button>
//             </div>
//             <div className="content-input">
//                 {activeButton === 'account' && (
//                     <form onSubmit={handleSubmit}>
//                         <div className='form'>
//                             <label>First Name:</label>
//                             <input 
//                                 type="text" 
//                                 name="firstName" 
//                                 value={formData.firstName} 
//                                 onChange={handleInputChange} 
//                                 required
//                             />
//                             {errors.firstName && <span className="error">{errors.firstName}</span>}
//                         </div>
//                         <div className='form'>
//                             <label>Last Name:</label>
//                             <input 
//                                 type="text" 
//                                 name="lastName" 
//                                 value={formData.lastName} 
//                                 onChange={handleInputChange} 
//                                 required
//                             />
//                             {errors.lastName && <span className="error">{errors.lastName}</span>}
//                         </div>
//                         <div className='form'>
//                             <label>Username:</label>
//                             <input 
//                                 type="text" 
//                                 name="username" 
//                                 value={formData.username} 
//                                 onChange={handleInputChange} 
//                                 required
//                             />
//                             {errors.username && <span className="error">{errors.username}</span>}
//                         </div>
//                         <div className='form'>
//                             <label>Email:</label>
//                             <input 
//                                 type="email" 
//                                 name="email" 
//                                 value={formData.email} 
//                                 onChange={handleInputChange}
//                                 required 
//                             />
//                             {errors.email && <span className="error">{errors.email}</span>}
//                         </div>
//                         <button type="submit">Save Changes</button>
//                     </form>
//                 )}
//                 {activeButton === 'privacy' && (
//                     <div>
//                         <h3>Set Privacy Settings</h3>
//                         <div className='pcontainer'>
//                             <input 
//                                 type='radio' 
//                                 name='privacy' 
//                                 id='public' 
//                                 value='public' 
//                                 checked={formData.privacy === 'public'} 
//                                 onChange={handlePrivacyChange} 
//                             />
//                             <label htmlFor='public'>
//                                 <span>Public</span>
//                                 <span className="description">Anyone on or off Tripmatic</span>
//                             </label>
//                             <input 
//                                 type='radio' 
//                                 name='privacy' 
//                                 id='private' 
//                                 value='private' 
//                                 checked={formData.privacy === 'private'} 
//                                 onChange={handlePrivacyChange} 
//                             />
//                             <label htmlFor='private'>
//                                 <span>Private</span>
//                                 <span className="description">Only I can see what I post</span>
//                             </label>
//                         </div>
//                         <h4>Change Password</h4>
//                         <form onSubmit={handlePasswordChange}>
//                             <div className="form">
//                                 <label>
//                                     Enter Old Password
//                                     <input 
//                                         type="text" 
//                                         name="password" 
//                                         placeholder={formData.password}
//                                         value={formData.password} 
//                                         onChange={handleInputChange}                                        
//                                         required 
//                                     />
//                                 </label>
//                                 {errors.password && <span className="error">{errors.password}</ span>}
//                             </div>
//                             <div className="form">
//                                 <label>
//                                     Enter New Password
//                                     <input 
//                                         type="text" 
//                                         name="newPassword" 
//                                         value={formData.newPassword} 
//                                         onChange={handleInputChange}                                        
//                                         required 
//                                     />
//                                 </label>
//                                 {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
//                             </div>
//                             <div className="form">
//                                 <label>
//                                     Confirm New Password
//                                     <input 
//                                         type="text" 
//                                         name="confirmPassword" 
//                                         value={formData.confirmPassword} 
//                                         onChange={handleInputChange}                                        
//                                         required 
//                                     />
//                                 </label>
//                             </div>
//                             <button type="submit">Change Password</button>
//                         </form>
//                         <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
//                         <button className="delete-account-button" onClick={handleDeleteAccount}>Delete Account</button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Settings;