// utils/getNextId.js
const Counter = require('../models/Counter');

// Hàm lấy id tiếp theo từ Counter
async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  }
  
  module.exports = getNextSequence;