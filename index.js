const express = require('express');
const cors = require("cors");
const fs = require("fs");
var bodyParser = require("body-parser");
const router = express.Router();
const fileUpload = require('express-fileupload')
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 1819;
require('./src/db-config/connection')

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(express.json());
app.use(fileUpload())

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome To My Project.",
  });
});

// Routes
fs.readdirSync(__dirname + "/src/routes").forEach(function (file) {
  if (file === "index.js" || file.substr(file.lastIndexOf(".") + 1) !== "js")
    return;
  var name = file.substr(0, file.indexOf("."));
  require("./src/routes/" + name)(app, router);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});