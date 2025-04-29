import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createResume } from '../../api/resume';
import { Box, Button, TextField, Typography, Container, Paper, Grid } from '@mui/material';

const ResumeForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        skills: [{ name: '' }],
        experience: [
            {
                company: '',
                startDate: '',
                endDate: '',
                position: '',
                description: '',
            },
        ],
        education: [
            {
                institution: '',
                degree: '',
                year: '',
            },
        ],
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.resume);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSkillChange = (index, e) => {
        const newSkills = [...formData.skills];
        newSkills[index].name = e.target.value;
        setFormData({
            ...formData,
            skills: newSkills,
        });
    };

    const addSkill = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, { name: '' }],
        });
    };

    const removeSkill = (index) => {
        const newSkills = [...formData.skills];
        newSkills.splice(index, 1);
        setFormData({
            ...formData,
            skills: newSkills,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createResume(formData)).unwrap();
            navigate('/resumes');
        } catch (error) {
            // Handle error
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create Resume
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ mt: 3 }}>
                        Skills
                    </Typography>
                    {formData.skills.map((skill, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TextField
                                label={`Skill ${index + 1}`}
                                value={skill.name}
                                onChange={(e) => handleSkillChange(index, e)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <Button
                                type="button"
                                onClick={() => removeSkill(index)}
                                sx={{ ml: 1 }}
                                color="error"
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}
                    <Button type="button" onClick={addSkill} sx={{ mt: 1 }}>
                        Add Skill
                    </Button>

                    {/* Add similar sections for experience and education */}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResumeForm;