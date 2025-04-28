const Resume = require('../models/resumeModel');

// Create a new resume
exports.createResume = async (req, res) => {
    try {
        const { name, contactInfo, skills, experience, education } = req.body;
        const newResume = new Resume({ name, contactInfo, skills, experience, education });

        await newResume.save();
        res.status(201).json({ message: 'Resume created successfully', resume: newResume });
    } catch (error) {
        res.status(400).json({ message: 'Error creating resume', error });
    }
};

// Get all resumes
exports.getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find();
        res.status(200).json({ resumes });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching resumes', error });
    }
};

// Get a resume by ID
exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ resume });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching resume', error });
    }
};

// Update a resume by ID
exports.updateResume = async (req, res) => {
    try {
        const { name, contactInfo, skills, experience, education } = req.body;
        const updatedResume = await Resume.findByIdAndUpdate(
            req.params.id,
            { name, contactInfo, skills, experience, education },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume updated successfully', resume: updatedResume });
    } catch (error) {
        res.status(400).json({ message: 'Error updating resume', error });
    }
};

// Delete a resume by ID
exports.deleteResume = async (req, res) => {
    try {
        const deletedResume = await Resume.findByIdAndDelete(req.params.id);
        if (!deletedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting resume', error });
    }
};
