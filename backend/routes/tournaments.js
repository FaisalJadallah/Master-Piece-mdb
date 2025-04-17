// routes/tournaments.js
const express = require("express");
const router = express.Router();
const Tournament = require("../models/Tournament");

router.get("/", async (req, res) => {
  const data = await Tournament.find();
  res.json(data);
});

router.post("/", async (req, res) => {
  const newTournament = new Tournament(req.body);
  await newTournament.save();
  res.json(newTournament);
});

router.put("/:id", async (req, res) => {
  const updated = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Tournament.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
