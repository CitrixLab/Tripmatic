
// Validation function for email and password
function Validation(values) {
  let error = {};

  // Email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const trimmedEmail = values.email ? values.email.trim() : '';
  if (!trimmedEmail) {
    error.email = "Email should not be empty";
  } else if (trimmedEmail.length > 254) {
    error.email = "Email is too long (maximum 254 characters)";
  } else if (!emailPattern.test(trimmedEmail)) {
    error.email = "Invalid email format";
  } else {
    error.email = ""; 
  return Object.keys(error).length === 0; // Return true if no errors
  }

  // Password validation
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!values.password) {
    error.password = "Password should not be empty";
  } else if (values.password.length > 128) {
    error.password = "Password is too long (maximum 128 characters)";
  } else if (!passwordPattern.test(values.password)) {
    error.password = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
  } else {
    error.password = ""; 
  return Object.keys(error).length === 0; // Return true if no errors
  }

    
  //return error;
}

module.exports = Validation;
