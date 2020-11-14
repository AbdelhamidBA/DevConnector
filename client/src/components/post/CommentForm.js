import React,{useState} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addComment } from '../../actions/post'
const CommentForm = ({addComment,postID}) => {
    const [formData,setFormData] = useState({
        text:''
    })

    const {text}=formData

    const onChange = (e)=> setFormData({...formData,[e.target.name]:e.target.value})
    const onSubmit = (e) => {
        e.preventDefault()
        addComment(postID,formData)
    }

    return (
        <div className="post-form">
            <div className="bg-primary p">
            <h3>Leave A Comment</h3>
            </div>
            <form className="form my-1" onSubmit={e => onSubmit(e)}>
            <textarea
                name="text"
                cols="30"
                rows="5"
                placeholder="Comment on this post"
                value={text}
                onChange={e=>onChange(e)}
                required
            ></textarea>
            <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
      </div>
    )
}

CommentForm.propTypes = {
    addComment:PropTypes.func.isRequired,
}

export default connect(null,{addComment})(CommentForm)
