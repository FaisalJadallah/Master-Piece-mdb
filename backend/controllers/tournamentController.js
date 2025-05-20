const Tournament = require('../models/Tournament');

// Get all tournaments
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ dateTime: 1 });
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single tournament
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new tournament
exports.createTournament = async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    const savedTournament = await tournament.save();
    res.status(201).json(savedTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a tournament
exports.updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.status(200).json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.status(200).json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register participant for a tournament
exports.registerParticipant = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    // Check if tournament is full
    if (tournament.participants.length >= tournament.numberOfPlayers) {
      return res.status(400).json({ message: 'Tournament is full' });
    }
    
    // Check if user is already registered
    const existingParticipant = tournament.participants.find(
      participant => participant.email === req.body.email
    );
    
    if (existingParticipant) {
      return res.status(400).json({ message: 'You are already registered for this tournament' });
    }
    
    console.log('Registration request body:', req.body);
    
    // Convert userId to ObjectId if it exists and is valid
    let userId = null;
    if (req.body.userId && req.body.userId !== 'null' && req.body.userId !== 'undefined') {
      const mongoose = require('mongoose');
      try {
        userId = mongoose.Types.ObjectId(req.body.userId);
        console.log('Converted userId to ObjectId:', userId);
      } catch (err) {
        console.error('Invalid userId format:', req.body.userId);
      }
    }
    
    // Add new participant
    tournament.participants.push({
      userId: userId,
      fullName: req.body.fullName,
      email: req.body.email,
      gamerTag: req.body.gamerTag || req.body.teamName,
      status: 'registered'
    });
    
    await tournament.save();
    
    res.status(201).json({
      message: 'Registration successful',
      tournament: {
        id: tournament._id,
        gameName: tournament.gameName,
        dateTime: tournament.dateTime
      }
    });
  } catch (error) {
    console.error('Tournament registration error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get tournament participants
exports.getTournamentParticipants = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    res.status(200).json(tournament.participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update participant status
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { participantId, status } = req.body;
    
    if (!participantId || !status) {
      return res.status(400).json({ message: 'Participant ID and status are required' });
    }
    
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    const participantIndex = tournament.participants.findIndex(
      p => p._id.toString() === participantId
    );
    
    if (participantIndex === -1) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    tournament.participants[participantIndex].status = status;
    await tournament.save();
    
    res.status(200).json({
      message: 'Participant status updated',
      participant: tournament.participants[participantIndex]
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tournaments a user has participated in
exports.getUserTournaments = async (req, res) => {
  try {
    console.log(`[TOURNAMENTS] Fetching tournaments for user ${req.user.userId}`);
    
    // Find all tournaments where the user is a participant
    const tournaments = await Tournament.find({
      'participants.userId': req.user.userId
    }).sort({ dateTime: -1 });
    
    if (!tournaments || tournaments.length === 0) {
      return res.status(200).json([]);
    }
    
    // Format the response to include only relevant information
    const userTournaments = tournaments.map(tournament => {
      // Find the user's specific participation record
      const userParticipation = tournament.participants.find(
        p => p.userId && p.userId.toString() === req.user.userId
      );
      
      return {
        id: tournament._id,
        name: tournament.gameName,
        date: tournament.dateTime,
        game: tournament.gameName,
        status: tournament.status,
        position: userParticipation ? userParticipation.status : 'unknown',
        prize: tournament.prize,
        gamerTag: userParticipation ? userParticipation.gamerTag : '',
      };
    });
    
    res.status(200).json(userTournaments);
  } catch (error) {
    console.error('[TOURNAMENTS] Error fetching user tournaments:', error);
    res.status(500).json({ message: error.message });
  }
}; 