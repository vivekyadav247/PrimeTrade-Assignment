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
    const tasks = await Task.find({ createdBy: req.params.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
