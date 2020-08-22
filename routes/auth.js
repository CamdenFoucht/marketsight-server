const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/Users');

var salt = bcrypt.genSaltSync(10);

router.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hash = bcrypt.hashSync(password, salt);

    const user = new Users({
      username,
      email,
      password: hash,
      lists: [],
    });

    await user.save();

    var token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_HASH
    );

    return res.json({
      msg: 'Success',
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await Users.findOne({ username: username }).exec();

    if (user) {
      let match = bcrypt.compareSync(password, user.password);

      if (!match) {
        return res
          .status(404)
          .json({ error: 'Incorrect username or password.' });
      }
    } else {
      return res.status(403).json({ error: 'Incorrect username or password.' });
    }

    var token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_HASH
    );

    return res.json({
      msg: 'Login Success',
      user: {
        username: user.username,
        email: user.email,
        lists: user.lists,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error });
  }
});

module.exports = router;
