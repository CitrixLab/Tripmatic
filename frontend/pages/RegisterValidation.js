function Validation(values) {
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (values.firstname === "") {
        error.firstname = "First name should not be empty";
    } else {
        error.firstname = "";
    }

    if (values.lastname === "") {
        error.lastname = "Last name should not be empty";
    } else {
        error.lastname = "";
    }

    if (values.username === "") {
        error.username = "Username should not be empty";
    } else {
        error.username = "";
    }

    if (values.email === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email is invalid";
    } else {
        error.email = "";
    }

    if (values.password === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must contain at least one digit, lowercase, uppercase letter, and min. of 8 characters";
    } else {
        error.password = "";
    }

    if (values.cpassword === "") {
        error.cpassword = "Confirm password should not be empty";
    } else if (values.cpassword !== values.password) {
        error.cpassword = "Passwords do not match";
        //error.confirmpassword = values.confirmpassword + values.password ;
    } else {
        error.cpassword = "";
    }

    return error;
}

export default Validation;
