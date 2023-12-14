const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const {
  UUID, UUIDV4, STRING, BOOLEAN, ARRAY, INTEGER,
} = Sequelize;
const { db } = require('../db');

const Student = db.define('Student', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    unique: true,
    // primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },
  studentID: {
    type: INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
    primaryKey: true,
  },
  firstName: {
    type: STRING,
    allowNull: false,
    validate: {
        notEmpty: true,
    },
  },
  lastName: {
    type: STRING,
    allowNull: false,
    validate: {
        notEmpty: true,
    },
  },
  grade: {
    type: INTEGER,
    allowNull: true,
  },
  stripeKey: {
    type: STRING,
    allowNull: true,
  },
  subscriptionType: {
    type: STRING,
    allowNull: false,
  },
  parent1Email: {
    type: STRING,
    allowNull: true,
  },
  parent1FirstName: {
    type: STRING,
    allowNull: true,
  },
  parent1LastName: {
    type: STRING,
    allowNull: true,
  },
  parent2Email: {
    type: STRING,
    allowNull: true,
  },
  parent2FirstName: {
    type: STRING,
    allowNull: true,
  },
  parent2LastName: {
    type: STRING,
    allowNull: true,
  },
  teacherFirstName: {
    type: STRING,
    allowNull: true,
  },
  teacherLastName: {
    type: STRING,
    allowNull: true,
  },
  teacherEmail: {
    type: STRING,
    allowNull: true,
  },
  teacherSchool: {
    type: STRING,
    allowNull: true,
  },
  teacherSchool: {
    type: STRING,
    allowNull: true,
  },
  paymentType: {
    type: STRING,
    allowNull: true, 
  },
  city: {
    type: STRING,
    allowNull: true,
  },
  state: {
    type: STRING,
    allowNull: true,
  },
  country: {
    type: STRING,
    allowNull: true,
  },
});

module.exports = { Student };