require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');

console.log(process.env.NODE_ENV);
connectDB();
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());

// Built in middleware - express.static used to static assets (HTML, CSS, JS, images, etc.) from public folder
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));
app.use('/users', require('./routes/userRoutes'));
app.use('/notes', require('./routes/noteRoutes'));

// Express v5  - The wildcard * must have a name, matching the behavior of parameters :, use /*splat instead of /*
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

app.use(errorHandler);
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
});
