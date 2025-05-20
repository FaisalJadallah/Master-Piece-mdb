const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const authMiddleware = require('../middleares/authMiddleware');

// Get all tournaments
router.get('/', tournamentController.getAllTournaments);

// Get user's tournaments (requires authentication)
// This route must come before the /:id route to avoid conflicts
router.get('/user/history', authMiddleware, tournamentController.getUserTournaments);

// Get a single tournament
router.get('/:id', tournamentController.getTournamentById);

// Create a new tournament
router.post('/', tournamentController.createTournament);

// Update a tournament
router.put('/:id', tournamentController.updateTournament);

// Delete a tournament
router.delete('/:id', tournamentController.deleteTournament);

// Tournament participants
router.get('/:id/participants', tournamentController.getTournamentParticipants);
router.post('/:id/register', tournamentController.registerParticipant);
router.put('/:id/participants', tournamentController.updateParticipantStatus);

module.exports = router; 