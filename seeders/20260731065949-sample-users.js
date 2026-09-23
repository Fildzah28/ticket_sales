'use strict';
let md5 = require('md5')
const now = new Date()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        firstname: "Fildzah",
        lastname: "Zizi",
        email: "lailazizf@gmail.com",
        password: md5("282900"),
        role : "admin",
        createdAt : now,
        updatedAt : now
      },
      {
        firstname: "Anggita",
        lastname: "Madhina",
        email: "28Anggita@gmail.com",
        password: md5("281109"),
        role : "user",
        createdAt : now,
        updatedAt : now
      },
      {
        firstname: "Intan",
        lastname: "Arum",
        email: "Arom@gmail.com",
        password: md5("270309"),
        role : "user",
        createdAt : now,
        updatedAt : now
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};

