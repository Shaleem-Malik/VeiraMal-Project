/**
 * Auth User Reducers
 */
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE,
    // reset types
    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,

    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE
} from 'Store/Actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    user: localStorage.getItem('user_id'),
    loading: false
};

let authUser = (state = INIT_STATE, action) => {
    switch (action.type) {

        case LOGIN_USER:
            return { ...state, loading: true };

        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload };

        case LOGIN_USER_FAILURE:
            return { ...state, loading: false };

        case LOGOUT_USER:
            return { ...state, user: null };

        case SIGNUP_USER:
            return { ...state, loading: true };

        case SIGNUP_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload };

        case SIGNUP_USER_FAILURE:
            return { ...state, loading: false };

        // Reset password flow
        case RESET_PASSWORD:
            return { ...state, loading: true };

        case RESET_PASSWORD_SUCCESS:
            // after successful reset, we removed token and redirected to signin.
            return { ...state, loading: false };

        case RESET_PASSWORD_FAILURE:
            return { ...state, loading: false };
        
        case FORGOT_PASSWORD:
            return { ...state, loading: true };
        
        case FORGOT_PASSWORD_SUCCESS:
            return { ...state, loading: true };

        case FORGOT_PASSWORD_FAILURE:
            return { ...state, loading: true };

        default: return { ...state };
    }
}

export default authUser;
