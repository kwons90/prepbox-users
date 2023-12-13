// const chalk = require('chalk');
const { User, Student } = require('./server/db/Models/index');
const { db } = require('./server/db/db');
require('dotenv').config();

const sync = async (force = false) => {
  try {
    await db.sync({ force });
    console.log(`DB successfully connected, and synced. Force: ${force}`);
  } catch (e) {
    console.log('Error while connecting to database');
    throw e;
  }
};

const seed = async () => {
  await sync(true);

  User.create({
    username: 'kwonadmin',
    password: 'password1234',
    firstName: "Sang-Hyuk",
    lastName: "Kwon",
    userType: "admin",
    isAdmin: true,
    students: [58810]
  });

  Student.create( {
    studentID: 58810,
    firstName: "Andrew",
    lastName: "Kwon",
    grade: 9,
  })
};

seed();

console.log('Data is seeded');