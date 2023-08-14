const express = require("express");
const { jwtSign, jwtVerify } = require("../middleware/jwt");
const { getUser } = require("../db/operator");
const { usersDB } = require("../db/mongodb");
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
  const { email } = decoded;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  } else if (first_name) {
    await usersDB.updateOne({ email }, { $set: { first_name: first_name } });
  } else if (sur_name) {
    await usersDB.updateOne({ email }, { $set: { sur_name: sur_name } });
  } else if (number) {
    await usersDB.updateOne({ email }, { $set: { number: number } });
  } else if (updateEmail) {
    await usersDB.updateOne({ email }, { $set: { email: updateEmail } });
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
  const { email } = decoded;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne({ email }, { $set: { education: req.body } });
  res.send({ status: "200", msg: "User education updated successfully" });
});

router.put("/user/about", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { email } = decoded;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne({ email }, { $set: { about: req.body?.about } });
  res.send({ status: "200", msg: "User about updated successfully" });
});

router.put("/user/skills", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { email } = decoded;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne({ email }, { $set: { skills: req.body } });
  res.send({ status: "200", msg: "User skills updated successfully" });
});

router.put("/user/experience", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { email } = decoded;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne({ email }, { $set: { experience: req.body } });
  res.send({ status: "200", msg: "User experience updated successfully" });
});

router.put("/user/certification", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { email } = decoded;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  await usersDB.updateOne({ email }, { $set: { certification: req.body } });
  res.send({ status: "200", msg: "User certification updated successfully" });
});

router.get("/user/info", jwtVerify, async (req, res) => {
  const decoded = req.decoded;
  if (!decoded) {
    return res
      .status(500)
      .send({ status: "500", error: "Internal Server Error" });
  }
  const { email } = decoded;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).send({ status: "401", error: "user unauthorized" });
  }
  res.send({ status: "200", user });
});

module.exports = router;
