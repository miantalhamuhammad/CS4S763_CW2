import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResumes, deleteResume } from './resumeSlice';
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
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Container,
    useTheme,
    useMediaQuery,
    Chip,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ResumeList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);

    const { resumes, isLoading, isError, message } = useSelector((state) => state.resume);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(getResumes());
        }
    }, [dispatch, token]);

    const handleDeleteClick = (resume) => {
        setSelectedResume(resume);
        setDeleteDialogOpen(true);
        setDeleteError(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedResume(null);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedResume) return;

        setDeleteLoading(true);
        setDeleteError(null);

        try {
            await dispatch(deleteResume(selectedResume._id)).unwrap();
            // Refresh the list after successful deletion
            dispatch(getResumes());
            setDeleteDialogOpen(false);
            setSelectedResume(null);
        } catch (error) {
            console.error('Delete failed:', error);
            setDeleteError(error.message || 'Failed to delete resume');
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredResumes = resumes?.filter(resume =>
        resume.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {message || 'An error occurred while fetching resumes.'}
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => dispatch(getResumes())}
                >
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} xl={{ py: 4, height: '100vh', width: '100%' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 0
            }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                    My Resumes
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto' }}>
                    <TextField
                        size="small"
                        placeholder="Search resumes..."
                        InputProps={{
                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                        }}
                        sx={{
                            width: isMobile ? '100%' : 300,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper
                            }
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/resumes/new')}
                        size={isMobile ? 'medium' : 'large'}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            whiteSpace: 'nowrap',
                            boxShadow: theme.shadows[2],
                            '&:hover': {
                                boxShadow: theme.shadows[4]
                            }
                        }}
                    >
                        Create New Resume
                    </Button>
                </Box>
            </Box>

            <Paper elevation={3} sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: theme.shadows[3],
                height: 'calc(100vh - 200px)' // Adjusting for full height excluding header
            }}>
                <TableContainer sx={{ height: '100%' }}>
                    <Table stickyHeader aria-label="resumes table" size={isMobile ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>
                                    Name
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>
                                    Email
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>
                                    Phone
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>
                                    Skills
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: 'background.default' }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredResumes.length > 0 ? (
                                filteredResumes.map((resume) => (
                                    <TableRow
                                        key={resume._id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {resume.fullName}
                                        </TableCell>
                                        <TableCell>
                                            {resume.email || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {resume.phone || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {resume.skills?.length > 0 ? (
                                                    resume.skills.map((skill, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={skill}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: theme.palette.primary.light,
                                                                    color: theme.palette.primary.contrastText
                                                                }
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary">
                                                        No skills
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                <Tooltip title="View">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => navigate(`/resumes/${resume._id}`)}
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.primary.light
                                                            }
                                                        }}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => {
                                                            navigate(`/resumes/${resume._id}/edit`, {
                                                                state: {
                                                                    from: 'resumeList',
                                                                    isLoading: true
                                                                }
                                                            });
                                                        }}                                                     sx={{
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.secondary.light
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                     <IconButton
                                                         color="error"
                                                         onClick={() => handleDeleteClick(resume)}
                                                         sx={{
                                                             '&:hover': { backgroundColor: theme.palette.error.light }
                                                         }}
                                                     >
                                                         <DeleteIcon />
                                                     </IconButton>
                                                 </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            <Typography variant="h6" color="textSecondary">
                                                {searchTerm ? 'No matching resumes found' : 'No resumes found'}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={() => navigate('/resumes/new')}
                                            >
                                                Create Your First Resume
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
                         {/* Delete Confirmation Dialog */}
                         <Dialog
                             open={deleteDialogOpen}
                             onClose={handleDeleteCancel}
                             aria-labelledby="delete-dialog-title"
                         >
                             <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
                             <DialogContent>
                                 <Typography>
                                     Are you sure you want to delete the resume for {selectedResume?.fullName}?
                                 </Typography>
                                 {deleteError && (
                                     <Alert severity="error" sx={{ mt: 2 }}>
                                         {deleteError}
                                     </Alert>
                                 )}
                             </DialogContent>
                             <DialogActions>
                                 <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
                                     Cancel
                                 </Button>
                                 <Button
                                     onClick={handleDeleteConfirm}
                                     color="error"
                                     disabled={deleteLoading}
                                     startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
                                 >
                                     {deleteLoading ? 'Deleting...' : 'Delete'}
                                 </Button>
                             </DialogActions>
                         </Dialog>
        </Container>
    );
};

export default ResumeList;