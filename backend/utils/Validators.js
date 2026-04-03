const validator = require("validator");

exports.validateVisitor = (data) => {
  const errors = {};
  if (!data.name || validator.isEmpty(data.name.trim())) {
    errors.name = "Name is required";
  }

  if (!data.email || validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Invalid email format";
  }
  if (!data.phone || validator.isEmpty(data.phone)) {
    errors.phone = "Phone is required";
  } 

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

exports.validateUser = (data) => {
    const errors = {};
    if (!data.name || validator.isEmpty(data.name.trim())) {
    errors.name = "Name is required";
  }
    if(!data.e)if (!data.email || validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password || validator.isEmpty(data.password)) {
    errors.email = "Password is required";
  } else if (!validator.isStrongPassword(data.password)) {
    errors.email = "Password is not Strong";
  }
}