const express = require("express");
const { jwtSign, jwtVerify } = require("../middleware/jwt");
const {
  getUser,
  verifyId,
  getUsers,
  getUsersSpecifiedField,
  mutualConnection,
  getUsersConnectField,
  deleteAConnection,
} = require("../db/operator");
const { usersDB } = require("../db/mongodb");
const { ObjectId } = require("mongodb");
const router = express.Router();

router.post("/jwt", jwtSign);

router.post("/users", async (req, res) => {
  const { email } = req.body;
  const user = await getUser(email);
  if (user) {
    res.send({ status: "200", msg: "User already exists" });
  } else {
    await usersDB.insertOne(req.body);
    res.send({ status: "200", msg: "User created successfully" });
  }
});

router.patch("/user/profile", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  const { email: updateEmail, first_name, sur_name, number } = req.body;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  } else if (first_name) {
    await usersDB.updateOne(
      { _id: new ObjectId(signature) },
      { $set: { first_name: first_name } }
    );
  } else if (sur_name) {
    await usersDB.updateOne(
      { _id: new ObjectId(signature) },
      { $set: { sur_name: sur_name } }
    );
  } else if (number) {
    await usersDB.updateOne(
      { _id: new ObjectId(signature) },
      { $set: { number: number } }
    );
  } else if (updateEmail) {
    await usersDB.updateOne(
      { _id: new ObjectId(signature) },
      { $set: { email: updateEmail } }
    );
  }
  res.send({ status: "200", msg: "User profile updated successfully" });
});

router.put("/user/education", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne(
    { _id: new ObjectId(signature) },
    { $set: { education: req.body } }
  );
  res.send({ status: "200", msg: "User education updated successfully" });
});

router.put("/user/image", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne(
    { _id: new ObjectId(signature) },
    { $set: { image: req.body.image } }
  );
  res.send({ status: "200", msg: "User image updated successfully" });
});

router.put("/user/about", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne(
    { _id: new ObjectId(signature) },
    { $set: { about: req.body?.about } }
  );
  res.send({ status: "200", msg: "User about updated successfully" });
});

router.put("/user/skills", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne(
    { _id: new ObjectId(signature) },
    { $set: { skills: req.body.skillsData } }
  );
  res.send({ status: "200", msg: "User skills updated successfully" });
});

router.put("/user/experience", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne(
    { _id: new ObjectId(signature) },
    { $set: { experience: req.body } }
  );
  res.send({ status: "200", msg: "User experience updated successfully" });
});

router.put("/user/certification", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne(
    { _id: new ObjectId(signature) },
    { $set: { certification: req.body } }
  );
  res.send({ status: "200", msg: "User certification updated successfully" });
});

router.get("/user/info", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  res.send({ status: "200", user });
});

router.get("/users/all", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const users = await getUsersSpecifiedField(signature);
  if (!users) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  res.send({ status: "200", users });
});
router.get("/users/connected", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const users = await getUsersConnectField(signature);
  if (!users) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  res.send({ status: "200", users });
});

router.put("/user/connect/:id", jwtVerify, async (req, res) => {
  const { id } = req.params;
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await mutualConnection(signature, id);
  res.send({ status: "200", msg: "User connection updated successfully" });
});

router.delete("/user/delete/:id", jwtVerify, async (req, res) => {
  const { id } = req.params;
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { signature } = decoded;
  const user = await verifyId(signature);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await deleteAConnection(signature, id);
  res.send({ status: "200", msg: "User connection updated successfully" });
});

module.exports = router;
