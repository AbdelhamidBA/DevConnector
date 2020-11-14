import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { LogoutUser } from '../../actions/auth'
const Navbar = ({ auth:{ isAuthenticated , loading },LogoutUser}) => {

    const authLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/dashboard"><i className="fas fa-user" />{' '} Dashboard</Link></li>
            <li><a onClick={LogoutUser} href="#!">
                <i className="fas fa-sign-out-alt"/> 
                <span className="hide-sm">Logout</span></a></li>
        </ul>
    );

    const guessLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );
    return (
        <nav className="navbar bg-dark">
        <h1>
            <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
        </h1>
    { !loading && (<Fragment>{isAuthenticated ? authLinks : guessLinks}</Fragment>)}
        </nav>
    )
}
Navbar.propTypes = {
    LogoutUser: PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps,{LogoutUser})(Navbar);
