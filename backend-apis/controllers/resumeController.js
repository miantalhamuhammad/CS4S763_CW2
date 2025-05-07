const Resume = require('../models/resumeModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
// Create a new resume
exports.createResume = async (req, res) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        const { fullName, contactInfo, skills, experience, education } = req.body;

        const formattedSkills = skills?.map(skill => skill);//.name);
        const formattedExperience = experience?.map(item => ({
            company: item.company,
            position: item.position,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description
        }));
        const formattedEducation = education?.map(item => ({
            institution: item.institution,
            degree: item.degree,
            year: item.year
        }));

        const newResume = new Resume({
            userId,
            fullName: fullName,
            email: contactInfo?.email,
            phone: contactInfo?.phone,
            skills: formattedSkills,
            experience: formattedExperience,
            education: formattedEducation
        });
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
        const { name, contactInfo, skills, experience, education,email } = req.body;

        const formattedSkills = skills?.map(skill => skill.name);
        const formattedExperience = experience?.map(item => ({
            company: item.company,
            position: "",
            startDate: item.from_date,
            endDate: item.to_date,
            description: ""
        }));
        const formattedEducation = education?.map(item => ({
            institution: "",
            degree: item.Degree,
            year: item.Batch
        }));

        const updatedResume = await Resume.findByIdAndUpdate(
            req.params.id,
            {
                fullName: name,
                email: contactInfo?.email,
                phone: contactInfo?.mobile_no,
                skills: formattedSkills,
                experience: formattedExperience,
                education: formattedEducation
            },
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
