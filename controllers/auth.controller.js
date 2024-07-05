const bcrypt = require("bcrypt");
const User = require("../models/User");

const { SESSION_NAME = "sid" } = process.env;

const GET_REGISTER = (req, res) => {
  const data = {
    title: "Register",
    layout: "./layouts/auth-layout",
  };
  res.render("register", data);
};

const POST_REGISTER = async (req, res) => {
  // set page data
  let data = {
    title: "Register",
    layout: "./layouts/auth-layout",
    errors: {},
  };

  // get params from request body
  const { name, email, mobile, password, type } = req.body;
  try {
    // create user
    const user = await User.create({ name, email, mobile, password, type });
    
    // store user to session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      type: user.type,
      profilePicture: user.profilePicture
    };

    // redirects to dashboard
    res.redirect("/dashboard");
    return;
  } catch (error) {

    // duplicate data issue
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        data.errors.email = "Email addaress is already exists";
      }
      if (error.keyPattern.mobile) {
        data.errors.mobile = "Mobile number is already exists";
      }
    }

    // errors on fields validations
    if (error.errors) {
      if (error.errors.name) {
        data.errors.name = error.errors.name.message;
      }

      if (error.errors.email) {
        data.errors.email = error.errors.email.message;
      }

      if (error.errors.password) {
        data.errors.password = error.errors.password.message;
      }

      if (error.errors.type) {
        data.errors.type = error.errors.type.message;
      }
      
      if (error.errors.mobile) {
        data.errors.mobile = error.errors.mobile.message;
      }
    }
    
    //redirects back if there are any validation errors
    res.render("register", data);
    return;
  }
};

const GET_LOGIN = (req, res) => {
  // set page data
  const data = {
    title: "Login in",
    layout: "./layouts/auth-layout",
  };
  res.render("login", data);
};

const POST_LOGIN = async (req, res) => {
  // set page data
  let data = {
    title: "Login in",
    layout: "./layouts/auth-layout",
    errors: {},
  };

  // get data from request body
  const { email, password } = req.body;

  // check if email is not provided
  if (!email) {
    data.errors.email = "Please enter your username";
  }

  // check if password is not provided
  if (!password) {
    data.errors.password = "Password is required";
  }

  // get user by email from database
  const user = await User.findOne({ email });

  if (user) {
    // compare the password from request vs password in db - Authenticated ok
    const matchUserPassword = await bcrypt.compare(password, user.password);

    if (matchUserPassword) {
      // store user to session
      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        type: user.type,
        profilePicture: user.profilePicture
      };

      // redirects to dashboard
      res.redirect("/dashboard");
      return;
    }

    // if password not match set error message
    data.errors.message = "Username or password is not correct";
    res.render("login", data);
    return;
  
  }
  // if user not found set error message
  data.errors.message = "Username or password is not correct";

  //redirects back to login page if user not found or passsword not matched
  res.render("login", data);
  return;
};

const LOGOUT = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie(SESSION_NAME);
    req.session = null;
    res.redirect("/");
    res.end();
  });
};

// Export all consts
module.exports = {
  GET_REGISTER,
  POST_REGISTER,
  GET_LOGIN,
  POST_LOGIN,
  LOGOUT,
};
