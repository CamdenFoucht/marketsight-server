const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/Users');

var salt = bcrypt.genSaltSync(10);

router.post('/change/username', async (req, res) => {
  try {
    const { value, section } = req.body;
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    let user = await Users.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }

    user.username = value;

    await user.save();

    console.log('change name success');
    console.log(user);

    return res.json({
      msg: 'Change name success',
      username: user.username,
      success: true,
      section,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error });
  }
});

router.post('/change/email', async (req, res) => {
  try {
    const { value } = req.body;
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    let user = await Users.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }
    user.email = value;

    await user.save();

    return res.json({
      msg: 'Change email success',
      email: user.email,
      success: true,
      section: 'email',
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error });
  }
});

router.post('/change/password', async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.value;
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    let user = await Users.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }

    let match = bcrypt.compareSync(currentPassword, user.password);

    if (match) {
      const hash = bcrypt.hashSync(newPassword, salt);
      user.password = hash;
    } else {
      return res.status(401).json({
        error: 'Incorrect password. Please try again',
        accountError: true,
      });
    }

    await user.save();

    return res.json({
      msg: 'Change password success',
    });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
});

router.delete('/', async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    let user = await Users.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }

    await Users.deleteOne({ _id: decodedToken._id });

    return res.json({
      msg: 'Successfully deleted user',
      success: true,
    });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
});

module.exports = router;
