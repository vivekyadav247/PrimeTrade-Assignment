const router = require("express").Router();
const adminCtrl = require("../../controllers/admin.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { checkRole } = require("../../middleware/role.middleware");

router.get("/users", authenticate, checkRole("admin"), adminCtrl.getAllUsers);

router.get("/tasks", authenticate, checkRole("admin"), adminCtrl.getAllTasks);

router.get(
  "/users/:id/tasks",
  authenticate,
  checkRole("admin"),
  adminCtrl.getUserTasks
);

module.exports = router;
