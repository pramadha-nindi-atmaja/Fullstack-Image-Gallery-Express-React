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
  try {
    const fileMaxSize = process.env.FILE_MAX_SIZE || 5000000; // 5MB default
    const allowFileExt = process.env.FILE_EXTENSION || '.jpg,.jpeg,.png,.gif';
    const msgFileSize = process.env.FILE_MAX_MESSAGE || 'File size exceeds maximum limit';
    
    // Validate name
    if (!req.body.name || req.body.name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Product name is required", response: null });
    }
    
    // Validate file
    if (!req.files || !req.files.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", response: null });
    }
    
    // Validate file type
    const file = req.files.file;
    const ext = path.extname(file.name).toLowerCase();
    const allowedTypes = allowFileExt.split(',').map(type => type.trim());
    
    if (!allowedTypes.includes(ext)) {
      return res
        .status(422)
        .json({ message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, response: null });
    }
    
    // Validate file size
    const fileSize = file.data.length;
    if (fileSize > fileMaxSize) {
      return res.status(422).json({
        message: msgFileSize,
        response: null,
      });
    }
    
    const name = req.body.name.trim();
    const description = req.body.description ? req.body.description.trim() : null;
    const category = req.body.category ? req.body.category.trim() : null;
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    
    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) {
        console.error('File move error:', err);
        return res.status(500).json({ message: "Failed to save file", response: null });
      }
      
      try {
        const product = await prisma.product.create({
          data: {
            name: name,
            description: description,
            category: category,
            image: fileName,
            url: url,
          },
        });
        return res
          .status(201)
          .json({ message: "Product created successfully", response: product });
      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: "Failed to create product in database", response: null });
      }
    });
  } catch (error) {
    console.error('Insert product error:', error);
    return res.status(500).json({ message: "Internal server error", response: null });
  }
};
export const updateProduct = async (req, res) => {
  try {
    // Validate ID
    const { id } = req.params;
    const productId = Number(id);
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID", response: null });
    }
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", response: null });
    // Handle file upload if new file provided
    let fileName = product.image;
    let url = product.url;
    
    if (req.files && req.files.file) {
      // Validate new file
      const fileMaxSize = process.env.FILE_MAX_SIZE || 5000000; // 5MB default
      const allowFileExt = process.env.FILE_EXTENSION || '.jpg,.jpeg,.png,.gif';
      const msgFileSize = process.env.FILE_MAX_MESSAGE || 'File size exceeds maximum limit';
      
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name).toLowerCase();
      const allowedTypes = allowFileExt.split(',').map(type => type.trim());
      
      // Validate file type
      if (!allowedTypes.includes(ext)) {
        return res
          .status(422)
          .json({ message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, response: null });
      }
      
      // Validate file size
      if (fileSize > fileMaxSize) {
        return res.status(422).json({
          message: msgFileSize,
          response: null,
        });
      }
      
      // Upload new file
      fileName = file.md5 + ext;
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      
      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
          console.error('File move error:', err);
          return res.status(500).json({ message: "Failed to save new file", response: null });
        }
      });
      
      // Delete old image if it's not the default placeholder
      if (product.image && product.image !== fileName) {
        const oldFilePath = `./public/images/${product.image}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }
    // Update product fields
    const name = req.body.name ? req.body.name.trim() : product.name;
    const description = req.body.description !== undefined ? 
      (req.body.description ? req.body.description.trim() : null) : 
      product.description;
    const category = req.body.category !== undefined ? 
      (req.body.category ? req.body.category.trim() : null) : 
      product.category;
    const productUpdated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name,
        description: description,
        category: category,
        image: fileName,
        url: url,
      },
    });
    return res
      .status(200)
      .json({ message: "Product updated successfully", response: productUpdated });
  } catch (error) {
    res.status(500).json({ message: error.message, response: null });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    // Validate ID
    const { id } = req.params;
    const productId = Number(id);
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID", response: null });
    }
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", response: null });
    }
    
    // Delete product from database
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    
    // Delete image file if it exists and is not a default placeholder
    if (product.image) {
      const filePath = `./public/images/${product.image}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res
      .status(200)
      .json({ message: "Product deleted successfully", response: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message, response: null });
  }
};
