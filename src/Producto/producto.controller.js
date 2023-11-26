import productsModel from "./producto.model.js";

import jwt from "jsonwebtoken";
const secretKey = "colombiavictoriosa";

export async function createProduct(req, res) {
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
    const product = req.body;
    req.body.isDisable = false;
    product.userid = decode.userId;
    const document = await productsModel.create(product);
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function getProduct(req, res) {
  try {
    const id = req.params.id;

    const document = await productsModel.findOne({ _id: id, isDisable: false });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function getProductbyUTandorC(req, res) {
  try {
    const { categoria, nom, userid } = req.query;
    const filter = {
      ...(categoria && { categories: { $in: [categoria] } }),
      ...(nom && { $text: { $search: nom } }), //cambie esto
      ...(userid && { userid: userid }),
      isDisable: false,
    };

    const documents = await productsModel.find(filter);
    documents.length > 0
      ? res.status(200).json(documents)
      : res.sendStatus(404);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function getCategoriesbyUser(req, res) {
  try {
    const { userid } = req.params;
    const documents = await productsModel.find({
      userid: userid,
      isDisable: false,
    });
    const categoriesSet = new Set();
    documents.forEach((product) => {
      product.categories.forEach((category) => {
        categoriesSet.add(category);
      });
    });
    const categories = Array.from(categoriesSet);
    categories.length > 0
      ? res.status(200).json(categories)
      : res.sendStatus(404);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function patchProduct(req, res) {
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
    const id = req.params.id;
    const document = await productsModel.findOneAndUpdate(
      { userid: decode.userId, _id: id },
      req.body,
      { runValidators: true }
    );
    document
      ? res.status(200).json("Changes applied")
      : res
          .status(404)
          .json("Product not found or user didn't create this product");
  } catch (error) {
    res.status(500).json(error.message);
  }
}


export async function deleteProduct(req, res) {
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
    const id = req.params.id;
    const document = await productsModel.findOneAndUpdate(
      { userid: decode.userId, _id: id },
      { isDisable: true }
    );
    document
      ? res.status(200).json("Changes applied")
      : res
          .status(404)
          .json("Product not found or user didn't create this product");
  } catch (err) {
    res.status(500).json(err.message);
  }
}