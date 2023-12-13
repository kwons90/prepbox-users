/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
require('dotenv').config();
const studentRouter = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SK);
const {
  Cart, User, Students,
} = require('../../db/Models/index');

const createPrevCart = async (inactiveId, checkoutTime, orders) => ({
  inactiveId,
  username: orders[0].username,
  checkoutTime,
  orders,
});

// cartRouter.post('/addtocart', async (req, res) => {
//   const { students, quantity } = req.body;
//   const cart = await Cart.findOne({
//     where: {
//       sessionId: req.session_id,
//       isActive: true,
//     },
//   });
//   const movie = await Movie.findOne({
//     where: {
//       id: movieId,
//     },
//   });
//   if (cart.UserId) {
//     const user = await User.findOne({ where: { id: cart.UserId } });
//     const createdOrder = await Order.create(
//       {
//         movieId,
//         quantity,
//         CartId: cart.id,
//         name: movie.title,
//         images: [movie.poster],
//         username: user.username,
//       },
//     );
//     res.send(createdOrder);
//   } else {
//     const createdOrder = await Order.create(
//       {
//         movieId,
//         quantity,
//         CartId: cart.id,
//         name: movie.title,
//         images: [movie.poster],
//       },
//     );
//     res.send(createdOrder);
//   }
// });

module.exports = studentRouter;