import Users from "./usuario.model.js";

import jwt from "jsonwebtoken";
const secretKey = "colombiavictoriosa";

export async function createUser(req, res) {
  try {
    const userinfo = req.body;
    const document = await Users.create(userinfo);
    res.status(201).send(document);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getUserbyID(req, res) {
  try {
    const filter = req.params.id;
    const value = await Users.findOne({ _id: filter, isDisable: false });
    value ? res.status(200).json(value) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getUserbyName_pass(req, res) {
  try {
    const user = req.body;
    const found = await Users.findOne({
      email: user.email,
      password: user.password,
      isDisable: false,
    });
    if (found) {
      const token = jwt.sign({ userId: found._id }, secretKey);
      res.status(200).json({ token });
    } else {
      res.status(404).json({ error: "User Not found" });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function patchUser(req, res) {
  try {
    const token = req.headers.authorization;
    let decode;
    try {
      decode = jwt.verify(token, secretKey);
    } catch {
      return res.status(401).json("invalid signature");
    }
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const document = await Users.findOneAndUpdate(
      { _id: decode.userId, isDisable: false },
      req.body,
      { runValidators: true }
    );
    document ? res.status(200).json("changes applied") : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const token = req.headers.authorization;
    let decode;
    try {
      decode = jwt.verify(token, secretKey);
    } catch {
      return res.status(401).json("invalid signature");
    }
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const document = await Users.findByIdAndUpdate(decode.userId, {
      isDisable: true,
    });
    document ? res.status(200).json("changes applied") : res.sendStatus(404);
  } catch (err) {
    res.status(400).json(err.message);
  }
}