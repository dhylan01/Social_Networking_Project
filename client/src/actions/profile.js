import axios from 'axios';

import { setAlert } from './alert';

import {
    GET_PROFILE,
    PROFILE_ERROR
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
                'Content-Type': 'aplication/json'
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
    }
}