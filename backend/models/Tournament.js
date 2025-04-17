// models/Tournament.js
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  gamerTag: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'checked-in', 'eliminated', 'winner'],
    default: 'registered'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

const tournamentSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  numberOfPlayers: {
    type: Number,
    required: true,
    min: 2
  },
  dateTime: {
    type: Date,
    required: true
  },
  prize: {
    type: String,
    required: true,
    trim: true
  },
  registrationFee: {
    type: Number,
    required: true,
    default: 10
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  participants: [participantSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for current number of participants
tournamentSchema.virtual('currentParticipants').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Set virtuals to be included when converting to JSON
tournamentSchema.set('toJSON', { virtuals: true });
tournamentSchema.set('toObject', { virtuals: true });

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
