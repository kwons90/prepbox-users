require('dotenv').config();
const userRouter = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SK);
const {
  Cart, User, Student,
} = require('../../db/Models/index');

userRouter.post('/', async (req, res) => {
  if (req.body.isAdmin) {
    const users = await User.findAll();
    console.log(req.body)
    res.send(users);
  } else {
    res.sendStatus(404);
  }
});

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    res.sendStatus(401);
  } else {
    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        res.send(err);
      } else if (result === true) {
        const session = await Session.findOne({ where: { id: req.session_id } });
        await Session.update({ UserId: user.id }, { where: { id: session.id } });
        const activeCart = await Cart.findOne({
          where: {
            UserId: user.id,
            isActive: true,
          },
        });
        const currentCart = await Cart.findOne({
          where: {
            sessionId: req.session_id,
          },
        });
        await Order.update({ username: user.username }, { where: { CartId: currentCart.id } });
        if (activeCart) {
          await Order.update({
            CartId: currentCart.id,
          }, { where: { CartId: activeCart.id } });
        }
        await Cart.update({ UserId: user.id }, { where: { id: currentCart.id } });
        if (activeCart) {
          await Cart.destroy({ where: { id: activeCart.id } });
        }
        await res.status(200).send(user);
      } else {
        res.sendStatus(400);
      }
    });
  }
});

module.exports = userRouter;