const { usersDB } = require("./mongodb");

const getUser = async (email) => {
  const users = await usersDB.findOne({ email: email });
  return users;
};

module.exports = {
  getUser,
};
