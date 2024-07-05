const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email is already exists"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  mobile: {
    type: String,
    required: [true, "Please enter your mobile number"],
    unique: [true, "Mobile is already exists"],
    validate: [isMobilePhone, "Please enter a valid mobile number"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  type: {
    type: String,
    required: [true, "Please select type"],
    enum: ["student", "sponsor"],
    default: "student",
  },
  profilePicture: {
    type: String,
  }
}, { timestamps: true });

/**
 * Hash user password on creating a new user
 * We will not store plain password to database instead we will has password to increase security
 * so before saving user to database we will fire save function to encrypt user password
 */
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Hash user password on updating user password
 * We will not store plain password to database instead we will has password to increase security
 * so before updating user password to database we will fire findOneAndUpdate function to encrypt user password
 */
UserSchema.pre("findOneAndUpdate", async function (next) {
  let requestData = this.getUpdate();
  if (requestData.password) {
    const salt = await bcrypt.genSalt();
    requestData.password = await bcrypt.hash(requestData.password, salt);
    next();
  }
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
