const UsageLog = require('../models/UsageLog');

// Whitelist of allowed fields — prevents mass-assignment / injection
const ALLOWED_FIELDS = ['action', 'details', 'sessionDuration'];

function pickAllowed(body) {
  const safe = {};
  ALLOWED_FIELDS.forEach(key => {
    if (key in body) safe[key] = body[key];
  });
  return safe;
}

// POST /api/usage/log
exports.logUsage = async (req, res) => {
  try {
    // FIX: whitelist fields before passing to model
    const safeBody = pickAllowed(req.body);
    const log = await UsageLog.create(safeBody);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/usage/stats?period=7d
exports.getUsageStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    const daysMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[period] || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await UsageLog.find({
      timestamp: { $gte: startDate }
    });

    const stats = {
      totalActions: logs.length,
      clicks:      logs.filter(l => l.action === 'click').length,
      scrolls:     logs.filter(l => l.action === 'scroll').length,
      moves:       logs.filter(l => l.action === 'move').length,
      connections: logs.filter(l => l.action === 'connect').length,
      // FIX: guard against NaN when sessionDuration is missing
      totalDuration: logs.reduce((sum, l) => sum + (Number.isFinite(l.sessionDuration) ? l.sessionDuration : 0), 0),
      dailyActivity: {}
    };

    logs.forEach(log => {
      const day = log.timestamp.toISOString().split('T')[0];
      stats.dailyActivity[day] = (stats.dailyActivity[day] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/usage/recent?limit=50
exports.getRecentLogs = async (req, res) => {
  try {
    // FIX: cap limit at 200 to prevent huge responses
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const logs = await UsageLog.find()
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};