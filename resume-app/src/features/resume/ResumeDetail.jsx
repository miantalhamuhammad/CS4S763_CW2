// src/features/resume/ResumeDetail.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResumeById } from '../../api/resume';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Button
} from '@mui/material';

const ResumeDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentResume, isLoading } = useSelector((state) => state.resume);

    useEffect(() => {
        dispatch(getResumeById(id));
    }, [dispatch, id]);

    if (isLoading) {
        return <Typography>Loading resume...</Typography>;
    }

    if (!currentResume) {
        return <Typography>Resume not found</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {currentResume.fullName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Contact: {currentResume.phone}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                    {currentResume.skills?.map((skill, index) => (
                        <Chip key={index} label={skill.name} variant="outlined" />
                    ))}
                </Box>

                <Typography variant="h6">Experience</Typography>
                <List>
                    {currentResume.experience?.map((exp, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`${exp.position} at ${exp.company}`}
                                secondary={`${exp.startDate} - ${exp.endDate || 'Present'}`}
                            />
                        </ListItem>
                    ))}
                </List>

                <Typography variant="h6">Education</Typography>
                <List>
                    {currentResume.education?.map((edu, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={edu.degree}
                                secondary={`${edu.institution} (${edu.year})`}
                            />
                        </ListItem>
                    ))}
                </List>

                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => window.history.back()}
                >
                    Back to List
                </Button>
            </Paper>
        </Box>
    );
};

export default ResumeDetail;