const express = require("express");
const multer = require("multer");
const purchaseOrderController = require("../controllers/purchaseOrderController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  upload.single("file"),
  purchaseOrderController.createPurchaseOrder
);

router.get("/", purchaseOrderController.getAllPurchaseOrders);
module.exports = router;
