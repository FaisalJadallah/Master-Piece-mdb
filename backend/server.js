const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", usersRoutes);

mongoose
  .connect("mongodb+srv://faisaljadallahfj:272935@cluster0.aatcy.mongodb.net/GamingHive?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
