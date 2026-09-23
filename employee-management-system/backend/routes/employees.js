const express = require('express');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const router = express.Router();

const validateEmployee = (body) => {
  const { name, department, role, salary, joinDate } = body;
  const errors = {};
  if (!name || !String(name).trim()) errors.name = 'Name is required.';
  else if (String(name).trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!department || !String(department).trim()) errors.department = 'Department is required.';
  if (!role || !String(role).trim()) errors.role = 'Role is required.';
  if (salary === '' || salary === undefined || salary === null || Number.isNaN(Number(salary)) || Number(salary) < 0) errors.salary = 'Salary must be a valid non-negative number.';
  if (!joinDate || Number.isNaN(new Date(joinDate).getTime())) errors.joinDate = 'A valid join date is required.';
  return errors;
};

router.get('/', async (req, res, next) => {
  try {
    const { search = '', sortBy = 'createdAt', order = 'desc' } = req.query;
    const allowedSort = ['name', 'department', 'role', 'salary', 'joinDate', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const filter = search.trim()
      ? { $or: [
          { name: { $regex: search.trim(), $options: 'i' } },
          { department: { $regex: search.trim(), $options: 'i' } },
          { role: { $regex: search.trim(), $options: 'i' } }
        ] }
      : {};
    const employees = await Employee.find(filter).sort({ [sortField]: sortOrder });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid employee ID.' });
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found.' });
    res.json({ success: true, data: employee });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validateEmployee(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Please correct the validation errors.', errors });
    const employee = await Employee.create({
      name: req.body.name.trim(), department: req.body.department.trim(), role: req.body.role.trim(), salary: Number(req.body.salary), joinDate: req.body.joinDate
    });
    res.status(201).json({ success: true, message: 'Employee created successfully.', data: employee });
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid employee ID.' });
    const errors = validateEmployee(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Please correct the validation errors.', errors });
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name.trim(), department: req.body.department.trim(), role: req.body.role.trim(), salary: Number(req.body.salary), joinDate: req.body.joinDate },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found.' });
    res.json({ success: true, message: 'Employee updated successfully.', data: employee });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid employee ID.' });
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found.' });
    res.json({ success: true, message: 'Employee deleted successfully.', data: employee });
  } catch (error) { next(error); }
});

module.exports = router;
