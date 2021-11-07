import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

export default function(state = initialState, action){
    const { type, payload} = action;
    switch(action.type){
        case SET_ALERT:
            return[...state, payload]; //copy alert if in and add new one 
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload); //filter through and remove all alerts except whatever matches mayload
        default:
            return state;
    }
}
//action has type and payload which is the data and that is not always necesary