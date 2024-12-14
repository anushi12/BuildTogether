const express = require('express');
const Mood = require('../models/mood'); 
const {userAuth} = require('../middlewares/auth');

const moodRouter = express.Router();


moodRouter.post('/mood', userAuth, async (req, res) => {
  const { userId } = req.user;
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "Mood is required" });
  }

  try {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMood = await Mood.findOne({
      user: userId,
      date: { $gte: today },
    });

    if (existingMood) {
      
      existingMood.mood = mood;
      await existingMood.save();
      return res.status(200).json({ message: "Mood updated successfully", mood: existingMood });
    }

    
    const newMood = new Mood({ user: userId, mood });
    await newMood.save();

    res.status(201).json({ message: "Mood added successfully", mood: newMood });
  } catch (error) {
    res.status(500).json({ error: "Failed to add or update mood", details: error.message });
  }
});


moodRouter.get('/mood', userAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mood = await Mood.findOne({
      user: userId,
      date: { $gte: today },
    });

    if (!mood) {
      return res.status(404).json({ message: "No mood recorded for today" });
    }

    res.status(200).json(mood);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch daily mood", details: error.message });
  }
});


moodRouter.get('/mood/weekly', userAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    const weeklyMoods = await Mood.find({
      user: userId,
      date: { $gte: weekAgo, $lte: today },
    }).sort({ date: 1 });

    res.status(200).json(weeklyMoods);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weekly mood data", details: error.message });
  }
});

moodRouter.get('/mood/monthly', userAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const today = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);

    const monthlyMoods = await Mood.find({
      user: userId,
      date: { $gte: monthAgo, $lte: today },
    }).sort({ date: 1 });

    res.status(200).json(monthlyMoods);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch monthly mood data", details: error.message });
  }
});

module.exports = moodRouter;
