const mongoose = require('mongoose');

const UsageLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    enum: ['click', 'scroll', 'move', 'connect', 'disconnect'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  sessionDuration: {
    type: Number,
    default: 0,
    min: 0
  }
});

// FIX: TTL index to auto-expire logs after 90 days — prevents unbounded growth
UsageLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

module.exports = mongoose.model('UsageLog', UsageLogSchema);