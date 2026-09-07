const Product = require("../model/product.model");
const cloudinary = require("../config/cloudinary");
const getProductList = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, desc, category, price } = req.body;
    console.log(
      "data coming in create controller",
      name,
      desc,
      category,
      price,
    );
    console.log("comming image", req.file);
    const uploadImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "product-managmnet/products",
    });
    console.log("uploadImage", uploadImage);
    const response = await Product.create({
      name,
      desc,
      price,
      category,
      image: {
        url: uploadImage.url,
        public_id: uploadImage.public_id,
      },
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, category, price } = req.body;

   
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    
    product.name = name || product.name;
    product.desc = desc || product.desc;
    product.category = category || product.category;
    product.price = price || product.price;

    
    if (req.file) {
     
      if (product.image && product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      
      const uploadImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "product-managmnet/products",
      });

      
      product.image = {
        url: uploadImage.url,
        public_id: uploadImage.public_id,
      };
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.image && product.image.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getProductList,
  createProduct,
  updateProduct,
  deleteProduct,
};
