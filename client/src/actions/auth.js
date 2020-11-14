import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import { setAlert} from './alert'
import { REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERROR,LOGIN_FAIL,LOGIN_SUCCESS,LOGOUT,CLEAR_PROFILE } from './types'



// Load User
export const LoadUser = () => async dispatch =>{
    if(localStorage.token)
    {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}


//Register
export const RegisterUser = ({name,email,password}) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({name,email,password});

    try {
        const res = await axios.post('/api/users',body,config);
        dispatch({
            type:REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(LoadUser());
    } catch (err) {
        const errors = err.response.data.errors
        console.log(err)
        if(errors)
        {
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:REGISTER_FAIL
        });
    }
}


//Login
export const LoginUser = (email,password) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({email,password});

    try {
        const res = await axios.post('/api/auth',body,config);
        dispatch({
            type:LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(LoadUser());
    } catch (err) {
        const errors = err.response.data.errors
        console.log(err)
        if(errors)
        {
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:LOGIN_FAIL
        });
    }
}

//Logout
export const LogoutUser = () => async dispatch => {
    dispatch({
        type:CLEAR_PROFILE
    })
    dispatch({
        type:LOGOUT
    })
}