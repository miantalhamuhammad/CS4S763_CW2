import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getResumes as apiGetResumes,
    getResumeById as apiGetResumeById,
    createResume as apiCreateResume,
    updateResume as apiUpdateResume,
    deleteResume as apiDeleteResume
} from '../../api/resume';

const initialState = {
    resumes: [],
    currentResume: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Async thunks
export const getResumes = createAsyncThunk(
    'resume/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await apiGetResumes(token);
            return response;
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createResume = createAsyncThunk(
    'resume/create',
    async (resumeData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            return await apiCreateResume(resumeData, token);
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getResumeById = createAsyncThunk(
    'resume/getById',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            return await apiGetResumeById(id, token);
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateResume = createAsyncThunk(
    'resume/update',
    async ({ id, resumeData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            return await apiUpdateResume(id, resumeData, token);
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteResume = createAsyncThunk(
    'resume/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            await apiDeleteResume(id, token);
            return id;
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearCurrentResume: (state) => {
            state.currentResume = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Resumes
            .addCase(getResumes.pending, (state) => {
                state.isLoading = true;
            })
            // .addCase(getResumes.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     state.isSuccess = true;
            //     state.resumes = action.payload;
            // })
            // In your extraReducers
            .addCase(getResumes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Make sure you're setting the resumes array properly
                state.resumes = action.payload.resumes || action.payload || [];
            })
            .addCase(getResumes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.resumes = [];
            })

            // Create Resume
            .addCase(createResume.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createResume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.resumes.push(action.payload);
            })
            .addCase(createResume.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Get Resume By ID
            .addCase(getResumeById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getResumeById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentResume = action.payload;
            })
            .addCase(getResumeById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Update Resume
            .addCase(updateResume.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateResume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.resumes = state.resumes.map(resume =>
                    resume._id === action.payload._id ? action.payload : resume
                );
                state.currentResume = action.payload;
            })
            .addCase(updateResume.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Delete Resume
            .addCase(deleteResume.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteResume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.resumes = state.resumes.filter(resume => resume._id !== action.payload);
            })
            .addCase(deleteResume.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });

    },
});

export const { reset, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;