import prisma from "../utils/client.js";
import path from "path";
import "dotenv/config";
import fs from "fs";

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
    });
    // throw new Error("ini testing error");
    res.json({ message: "success", response: products });
  } catch (error) {
    res.status(500).json({ message: error.message, response: null });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    res.json({ message: "success", response: product });
  } catch (error) {
    res.status(500).json({ message: error.message, response: null });
  }
};
export const insertProduct = async (req, res) => {
  const fileMaxSize = process.env.FILE_MAX_SIZE;
  const allowFileExt = process.env.FILE_EXTENSION;
  const msgFileSize = process.env.FILE_MAX_MESSAGE;
  if (req.body.name === null || req.body.name === "")
    return res
      .status(400)
      .json({ message: "name cannot be null", response: null });
  if (req.files === null)
    return res
      .status(400)
      .json({ message: "No file uploaded", response: null });
  const name = req.body.name;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = allowFileExt;

  if (!allowedType.includes(ext.toLowerCase()))
    return res
      .status(422)
      .json({ message: "Invalid image type", response: null });

  if (fileSize > fileMaxSize)
    return res.status(422).json({
      message: msgFileSize,
      response: null,
    });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err)
      return res.status(500).json({ message: err.message, response: null });
    try {
      const product = await prisma.product.create({
        data: {
          name: name,
          image: fileName,
          url: url,
        },
      });
      return res
        .status(201)
        .json({ message: "inserted successfully", response: product });
    } catch (error) {
      return res.status(500).json({ message: error.message, response: null });
    }
  });
};
export const updateProduct = async (req, res) => {
  try {
    // check data by id
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", response: null });
    let name = "";
    let fileName = "";
    let url = "";
    if (req.files === null) {
      fileName = product.image;
      url = product.url;
    } else {
      // upload new image
      const fileMaxSize = process.env.FILE_MAX_SIZE;
      const allowFileExt = process.env.FILE_EXTENSION;
      const msgFileSize = process.env.FILE_MAX_MESSAGE;
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      const allowedType = allowFileExt;

      if (!allowedType.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ message: "Invalid image type", response: null });

      if (fileSize > fileMaxSize)
        return res.status(422).json({
          message: msgFileSize,
          response: null,
        });

      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err)
          return res.status(500).json({ message: err.message, response: null });
      });
      // delete old image
      const filePath = `./public/images/${product.image}`;
      fs.unlinkSync(filePath);
    }
    if (req.body.name) {
      name = req.body.name;
    } else {
      name = product.name;
    }
    const productUpdated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: name,
        image: fileName,
        url: url,
      },
    });
    return res
      .status(200)
      .json({ message: "updated successfully", response: productUpdated });
  } catch (error) {
    res.status(500).json({ message: error.message, response: null });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // throw new Error("ini testing error");
    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", response: null });
    const filePath = `./public/images/${product.image}`;
    fs.unlinkSync(filePath);
    res
      .status(200)
      .json({ message: "deleted successfully", response: product });
  } catch (error) {
    res.status(500).json({ message: error.message, response: null });
  }
};
