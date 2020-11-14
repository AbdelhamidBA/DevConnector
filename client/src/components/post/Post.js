import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {getPost} from '../../actions/post'
import Moment from 'react-moment'
import Spinner from '../layout/Spinner'
import { Link } from 'react-router-dom'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
const Post = ({post:{post,loading},getPost,match}) => {
    useEffect(()=>{
        getPost(match.params.id)
    },[getPost,match])
    return (
        !post || loading ? <Spinner/>:
        <Fragment>
            <Link to="/posts" className="btn">Back To Posts</Link>
            <div className="post bg-white p-1 my-1">
                <div>
                <Link to={`/profile/${post.user}`}>
                    <img
                    className="round-img"
                    src={post.avatar}
                    alt=""
                    />
                    <h4>{post.name}</h4>
                </Link>
                </div>
                <div>
                <p className="my-1">
                    {post.text}
                </p>
                <p className="post-date">
                Posted on <Moment format="YYYY/MM/DD">{post.date}</Moment>
                </p>
                </div>
            </div>
            <CommentForm postID={post._id}/>
            <div class="comments">
                {post.comments.map(comment => <CommentItem key={comment._id} comment={comment} postId={post._id} />)}
            </div>
        </Fragment>
    )
}

Post.propTypes = {
    post:PropTypes.object.isRequired,
    getPost:PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    post:state.post
})
export default connect(mapStateToProps,{getPost})(Post)
