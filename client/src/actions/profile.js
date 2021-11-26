import axios from 'axios';

import { setAlert } from './alert';

import {
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    DELETE_ACCOUNT
} from './types'

//get current users profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

//Create or Update
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        //since sending data
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        //redirecting in action means we cannot use rediriect like we do for componenets
        if (!edit) {
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

//Add Experience
export const addExperience = (formData, history /* to link back to dashboard*/) => async dispatch => {
    try {
        //since sending data
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added', 'success'));

        //redirecting in action means we cannot use rediriect like we do for componenets
        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

//Add Education
export const addEducation = (formData, history /* to link back to dashboard*/) => async dispatch => {
    try {
        //since sending data
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Edcuation Added', 'success'));

        //redirecting in action means we cannot use rediriect like we do for componenets
        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

//Delete Experience - use route for profil
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete('/api/profile/experience/${id}');

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });


        dispatch(setAlert('Experience Removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

//Delete Education - use route for profile
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete('/api/profile/education/${id}');

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });


        dispatch(setAlert('Education Removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

//Delete account and profile

export const deleteAccount = id => async dispatch => {
    if (window.confirm('Are you sure? This cannot be undone')) {
        try {
            const res = await axios.delete('/api/profile');

            dispatch({
                type: DELETE_ACCOUNT
            });
            dispatch({
                type: ACCOUNT_DELETED
            })


            dispatch(setAlert('Your account has been permanently deleted'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }
}