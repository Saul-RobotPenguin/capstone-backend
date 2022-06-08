require("dotenv").config();
const User = require("../models/user");
const JobLink = require("../models/joblink");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//HIDE JWT SECRET IN ENV FILE

const signUp = async (req, res) => {
  try {
    //Rounds has to be process.env basically the 10
    salt = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const usersData = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    if (req.body.username) {
      const findIfUserExists = await User.findOne({
        username: req.body.username,
      });
      if (findIfUserExists) {
        return res.json({
          status: "error",
          error: `Username With ${req.body.username} Already Exists`,
        });
      }
    }

    const user = await new User(usersData);
    await user.save();
    return res.status(200).json({ status: "success" });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        status: "error",
        error: "An Account With This Email Already Exists!",
      });
    }
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.json({
        status: "error",
        error: "Invalid Username or Password",
      });
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      //HIDE JWT SECRET IN ENV FILE
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET
      );
      return res.json({ status: "ok", data: token, msg: "Logged In!!" });
    }
    return res.json({ status: "error", error: "Invalid Username or Password" });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
};

const changeUsersPassword = async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const _id = user.id;
    const hashedPassword = await bcrypt.hash(
      req.body.newPassword,
      process.env.SALT_ROUNDS
    );
    await User.updateOne(
      { _id },
      {
        $set: { password: hashedPassword },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "" });
  }
};

//Job Links
const createAJobLink = async (req, res) => {
  try {
    const joblink = await new JobLink(req.body);
    await joblink.save();
    return res.status(201).json({
      joblink,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//
const getAllJobLinks = async (req, res) => {
  try {
    const joblinks = await JobLink.find();
    return res.status(200).json({ joblinks });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteJobLink = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await JobLink.findByIdAndDelete(id);
    if (deleted) {
      return res.status(200).send("JobLink deleted");
    }
    throw new Error("Job link not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  signUp,
  login,
  changeUsersPassword,
  createAJobLink,
  getAllJobLinks,
  deleteJobLink,
};
