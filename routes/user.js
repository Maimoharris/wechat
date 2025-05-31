const express = require("express");
const router = express.Router();
const users = require("../controllers/user.js");
const { encode } = require("../middlewares/jwt.js")

router
    .get('/',users.onGetAllUsers)
    .get('/',users.onCreateUsers)
    .get('/:id',users.OnGetUserById)
    .delete('/:id',users.onDeleteUserById)
export default router;