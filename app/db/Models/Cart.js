const Sequelize = require('sequelize');

const {
  UUID, UUIDV4, BOOLEAN,
} = Sequelize;
const { db } = require('../db');

const Cart = db.define('Cart', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: BOOLEAN,
    defaultValue: true,
  },
});

module.exports = { Cart };