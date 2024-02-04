const UserLogin = require('../models/userLoginSchema');
const PersonalDetailsModel = require('../models/personalDetailsSchema');
const bcrypt = require('bcrypt');

const crypto = require('crypto');

function generateUniqueID() {
  // Generate a random 4-digit number
  const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);

  // Hash the number using SHA-256 to ensure uniqueness
  const hashedNumber = crypto.createHash('sha256').update(random4DigitNumber.toString()).digest('hex');

  // Take the first 4 characters of the hashed result
  const uniqueID = hashedNumber.substring(0, 4);

  return uniqueID;
}



const newUserRegister = async (req, res) => {
  try {
    const { name, emailId, phoneNumber, password, role } = req.body;

    // Validation checks
    if (!isValidName(name)) {
      return res.status(400).json({ error: "Invalid name" });
    }

    if (!isValidEmail(emailId)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error:
          "Invalid password. It should be at least 8 characters, including uppercase, lowercase, number, and special character.",
      });
    }

    if (!isValidRole(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Assuming you have a valid implementation for generateUniqueID
    const userId = generateUniqueID();

    const hashedPassword = await bcrypt.hash(password, 10);

    const saveData = {
      name,
      emailId,
      phoneNumber,
      password: hashedPassword,
      role,
      userId,
    };

    // Assuming UserLogin is a Mongoose model
    const newUser = await UserLogin.create(saveData);

    res.json({ data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const personalDetails = async (req, res) => {
  try {
    const { emailId } = req.body;
    // console.log(req.body);
    const findUserEmailId = await UserLogin.findOne({
      emailId: emailId
    }).exec();

    if (findUserEmailId) {
      const {

        fatherName,
        motherName,
        street,
        area,
        city,
        state,
        country,
        pincode,
        educationDetails,
      } = req.body;
      const { userId } = findUserEmailId;
      // Create a new personal details document
      const newPersonalDetails = new PersonalDetailsModel({
        userId,
        fatherName,
        motherName,
        street,
        area,
        city,
        state,
        country,
        pincode,
        educationDetails,
      });

      // Save the document to the database
      const savedPersonalDetails = await newPersonalDetails.save();

      res.json({ data: savedPersonalDetails });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const specificUserDetails = async (req, res) => {
  try {
    const user = await UserLogin.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userUpdateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserLogin.findOne({ userId });
    if (user) {
      const { name, emailId, phoneNumber, password, role } = req.body;
      console.log('password----', password);
      // Validation checks
      if (!isValidName(name)) {
        return res.status(400).json({ error: "Invalid name" });
      }

      if (!isValidEmail(emailId)) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number" });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({
          error:
            "Invalid password. It should be at least 8 characters, including uppercase, lowercase, number, and special character.",
        });
      }

      if (!isValidRole(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }


      const hashedPassword = await bcrypt.hash(password, 10);

      const saveData = {
        name,
        emailId,
        phoneNumber,
        password: hashedPassword,
        role,
      };
      // Use findOneAndUpdate with the correct parameters
      const updatedUser = await UserLogin.findOneAndUpdate(
        { userId },
        saveData,
        { new: true } // Return the updated document
      );

      res.json({ data: updatedUser });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper functions for validation
function isValidName(name) {
  // Implement your validation logic for name
  return /^[a-zA-Z\s]+$/.test(name);
}

function isValidEmail(email) {
  // Implement your validation logic for email using regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  // Implement your validation logic for phone number
  return /^\d{10}$/.test(phoneNumber);
}

function isValidPassword(password) {
  // Implement your validation logic for password
  // Should be at least 8 characters, including uppercase, lowercase, number, and special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}

function isValidRole(role) {
  // Implement your validation logic for role
  return role.includes(role);
}

const deleteUserDetails = async (req, res) => {
  try {
    const user = await UserLogin.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use deleteOne method on the model to delete the document
    await UserLogin.deleteOne({ userId: req.params.userId });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const loginAccess = async (req, res) => {
  try {
    console.log(req.body.emailId);
    // return false;
    const user = await UserLogin.findOne({ emailId: req.body.emailId });
    // console.log(user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // console.log(user.password);

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUserDetails = async (req, res) => {
  try {
    // Fetch user details
    const userLoginDetails = await UserLogin.find({});

    // Fetch personal details
    const personalDetails = await PersonalDetailsModel.find({});

    // Combine user details with personal details based on the userId
    const combinedDetails = userLoginDetails.map(user => {
      const matchingPersonalDetail = personalDetails.find(personal => personal.userId === user.userId);
      return { ...user._doc, personalDetails: matchingPersonalDetail || {} };
    });

    res.json({ data: combinedDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  newUserRegister, personalDetails,
  specificUserDetails,
  userUpdateProfile,
  deleteUserDetails,
  loginAccess,
   getAllUserDetails
}