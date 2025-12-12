const Joi = require("joi");

exports.taskSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().optional(),
  status: Joi.string().valid("pending", "completed").optional(),
});
