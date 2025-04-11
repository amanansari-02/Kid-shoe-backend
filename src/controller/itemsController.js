const multer = require("multer");
const path = require("path");
const Item = require("../models/itemsModel");
const STATUS_CODE = require("../constant/statusCode");
const SUCCESS_MESSAGE = require("../constant/successMessage");
const Items = require("../models/itemsModel");
const ERROR_MESSAGE = require("../constant/errorMessage");
const Order = require("../models/orderModel");

const uploadFilePath = path.resolve(__dirname, "../..", "public/products");

const storage = multer.diskStorage({
  destination: uploadFilePath,
  filename(req, file, fn) {
    fn(
      null,
      `${new Date().getTime().toString()}-${file.fieldname}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter(req, file, callback) {
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];
    const isValidExtension = allowedExtensions.includes(
      path.extname(file.originalname).toLowerCase()
    );
    const isValidMimeType = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
    ].includes(file.mimetype);

    if (isValidExtension && isValidMimeType) {
      return callback(null, true);
    }

    callback(
      new Error(
        "Invalid file type. Only picture files of type PNG, JPG, and WEBP are allowed!"
      )
    );
  },
}).single("photo");

exports.addItem = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (error) => {
        if (error) {
          console.log("Multer Error:", error);
          reject(error);
        } else {
          resolve();
        }
      });
    });

    const { name, price, type, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newItem = await Item.create({
      name,
      // description,
      price,
      image: req.file.filename,
      type,
      category,
    });

    return res.status(STATUS_CODE.CREATED).json({
      status: STATUS_CODE.CREATED,
      message: SUCCESS_MESSAGE.ITEM_ADDED,
      data: newItem,
    });
  } catch (error) {
    console.error("addItem error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const category = req.params.category;

    const items = await Items.find(
      category === "All" ? {} : { category: category }
    ).lean();
    items.forEach((item) => {
      item.photo = process.env.IMAGE_URL + item.image;
    });

    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      message: SUCCESS_MESSAGE.ALL_ITMES,
      data: items,
    });
  } catch (error) {
    console.error("getItems error: ", error);
  }
};

exports.getItemsByGender = async (req, res) => {
  try {
    const gender = req.params.gender;

    const items = await Items.find({ type: gender }).lean();
    items.forEach((item) => {
      item.photo = process.env.IMAGE_URL + item.image;
    });

    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      message: SUCCESS_MESSAGE.ALL_ITMES,
      data: items,
    });
  } catch (error) {
    console.error("getItems error: ", error);
  }
};

exports.getItemById = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Items.findById(id).lean();
    item.photo = process.env.IMAGE_URL + item.image;

    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      message: SUCCESS_MESSAGE.ALL_ITMES,
      data: item,
    });
  } catch (error) {
    console.error("getItems error: ", error);
  }
};

// exports.editItem = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const item = req.body;

//     const itemUpdate = await Item.findByIdAndUpdate({ _id: id }, item, {
//       new: true,
//     });

//     if (itemUpdate) {
//       return res.status(STATUS_CODE.OK).json({
//         status: STATUS_CODE.OK,
//         message: SUCCESS_MESSAGE.ITEM_UPDATED,
//       });
//     } else {
//       return res.status(STATUS_CODE.OK).json({
//         status: STATUS_CODE.BAD_REQUEST,
//         message: ERROR_MESSAGE.ITEM_NOT_UPDATED,
//       });
//     }
//   } catch (error) {
//     console.error("editItem error: ", error);
//   }
// };

exports.addOrder = async (req, res) => {
  const { email, itemId, name } = req.body;
  const newItem = await Order.create({
    name,
    email,
    itemId,
  });

  return res.status(STATUS_CODE.CREATED).json({
    status: STATUS_CODE.CREATED,
    message: "Order added sucessfully",
    data: newItem,
  });
};

exports.getOrders = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "Email parameter is missing",
      });
    }

    const orders = await Order.find({ email: email }).populate("itemId").lean();

    const data = orders.map((order) => ({
      ...order,
      itemId: {
        ...order.itemId,
        image: process.env.IMAGE_URL + order.itemId.image, // Fixed syntax
      },
    }));

    return res.status(200).json({
      status: 200,
      message: "Orders retrieved successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};
