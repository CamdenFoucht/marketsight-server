const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Users = require('../models/Users');

router.get('/marketList', async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    console.log(token);

    let user = await Users.findById(decodedToken.userId);

    console.log(user);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }

    return res.json({
      message: 'Fetch list succesful',
      lists: user.lists,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: 'Error' });
  }
});

router.post('/marketList', async (req, res) => {
  try {
    const { token, listTitle } = req.body;
    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    let user = await Users.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }

    let arr = [...Array.from(user.lists)];
    const index = arr.findIndex((el) => el.title === listTitle);

    if (index < 0) {
      arr.push({ title: listTitle, tickers: [] });
    }

    user.lists = arr;

    await user.save();

    return res.json({ message: 'Success', user });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/marketList', async (req, res) => {
  try {
    let { listTitle, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    let user = await Users.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }

    const arr = Array.from(user.lists);

    const indexOfList = arr.findIndex((el) => el.title === listTitle);

    if (indexOfList >= 0) {
      arr.splice(indexOfList, 1);
    }

    user.lists = arr;

    await user.save();

    return res.json({ message: 'Success', user });
  } catch (err) {
    console.log(err);
    return res.status(404);
  }
});

router.post('/ticker', async (req, res) => {
  try {
    let { listTitle, ticker, token, name } = req.body;

    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    let user = await Users.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }

    const arr = Array.from(user.lists);

    const indexOfList = arr.findIndex((el) => el.title === listTitle);

    if (
      indexOfList >= 0 &&
      !arr[indexOfList].tickers.some((el) => el.ticker === ticker)
    ) {
      arr[indexOfList].tickers.push({ ticker, name });
    }

    user.lists = arr;

    await user.save();

    return res.json({ message: 'Success', user });
  } catch (err) {
    console.log(err);
    return res.status(404);
  }
});

router.delete('/ticker/:ticker/listIndex/:listIndex', async (req, res) => {
  try {
    let { listIndex, ticker } = req.params;
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_HASH);

    let user = await Users.findById(decodedToken.userId);

    if (!user) {
      return res.status(403).json({ error: 'There was a problem.' });
    }

    const arr = Array.from(user.lists);

    if (
      listIndex >= 0 &&
      arr[listIndex].tickers.some((el) => el.ticker === ticker)
    ) {
      let index = arr[listIndex].tickers.findIndex(
        (el) => el.ticker === ticker
      );
      arr[listIndex].tickers.splice(index, 1);
      console.log(arr);
    }

    user.lists = arr;

    await user.save();

    return res.json({ message: 'Success', user });
  } catch (err) {
    console.log(err);
    return res.status(404);
  }
});
module.exports = router;
