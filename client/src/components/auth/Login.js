import React, {Fragment , useState } from 'react'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { LoginUser } from '../../actions/auth'
const Login = ({LoginUser,isAuthenticated}) => {
    const [formData,setFormData] = useState({
        email:'',
        password:''
    });

    const {email,password} = formData

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const onSubmit = async e => {
        e.preventDefault();
       LoginUser(email,password);
    }

    //Redirect if Logged in

    if(isAuthenticated)
    {
        return <Redirect to="/dashboard" />
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
               
                <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required/>
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    value={password} onChange={e => onChange(e)}
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                You are new?, <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}

Login.propTypes = {
    LoginUser:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool,
};

const mapStateToProps = state => ({
    isAuthenticated:state.auth.isAuthenticated
});

export default connect(mapStateToProps,{LoginUser})(Login);
