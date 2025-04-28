const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middlewares/authMiddleware');

// Create a new resume
router.post('/',auth, resumeController.createResume);

// Get all resumes
router.get('/',auth, resumeController.getAllResumes);

// Get a resume by ID
router.get('/:id',auth, resumeController.getResumeById);

// Update a resume by ID
router.put('/:id',auth, resumeController.updateResume);

// Delete a resume by ID
router.delete('/:id',auth, resumeController.deleteResume);

module.exports = router;
