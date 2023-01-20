import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const nameIsUsed = await User.findOne({ username });
    const emailIsUsed = await User.findOne({ email });

    if (nameIsUsed) {
      return res.json({
        message: 'This username is already taken.',
      });
    }
    if (emailIsUsed) {
      return res.json({
        message: 'This email is already taken.',
      });
    }

    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    await newUser.save();

    res.json({
      newUser,
      token,
      message: 'Registration completed successfully.',
    });
  } catch (error) {
    res.json({ message: 'Error creating user.' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        message: 'This user does not exist.',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({
        message: 'Wrong password.',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user,
      message: 'You are logged in.',
    });
  } catch (error) {
    res.json({ message: 'Authorization error.' });
  }
};

// Get Me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        message: 'This user does not exist.',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.json({ message: 'No access.' });
  }
};

// Get All
export const getAll = async (req, res) => {
  try {
    const users = await User.find({});

    res.json({
      users,
    });
  } catch (error) {
    res.json("don't know wtf happened");
  }
};

// Remove user

export const removeUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.json({ message: "This user doesn't exist." });
    }

    res.json({ message: 'User deleted.' });
  } catch (error) {
    res.json({ message: 'Something went wrong.' });
  }
};

// Update user
export const updateUser = (req, res) => {
  try {
    User.findOneAndUpdate({ username: req.params.username }, req.body).then(
      function () {
        User.findOne({ username: req.params.username }).then(function (user) {
          res.json(user);
        });
      }
    );
  } catch (error) {
    res.json({ message: 'Something went wrong.' });
  }
};
