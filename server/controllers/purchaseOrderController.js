const csv = require("csv-parser");
const fs = require("fs");
const PurchaseOrder = require("../models/PurchaseOrder");

const createPurchaseOrder = async (req, res) => {
  const { date, vendorName } = req.body;
  const purchaseOrders = [];
  const validationErrors = [];

  // Check if the file exists
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Read the CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      // Validate and process each row of the CSV
      const {
        "Model Number": modelNumber,
        "Unit Price": unitPrice,
        Quantity: quantity,
      } = row;
      if (!modelNumber || !unitPrice || !quantity) {
        validationErrors.push("Missing fields in the row");
        return;
      }

      // Validate Model Number as a non-empty string
      if (typeof modelNumber !== "string" || modelNumber.trim() === "") {
        validationErrors.push("Invalid Model Number");
      }

      // Validate Unit Price as a number
      if (isNaN(parseFloat(unitPrice))) {
        validationErrors.push("Invalid Unit Price");
      }

      // Validate Quantity as an integer
      if (!Number.isInteger(parseInt(quantity))) {
        validationErrors.push("Invalid Quantity");
      }

      // If there are no errors, add the purchase order to the list
      if (validationErrors.length === 0) {
        purchaseOrders.push({
          modelNumber,
          unitPrice: parseFloat(unitPrice),
          quantity: parseInt(quantity),
          vendorName,
          date,
        });
      }
    })
    .on("end", async () => {
      // Delete the uploaded CSV file
      fs.unlinkSync(req.file.path);

      if (validationErrors.length > 0) {
        return res.status(400).json({
          message: `Invalid rows in the CSV : ${validationErrors}`,
          errors: validationErrors,
        });
      }

      try {
        // Save the validated purchase orders to the database
        const createdPurchaseOrders = await PurchaseOrder.insertMany(
          purchaseOrders
        );
        res.json({
          message: "Purchase orders submitted successfully!",
          purchaseOrders: createdPurchaseOrders,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "An error occurred while saving the purchase orders.",
        });
      }
    });
};

const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find();
    res.json(purchaseOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching the purchase orders.",
    });
  }
};
module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
};
