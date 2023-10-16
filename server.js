const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

// Requiring Express for our app and establishing connection at port 3001
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

// Database Connection for MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/nosql-social-db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB!");
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
