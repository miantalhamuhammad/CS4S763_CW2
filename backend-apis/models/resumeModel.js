const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    title: String,
    summary: String,
    phone: String,
    email: String,
    address: String,
    skills: [String],
    education: [
        {
            institution: String,
            degree: String,
            year: String,
        },
    ],
    experience: [
        {
            company: String,
            position: String,
            startDate: String,
            endDate: String,
            description: String,
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
