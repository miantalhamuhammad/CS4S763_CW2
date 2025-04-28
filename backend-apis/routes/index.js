const express = require('express');
const router = express.Router();

// Import product and auth routes
const resumeRoutes = require('./resumes');
const authRoutes = require('./auth');

// Use the routes
router.use('/resumes', resumeRoutes);
router.use('/auth', authRoutes);

module.exports = router;
