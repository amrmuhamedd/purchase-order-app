const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  modelNumber: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

module.exports = PurchaseOrder;
