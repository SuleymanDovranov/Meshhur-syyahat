const { sequelize, Contact } = require('./../models');

(async () => {
  await Contact.sync({ alter: true });
  console.log('DB Synced');
  process.exit(1);
})();
