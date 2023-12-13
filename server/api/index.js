const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = require('./server');
const { db } = require('../db/db');
const { User, Session, Cart } = require('../db/Models/index');

const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = path.join(__dirname, '../../public');
const DIST_PATH = path.join(__dirname, '../../dist');

app.use(cookieParser());

app.use(async (req, res, next) => {
  if (!req.cookies.session_id) {
    const session = await Session.create();

    const oneWeek = 1000 * 60 * 60 * 24 * 7;

    res.cookie('session_id', session.id, {
      path: '/',
      expires: new Date(Date.now() + oneWeek),
    });
    req.session_id = session.id;
    await Cart.create(
      {
        sessionId: req.session_id,
      },
    );
    next();
  } else {
    req.session_id = req.cookies.session_id;

    const user = await User.findOne({
      include: [
        {
          model: Session,
          where: {
            id: req.session_id,
          },
        },
      ],
    });

    if (user) {
      req.user = user;
    }

    next();
  }
});

app.use(express.json());
app.use(cors());
app.use(express.static(PUBLIC_PATH));
app.use(express.static(DIST_PATH));
app.use('/api', require('./routers/index'));

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, './index.html'));
});

const startServer = () => new Promise((res) => {
  app.listen(PORT, () => {
    console.log(`Server is now listening on PORT:${PORT}`);
    res();
  });
});

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is now listening on PORT:${PORT}`);
    });
  });

module.exports = {
  app,
  startServer,
};
