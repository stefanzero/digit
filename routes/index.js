var express = require('express');
var router = express.Router();
// const app = require('../app');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let color
  if (req.cookies && typeof req.cookies.color === 'string') {
    color = req.cookies.color
  } else {
    color = await app.db.getNextColor()
    res.cookie('color', color);
  }
  console.log('color: ', color);
  const colors = await app.db.readColorTable();
  res.render('index', { title: 'Digit', color, colors });
});

module.exports = router;
