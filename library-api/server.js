const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected");
    app.listen(PORT, () => console.log(`🚀 launch on http://localhost:${PORT}`));
  })
  .catch((error) => console.error("cannot connect to MongoDB:", error));
