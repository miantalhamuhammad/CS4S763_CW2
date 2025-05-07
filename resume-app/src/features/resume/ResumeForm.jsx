import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Button, TextField, Typography, Container, Paper, Grid,
    Alert, CircularProgress, Divider, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { createResume, updateResume, getResumeById, clearCurrentResume } from './resumeSlice';

const ResumeForm = ({ mode = 'create' }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentResume, isLoading, isError, message } = useSelector((state) => state.resume);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        contactInfo: {
            mobile_no: '',
            phone: ''
        },
        skills: [{ name: '' }],
        experience: [{
            company: '',
            position: '',
            from_date: '',
            to_date: '',
            description: ''
        }],
        education: [{
            institution: '',
            Degree: '',
            Batch: ''
        }]
    });

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Load resume data only once when component mounts in edit mode
    useEffect(() => {
        if (mode === 'edit' && id && !initialLoadComplete) {
            setLocalLoading(true);

            console.log('dispatching getResumeById');
            console.log(id);
            dispatch(getResumeById(id))
                .unwrap()
                .finally(() => {
                    setLocalLoading(false);
                    setInitialLoadComplete(true);
                });
        }
    }, [mode, id, dispatch, initialLoadComplete]);
    useEffect(() => {
        if (mode === 'edit' && initialLoadComplete) {
            try {
                // Check if currentResume exists and has the expected structure
                if (currentResume && currentResume.resume) {
                    const { resume } = currentResume;
                    console.log('Setting form data with:', resume);

                    setFormData({
                        name: resume.fullName || '',
                        contactInfo: {
                            mobile_no: resume.phone || '',
                            phone: resume.phone || '',
                            email: resume.email || ''
                        },
                        skills: Array.isArray(resume.skills) && resume.skills.length > 0
                            ? resume.skills.map(skill => ({ name: skill }))
                            : [{ name: '' }],
                        experience: Array.isArray(resume.experience) && resume.experience.length > 0
                            ? resume.experience.map(exp => ({
                                company: exp.company || '',
                                position: exp.position || '',
                                from_date: exp.startDate || '', // Will be empty in your case
                                to_date: exp.endDate || '',    // Will be empty in your case
                                description: exp.description || ''
                            }))
                            : [{
                                company: '',
                                position: '',
                                from_date: '',
                                to_date: '',
                                description: ''
                            }],
                        education: Array.isArray(resume.education) && resume.education.length > 0
                            ? resume.education.map(edu => ({
                                institution: edu.institution || '',
                                Degree: edu.degree || '', // Will be empty in your case
                                Batch: edu.year || ''     // Will be empty in your case
                            }))
                            : [{
                                institution: '',
                                Degree: '',
                                Batch: ''
                            }]
                    });
                } else if (currentResume === null) {
                    console.log('currentResume is null - data not loaded yet');
                }
            } catch (err) {
                console.error('Error setting form data:', err);
            }
        }
    }, [currentResume, mode, initialLoadComplete]);

    // Clear current resume when unmounting
    useEffect(() => {
        return () => {
            dispatch(clearCurrentResume());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        if (e.target.name.includes('contactInfo.')) {
            const field = e.target.name.split('.')[1];
            setFormData({
                ...formData,
                contactInfo: {
                    ...formData.contactInfo,
                    [field]: e.target.value
                }
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSkillChange = (index, e) => {
        const newSkills = [...formData.skills];
        newSkills[index].name = e.target.value;
        setFormData({
            ...formData,
            skills: newSkills
        });
    };

    const addSkill = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, { name: '' }]
        });
    };

    const removeSkill = (index) => {
        const newSkills = [...formData.skills];
        newSkills.splice(index, 1);
        setFormData({
            ...formData,
            skills: newSkills
        });
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...formData.experience];
        newExperience[index][field] = value;
        setFormData({
            ...formData,
            experience: newExperience
        });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [
                ...formData.experience,
                {
                    company: '',
                    position: '',
                    from_date: '',
                    to_date: '',
                    description: ''
                }
            ]
        });
    };

    const removeExperience = (index) => {
        const newExperience = [...formData.experience];
        newExperience.splice(index, 1);
        setFormData({
            ...formData,
            experience: newExperience
        });
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...formData.education];
        newEducation[index][field] = value;
        setFormData({
            ...formData,
            education: newEducation
        });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                {
                    institution: '',
                    Degree: '',
                    Batch: ''
                }
            ]
        });
    };

    const removeEducation = (index) => {
        const newEducation = [...formData.education];
        newEducation.splice(index, 1);
        setFormData({
            ...formData,
            education: newEducation
        });
    };

    const prepareSubmitData = () => {
        return {
            fullName: formData.name,
            contactInfo: {
                phone: formData.contactInfo.phone,
                email: formData.contactInfo.email,
                mobile_no: formData.contactInfo.mobile_no
            },
            skills: formData.skills.map(skill => skill.name),
            experience: formData.experience.map(exp => ({
                company: exp.company,
                position: exp.position,
                startDate: exp.from_date,
                endDate: exp.to_date,
                description: exp.description
            })),
            education: formData.education.map(edu => ({
                institution: edu.institution,
                degree: edu.Degree,
                year: edu.Batch
            }))
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const submitData = prepareSubmitData();

        try {
            if (mode === 'edit' && id) {
                await dispatch(updateResume({ id, resumeData: submitData })).unwrap();
                setSuccess('Resume updated successfully!');
            } else {
                await dispatch(createResume(submitData)).unwrap();
                setSuccess('Resume created successfully!');
            }

            setTimeout(() => navigate('/resumes'), 1500);
        } catch (error) {
            setError(error.message || 'Failed to save resume');
        }
    };

    if (mode === 'edit' && (localLoading || (isLoading && !currentResume))) {
        return (
            <Container maxWidth="md">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress size={60} />
                    <Typography variant="body1" sx={{ ml: 2 }}>Loading resume data...</Typography>
                </Box>
            </Container>
        );
    }

    if (mode === 'edit' && isError) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 4 }}>
                    Failed to load resume: {message}
                </Alert>
                <Button onClick={() => navigate('/resumes')} sx={{ mt: 2 }}>
                    Back to Resumes
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {mode === 'edit' ? 'Edit Resume' : 'Create New Resume'}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    {/* Basic Information Section */}
                    <Typography variant="h6" gutterBottom>Basic Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="contactInfo.email"
                                value={formData.contactInfo.email}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="contactInfo.mobile_no"
                                value={formData.contactInfo.mobile_no}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="contactInfo.phone"
                                value={formData.contactInfo.phone}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Skills Section */}
                    <Typography variant="h6" gutterBottom>Skills</Typography>
                    {formData.skills.map((skill, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TextField
                                fullWidth
                                label={`Skill ${index + 1}`}
                                value={skill.name}
                                onChange={(e) => handleSkillChange(index, e)}
                                margin="normal"
                            />
                            <IconButton onClick={() => removeSkill(index)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button
                        type="button"
                        onClick={addSkill}
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                    >
                        Add Skill
                    </Button>

                    <Divider sx={{ my: 3 }} />

                    {/* Experience Section */}
                    <Typography variant="h6" gutterBottom>Experience</Typography>
                    {formData.experience.map((exp, index) => (
                        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Company"
                                        value={exp.company}
                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Position"
                                        value={exp.position}
                                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Start Date"
                                        value={exp.from_date}
                                        onChange={(e) => handleExperienceChange(index, 'from_date', e.target.value)}
                                        margin="normal"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="End Date"
                                        value={exp.to_date}
                                        onChange={(e) => handleExperienceChange(index, 'to_date', e.target.value)}
                                        margin="normal"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={exp.description}
                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                        margin="normal"
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={() => removeExperience(index)} color="error">
                                    Remove Experience
                                </Button>
                            </Box>
                        </Box>
                    ))}
                    <Button
                        type="button"
                        onClick={addExperience}
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                    >
                        Add Experience
                    </Button>

                    <Divider sx={{ my: 3 }} />

                    {/* Education Section */}
                    <Typography variant="h6" gutterBottom>Education</Typography>
                    {formData.education.map((edu, index) => (
                        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Institution"
                                        value={edu.institution}
                                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Degree"
                                        value={edu.Degree}
                                        onChange={(e) => handleEducationChange(index, 'Degree', e.target.value)}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Batch/Year"
                                        value={edu.Batch}
                                        onChange={(e) => handleEducationChange(index, 'Batch', e.target.value)}
                                        margin="normal"
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={() => removeEducation(index)} color="error">
                                    Remove Education
                                </Button>
                            </Box>
                        </Box>
                    ))}
                    <Button
                        type="button"
                        onClick={addEducation}
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                    >
                        Add Education
                    </Button>

                    {/* Form Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/resumes')}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{ minWidth: 120 }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : (mode === 'edit' ? 'Update' : 'Create')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResumeForm;