const express = require("express");
const router = express.Router();
const users = require("../controllers/chatroom.js");
const { encode } = require("../middlewares/jwt.js")

router
  .get('/', chatRoom.getRecentConversation)
  .get('/:roomId', chatRoom.getConversationByRoomId)
  .post('/initiate', chatRoom.initiate)
  .post('/:roomId/message', chatRoom.postMessage)
  .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

export default router;
