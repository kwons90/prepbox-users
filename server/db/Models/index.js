const { Session } = require('./Session');
const { User } = require('./User');
const { Cart } = require('./Cart');
const { Student } = require('./Student');

Session.belongsTo(User);
User.hasMany(Session);
Cart.belongsTo(Session);
Cart.belongsTo(User);
Student.belongsTo(User);

module.exports = {
  Session,
  User,
  Cart,
  Student,
};