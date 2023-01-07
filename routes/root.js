const express = require("express");
const router = express.Router();
const path = require("path");

const homePath = path.join(__dirname, "..", "views", "index.html");

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(homePath)
})

module.exports = router