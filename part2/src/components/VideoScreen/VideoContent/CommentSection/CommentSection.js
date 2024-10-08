import React, { useState, useEffect } from 'react';
import './CommentSection.css';
import Comment from './Comment/Comment';
import { useNavigate } from 'react-router-dom';

const CommentSection = ({ video, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  const fetchComments = async () => {
    if (!currentUser || !currentUser.email) {
      console.error('Current user is not available');
      return;
    }

    try {
      const response = await fetch(
        `/api/users/${currentUser.email}/videos/${video._id}/comments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      if (response.ok) {
        const fetchedComments = await response.json();
        setComments(fetchedComments || []);
      } else {
        console.error('Error fetching comments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.email) {
      fetchComments();
    }
  }, [video._id, currentUser]);
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate('/YouTube/login-email');
      return;
    }

    if (newComment.trim()) {
      const date = new Date().toISOString();
      const newCommentObj = {
        userName: currentUser.displayName,
        email: currentUser.email,
        profilePic: currentUser.photo,
        text: newComment,
        date,
        videoId: video._id,
      };

      try {
        const response = await fetch(
          `/api/users/${currentUser.email}/videos/${video._id}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newCommentObj),
          },
        );

        if (response.ok) {
          const savedComment = await response.json();
          setComments((prevComments) => [...prevComments, savedComment]);
          setNewComment('');
        } else {
          const errorText = await response.text();
          console.error('Error adding comment:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `/api/users/${currentUser.email}/videos/${video._id}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      } else {
        const errorText = await response.text();
        console.error('Error deleting comment:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = async (index, newContent) => {
    const commentToEdit = comments[index];
    try {
      const response = await fetch(
        `/api/users/${currentUser.email}/videos/${video._id}/comments/${commentToEdit._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ newText: newContent }),
        },
      );

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(comments.map((comment, i) => (i === index ? updatedComment : comment)));
        fetchComments(); // Re-fetch comments to ensure they are up-to-date
      } else {
        console.error('Error updating comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h2 className="comments-title">Comments</h2>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
          className="comment-input"
        />
        <button type="submit" className="comment-submit-button">
          Submit
        </button>
      </form>
      <div className="comment-list">
        {comments.map((comment, index) => (
          <Comment
            key={comment._id}
            userName={comment.userName}
            email={comment.email}
            profilePic={comment.profilePic}
            date={new Date(comment.date).toLocaleDateString()}
            content={comment.text}
            onDelete={() => handleDeleteComment(comment._id)}
            onEdit={(newContent) => handleEditComment(index, newContent)}
            currentUserEmail={currentUser.email}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
