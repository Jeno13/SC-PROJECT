const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const GET_UPDATE_ACCOUNT = (req, res) => {
  const data = {
    title: "Update Account",
    layout: "./layouts/dashboard-layout",
  };
  res.render("dashboard/account/update", data);
};

const POST_UPDATE_ACCOUNT = async (req, res) => {
  // set page data
  let data = {
    title: "Update Account",
    layout: "./layouts/dashboard-layout",
    errors: {},
  };

  // get params from request body
  const { name, email, mobile } = req.body;

  try {
    // check if profile picture exists on request then get profile picture file
    if (req.files) {
      // Delete old profile picture if exists
      if (req.session.user.profilePicture) {
        fs.unlinkSync(
          "./public/uploads/users/" + req.session.user.profilePicture
        );
      }

      let profilePicture = req.files.profilePicture;
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      profilePicture.mv("./public/uploads/users/" + profilePicture.name);
    }

    // Find user by id from session and update
    const user = await User.findOneAndUpdate(
      { _id: req.session.user.id },
      {
        name,
        email,
        mobile,
        profilePicture: req.files && req?.files?.profilePicture
          ? req.files.profilePicture.name
          : req.session.user.profilePicture,
      },
      {
        new: true, // this will redutn user after update if not set will return user before update
      }
    );
    // store updated user to session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      type: user.type,
      profilePicture: user.profilePicture,
    };

    req.flash("success", "Your account has been updated");

    // redirects to dashboard
    res.redirect("/dashboard");
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

      if (error.errors.mobile) {
        data.errors.mobile = error.errors.mobile.message;
      }
    }

    //redirects back to if there are any validation errors
    res.render("dashboard/account/update", data);
    return;
  }
};

const GET_UPDATE_ACCOUNT_PASSWORD = (req, res) => {
  const data = {
    title: "Change pPassword",
    layout: "./layouts/dashboard-layout",
  };
  res.render("dashboard/account/password", data);
};

const POST_UPDATE_ACCOUNT_PASSWORD = async (req, res) => {
  // set page data
  let data = {
    title: "Change pPassword",
    layout: "./layouts/dashboard-layout",
    errors: {},
  };

  // get params from request body
  const { current, password } = req.body;

  if (current === password) {
    data.errors.message = "Current password same is new password";
    res.render("dashboard/account/password", data);
    return;
  }

  try {
    // get user by email from database
    const checkUserPassword = await User.findOne({
      email: req.session.user.email,
    });

    // Compare current password with user password
    const matchUserPassword = await bcrypt.compare(
      current,
      checkUserPassword.password
    );

    if (!matchUserPassword) {
      data.errors.message = "Current password is not correct";
      res.render("dashboard/account/password", data);
      return;
    }

    // Find user by id from session and update password
    await User.findOneAndUpdate(
      { _id: req.session.user.id },
      { password: password }
    );
    req.flash("success", "Your password has been updated");

    // redirects to dashboard
    res.redirect("/dashboard");
    return;
  } catch (error) {
    data.errors.message = "There was an error, please try again later";
    //redirects back to if there are any validation errors
    res.render("dashboard/account/password", data);
    return;
  }
};

module.exports = {
  GET_UPDATE_ACCOUNT,
  POST_UPDATE_ACCOUNT,
  GET_UPDATE_ACCOUNT_PASSWORD,
  POST_UPDATE_ACCOUNT_PASSWORD,
};
