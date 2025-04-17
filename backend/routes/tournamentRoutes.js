const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

// Get all tournaments
router.get('/', tournamentController.getAllTournaments);

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