const router = require("express").Router();
const {
  addComment,
  removeComment,
  addReply,
  removeReply,
} = require("../../controllers/comment-controller");

// /api/comments/<pizzaId>
router.route("/:pizzaId").post(addComment);

// /api/comments/<pizzaId>/<commentId>
// After deleting a particular comment, you need to know exactly which pizza that comment originated from.
router.route("/:pizzaId/:commentId").put(addReply).delete(removeComment);

router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;
