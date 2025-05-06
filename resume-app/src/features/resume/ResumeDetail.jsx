import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResumeById } from './resumeSlice';
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

    // Access state from Redux store
    const { currentResume, isLoading, isError, message } = useSelector((state) => state.resume);

    useEffect(() => {
        dispatch(getResumeById(id));
    }, [dispatch, id]);

    // Show loading indicator
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography>Loading resume...</Typography>
            </Box>
        );
    }

    // Show error message if there's any error
    if (isError) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography color="error">
                    {message || 'An error occurred while fetching the resume.'}
                </Typography>
            </Box>
        );
    }

    // Show message if the resume is not found
    if (!currentResume) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography>Resume not found</Typography>
            </Box>
        );
    }

    // Extract the resume data (in case it's nested under 'resume' property)
    const resumeData = currentResume.resume || currentResume;

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {resumeData.fullName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Contact: {resumeData.phone || 'Not specified'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                    {resumeData.skills?.length > 0 ? (
                        resumeData.skills.map((skill, index) => (
                            <Chip key={index} label={skill} variant="outlined" />
                        ))
                    ) : (
                        <Typography variant="body2">No skills listed</Typography>
                    )}
                </Box>

                <Typography variant="h6">Experience</Typography>
                {resumeData.experience?.length > 0 ? (
                    <List>
                        {resumeData.experience.map((exp, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${exp.position || 'Position not specified'} at ${exp.company || 'Company not specified'}`}
                                    secondary={`${exp.startDate || 'Start date not specified'} - ${exp.endDate || 'Present'}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" sx={{ my: 2 }}>No experience listed</Typography>
                )}

                <Typography variant="h6">Education</Typography>
                {resumeData.education?.length > 0 ? (
                    <List>
                        {resumeData.education.map((edu, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={edu.degree || 'Degree not specified'}
                                    secondary={`${edu.institution || 'Institution not specified'} (${edu.year || 'Year not specified'})`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" sx={{ my: 2 }}>No education listed</Typography>
                )}

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