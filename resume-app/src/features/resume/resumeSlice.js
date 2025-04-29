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

// Async thunks for resume operations
export const getResumes = createAsyncThunk(
    'resume/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await apiGetResumes(token);
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
            const token = thunkAPI.getState().auth.user.token;
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
            const token = thunkAPI.getState().auth.user.token;
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

// Add similar thunks for update and delete

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
            .addCase(getResumes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getResumes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.resumes = action.payload;
            })
            .addCase(getResumes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
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
            });
        // Add similar cases for update and delete
    },
});

export const { reset, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;