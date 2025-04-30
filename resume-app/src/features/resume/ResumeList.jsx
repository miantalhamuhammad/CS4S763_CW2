import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResumes } from './resumeSlice.js'; // Import your thunk
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const ResumeList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { resumes, isLoading } = useSelector((state) => state.resume);
    const { resumes: resumesData, isLoading } = useSelector((state) => state.resume);
    const resumes = resumesData?.resumes || [];

    const { token } = useSelector((state) => state.auth); // Get token from Redux store

    useEffect(() => {
        if (token) {
            const res =  getResumes();
            console.log("ajkjjk",res);
            dispatch(res); // Dispatch the getResumes async thunk
        }
    }, [dispatch, token]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Resumes
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/resumes/new')}
                sx={{ mb: 2 }}
            >
                Add Resume
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Skills</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resumes.map((resume) => (
                            <TableRow key={resume._id}>
                                <TableCell>{resume.fullName}</TableCell>
                                <TableCell>{resume.phone}</TableCell>
                                <TableCell>
                                    {resume.skills?.join(', ')} {/* Skills as a comma-separated string */}
                                </TableCell>
                                <TableCell>
                                    {/* Display Education */}
                                    {resume.education?.length > 0 ? (
                                        <div>
                                            {resume.education.map((edu) => (
                                                <Typography key={edu._id}>
                                                    {edu.degree} - {edu.year} {/* Example display */}
                                                </Typography>
                                            ))}
                                        </div>
                                    ) : (
                                        <Typography>No Education Info</Typography>
                                    )}

                                    {/* Display Experience */}
                                    {resume.experience?.length > 0 ? (
                                        <div>
                                            {resume.experience.map((exp) => (
                                                <Typography key={exp._id}>
                                                    {exp.company} ({exp.startDate} - {exp.endDate})
                                                </Typography>
                                            ))}
                                        </div>
                                    ) : (
                                        <Typography>No Experience Info</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ mr: 1 }}
                                        onClick={() => navigate(`/resumes/${resume._id}`)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box>
    );
};

export default ResumeList;
