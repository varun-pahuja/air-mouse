const express = require('express');
const router = express.Router();
const Gesture = require('../models/Gesture');
const Profile = require('../models/Profile');

// Get all gestures (optionally filter by profileId)
router.get('/', async (req, res) => {
  try {
    const { profileId } = req.query;
    let query = {};
    if (profileId) {
      query.profileId = profileId;
    }
    const gestures = await Gesture.find(query).sort({ createdAt: 1 });
    res.json(gestures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new gesture
router.post('/', async (req, res) => {
  try {
    const { name, action, profileId, user } = req.body;
    
    // Ensure profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const newGesture = new Gesture({
      name,
      action: action || "None",
      profileId,
      user: user || profile.initial
    });
    
    await newGesture.save();
    res.status(201).json(newGesture);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a gesture's action
router.put('/:id', async (req, res) => {
  try {
    const gesture = await Gesture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(gesture);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a gesture
router.delete('/:id', async (req, res) => {
  try {
    await Gesture.findByIdAndDelete(req.params.id);
    res.json({ message: "Gesture deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
