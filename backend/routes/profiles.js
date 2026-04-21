const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: 1 });
    
    // Seed default if empty
    if (profiles.length === 0) {
      const defaultProfile = new Profile({
        name: "User A",
        initial: "A",
        sensitivity: 50,
        active: true,
        color: "#9a3f3f"
      });
      await defaultProfile.save();
      return res.json([defaultProfile]);
    }
    
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create profile
router.post('/', async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update profile
router.put('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete profile
router.delete('/:id', async (req, res) => {
  try {
    // Cannot delete if it's the last profile
    const count = await Profile.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ error: "Cannot delete the last profile" });
    }

    const profile = await Profile.findById(req.params.id);
    await Profile.findByIdAndDelete(req.params.id);

    // If deleted active profile, make the oldest one active
    if (profile && profile.active) {
      const oldest = await Profile.findOne().sort({ createdAt: 1 });
      if (oldest) {
        oldest.active = true;
        await oldest.save();
      }
    }

    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Switch active profile
router.post('/switch/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    
    profile.active = true;
    await profile.save(); // pre-save hook handles setting others to false
    
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
