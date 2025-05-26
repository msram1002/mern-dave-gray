const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

// Built in middleware - express.static to retrieve the static files from public folder
app.use(express.json())

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));

// Express 5 The wildcard * must have a name, matching the behavior of parameters :, use /*splat instead of /*
app.all('/{*any}', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({message: '404 Not Found'})
  } else {
    res.type('txt').send('404 Not Found')
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));