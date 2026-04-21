const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  initial: {
    type: String,
    required: true,
  },
  sensitivity: {
    type: Number,
    default: 50,
  },
  active: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '#10b981',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Remove old active profiles flag before saving if this one is set to active
ProfileSchema.pre('save', async function (next) {
  if (this.active) {
    await mongoose.model('Profile').updateMany(
      { _id: { $ne: this._id } },
      { $set: { active: false } }
    );
  }
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
