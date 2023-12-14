require('dotenv').config();
// const chalk = require('chalk');
const cartRouter = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SK);
const axios = require('axios')
const {
  Cart, User,
} = require('../../db/Models/index');

const createPrevCart = async (inactiveId, checkoutTime, orders) => ({
  inactiveId,
  username: orders[0].username,
  checkoutTime,
  orders,
});

cartRouter.post('/addtocart', async (req, res) => {
  const { materialID, quantity } = req.body;
  const cart = await Cart.findOne({
    where: {
      sessionId: req.session_id,
      isActive: true,
    },
  });
  const material = await axios.get({ })
  if (cart.UserId) {
    const user = await User.findOne({ where: { id: cart.UserId } });
    const createdOrder = await Order.create(
      {
        movieId,
        materialID,
        materialQuestions,
      },
    );
    res.send(createdOrder);
  } else {
    const createdOrder = await Order.create(
      {
        movieId,
        materialID,
        materialQuestions,
      },
    );
    res.send(createdOrder);
  }
});

cartRouter.get('/', async (req, res) => {
  if (req.user) {
    const currentCart = await Cart.findOne({ where: { UserId: req.user.id } });
    const currentOrders = await Order.findAll({ where: { CartId: currentCart.id } });
    res.send(currentOrders);
  } else {
    const currentCart = await Cart.findOne({ where: { sessionId: req.session_id } });
    const currentOrders = await Order.findAll({ where: { CartId: currentCart.id } });
    res.send(currentOrders);
  }
});

cartRouter.get('/active', async (req, res) => {
  if (req.user) {
    const currentCart = await Cart.findOne({ where: { UserId: req.user.id, isActive: true } });
    const currentOrders = await Order.findAll({ where: { CartId: currentCart.id } });
    res.send(currentOrders);
  } else {
    const currentCart = await Cart.findOne({ where: { sessionId: req.session_id, isActive: true } });
    const currentOrders = await Order.findAll({ where: { CartId: currentCart.id } });
    res.send(currentOrders);
  }
});

cartRouter.get('/adminPreviousOrders', async (req, res) => {
  const previousCarts = [];
  const inactive = await Cart.findAll({ where: { isActive: false }, raw: true });
  await inactive.forEach(async (cart, idx) => {
    const orders = await Order.findAll({ where: { CartId: cart.id }, raw: true });
    const inactiveId = uuidv4();
    const prevCart = await createPrevCart(inactiveId, cart.updatedAt, orders);
    await previousCarts.push(prevCart);
    // if (idx === inactive.length - 1) {
    //   await res.send(previousCarts);
    // }
    if (previousCarts.length === inactive.length) {
      await res.send(previousCarts);
    }
  });
});

cartRouter.delete('/removefromcart/:movieid/:cartid', async (req, res) => {
  await Order.destroy({ where: { CartId: req.params.cartid, movieId: req.params.movieid } });
  res.sendStatus(200);
});

cartRouter.put('/editcartquantity/:movieid/:cartid', async (req, res) => {
  // const allOrders =    await Order.findAll({ where: { movieId: req.params.movieid,
  // CartId: req.params.cartid } });
  // console.log("allOrders-- ",allOrders);
  // console.log("allOrders-- ",allOrders.length);
  await Order.update({ quantity: 0 },
    { where: { movieId: req.params.movieid, CartId: req.params.cartid } });
  const order = await Order.findOne({
    where: {
      movieId: req.params.movieid,
      CartId: req.params.cartid,
    },
  });
  await Order.update({ quantity: req.body.quantity },
    { where: { movieId: order.movieId, CartId: order.CartId, id: order.id } });

  await Order.destroy({
    where: {
      movieId: req.params.movieid,
      CartId: req.params.cartid,
      quantity: 0,
    },
  });
  res.sendStatus(200);
});

cartRouter.put('/checkoutCart', async (req, res) => {
  // const allOrders =    await Order.findAll({ where: { movieId: req.params.movieid,
  // CartId: req.params.cartid } });
  // console.log("allOrders-- ",allOrders);
  // console.log("allOrders-- ",allOrders.length);
  if (req.user) {
    const currentCart = await Cart.findOne({ where: { UserId: req.user.id, isActive: true } });
    await currentCart.update({ isActive: false });
    const newCart = await Cart.create(
      {
        sessionId: req.session_id,
        UserId: req.user.id,
        isActive: true,
      },
    );
    res.send(newCart);
  } else {
    const currentCart = await Cart.findOne({ where: { sessionId: req.session_id }, isActive: true });
    currentCart.update({ isActive: false });
    const newCart = await Cart.create(
      {
        sessionId: req.session_id,
        isActive: true,
      },
    );
    res.send(newCart);
  }
});

cartRouter.post('/checkout', async (req, res) => {
  // console.log(req.body);
  try {
    const { token, total } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const idempotencyKey = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: total * 100,
        currency: 'usd',
        customer: customer.id,
      },
      //   receipt_email: token.email,
      //   description: 'ur fave bloccbuster dvds yummmm',
      //   shipping: {
      //     name: token.card.name,
      //     address: {
      //       line1: token.card.address_line1,
      //       line2: token.card.address_line2,
      //       city: token.card.address_city,
      //       country: token.card.address_country,
      //       postal_code: token.card.address_zip,
      //     },
      //   },
      // },
      {
        idempotencyKey,
      },
    );
    // console.log('Charge: ', { charge });
    res.sendStatus(200);
  } catch (e) {
    // console.error('Error: ', e);
    res.sendStatus(400);
  }
});

module.exports = cartRouter;