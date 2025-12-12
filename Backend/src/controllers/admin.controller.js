const User = require("../models/user.model");
const Task = require("../models/task.model");
const { paginationSchema } = require("../validators/pagination.validator");

exports.getAllUsers = async (req, res) => {
  try {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message });

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit).select("-password");
    const total = await User.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    console.error("GetAllUsers Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message });

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    const tasks = await Task.find()
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email");
    const total = await Task.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.params.id }).populate(
      "createdBy",
      "name email"
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await Task.deleteMany({ createdBy: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and their tasks deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    await Task.findByIdAndDelete(req.params.taskId);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
