const express = require("express");
const router = express.Router();
const users = require("../controllers/user.js");
const { encode } = require("../middlewares/jwt.js")


router.
    post('/login/:userId', encode, (req, res, next) => { })

export default router;