const express = require('express');
const router = express.Router();
const path = require('path');

// router.get('^/$|/index(.html)?', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
// });

// router.get(/^\/$|\/index(\.html)?/, (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
// });

// We can explicitly separate the paths rather than using a regex string
router.get(['/', '/index', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;