import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResumes } from '../../api/resume';
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
    const { resumes, isLoading } = useSelector((state) => state.resume);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                if (token) {
                    const data = await getResumes(token);
                    dispatch({ type: 'resume/getResumes/fulfilled', payload: data });
                }
            } catch (error) {
                dispatch({ type: 'resume/getResumes/rejected', payload: error.message });
            }
        };

        fetchResumes();
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
                                    {resume.skills?.map(skill => skill.name).join(', ')}
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