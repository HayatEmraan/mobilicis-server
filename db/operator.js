const { ObjectId } = require("mongodb");
const { usersDB } = require("./mongodb");

const getUser = async (email) => {
  const users = await usersDB.findOne({ email: email });
  return users;
};

const getUsers = async () => {
  const users = await usersDB.find({});
  return users;
};

const verifyId = async (id) => {
  const user = await usersDB.findOne({ _id: new ObjectId(id) });
  return user;
};

const mutualConnection = async (id, connect) => {
  const existing = await usersDB.findOne({ _id: new ObjectId(id) });
  if (existing) {
    const previous = existing.connected || [];
    const user = await usersDB.updateOne(
      { _id: new ObjectId(id) },
      { $set: { connected: [...previous, connect] } }
    );
    return user;
  }
};

const getUsersSpecifiedField = async (signature) => {
  const findUser = await usersDB.findOne({ _id: new ObjectId(signature) });
  const connectedIDs = findUser?.connected?.map((id) => new ObjectId(id)) || [];
  const getUsers = await usersDB
    .find({ _id: { $nin: connectedIDs, $ne: new ObjectId(signature) } })
    .project({ _id: 1, first_name: 1, experience: 1, image: 1 })
    .toArray();
  return getUsers;
};

const getUsersConnectField = async (signature) => {
  const findUser = await usersDB.findOne({ _id: new ObjectId(signature) });
  const connectedIDs = findUser?.connected?.map((id) => new ObjectId(id)) || [];
  const getUsers = await usersDB
    .find({ _id: { $in: connectedIDs } })
    .project({ _id: 1, first_name: 1, experience: 1, image: 1 })
    .toArray();
  return getUsers;
};

const deleteAConnection = async (id, deleteConnect) => {
  const userDocument = await usersDB.findOne({ _id: new ObjectId(id) });
  const find = userDocument?.connected?.findIndex((id) => id === deleteConnect);
  const document = userDocument?.connected;
  document.splice(find, 1);
  const result = await usersDB.updateOne(
    { _id: new ObjectId(id) },
    { $set: { connected: document } }
  );
  return result;
};

module.exports = {
  getUser,
  getUsers,
  verifyId,
  getUsersSpecifiedField,
  mutualConnection,
  getUsersConnectField,
  deleteAConnection,
};
