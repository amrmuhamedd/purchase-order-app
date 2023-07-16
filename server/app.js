const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/purchase-orders", purchaseOrderRoutes);

const port = 5000;

mongoose
  .connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log("cant connet to database please try again", err));
