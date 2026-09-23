const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    department: { type: String, required: true, trim: true, maxlength: 60 },
    role: { type: String, required: true, trim: true, maxlength: 80 },
    salary: { type: Number, required: true, min: 0 },
    joinDate: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
