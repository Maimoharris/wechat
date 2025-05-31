const express = require("express");
const router = express.Router();
const users = require("../controllers/delete.js");
const { encode } = require("../middlewares/jwt.js")


router
  .delete('/room/:roomId', deleteController.deleteRoomById)
  .delete('/message/:messageId', deleteController.deleteMessageById)

export default router;