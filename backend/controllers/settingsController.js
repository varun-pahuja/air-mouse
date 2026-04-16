const Settings = require('../models/Settings');

// Whitelist of allowed setting fields (prevents mass-assignment / Mongo injection)
const ALLOWED_FIELDS = ['baseSensitivity', 'threshold', 'dynamicScaling', 'invertX', 'invertY'];

function pickAllowed(body) {
  const safe = {};
  ALLOWED_FIELDS.forEach(key => {
    if (key in body) safe[key] = body[key];
  });
  return safe;
}

// GET /api/settings — read-only; creates defaults if none exist yet (upsert, no extra save)
exports.getSettings = async (req, res) => {
  try {
    // FIX: use findOneAndUpdate with upsert so a GET never double-writes
    const settings = await Settings.findOneAndUpdate(
      {},
      { $setOnInsert: {} },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/settings — update with whitelisted + validated fields only
exports.updateSettings = async (req, res) => {
  try {
    // FIX: only write explicitly whitelisted fields — prevents injection & extra-field pollution
    const safeBody = pickAllowed(req.body);

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: { ...safeBody, updatedAt: Date.now() } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/settings/reset — delete and recreate with schema defaults
exports.resetSettings = async (req, res) => {
  try {
    await Settings.deleteMany({});
    const settings = await Settings.create({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};