const router = require("express").Router();
const task = require("../../controllers/task.controller");
const { authenticate } = require("../../middleware/auth.middleware");

router.use(authenticate);

router.post("/", task.createTask);
router.get("/", task.getTasks);
router.put("/:id", task.updateTask);
router.delete("/:id", task.deleteTask);

module.exports = router;
