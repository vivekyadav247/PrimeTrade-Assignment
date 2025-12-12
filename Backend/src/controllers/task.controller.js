const Task = require("../models/task.model");
const { taskSchema } = require("../validators/task.validator");

exports.createTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const task = await Task.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user.id };
    const tasks = await Task.find(filter).populate("createdBy", "name email");
    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const isOwner = task.createdBy.equals(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isOwner)
      return res.status(403).json({ error: "Forbidden" });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Not found" });

    const isOwner = task.createdBy.equals(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isOwner)
      return res.status(403).json({ error: "Forbidden" });

    await task.deleteOne();
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
};
