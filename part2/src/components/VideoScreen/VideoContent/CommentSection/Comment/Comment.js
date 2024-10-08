import React, { useState, useEffect } from 'react';
import './Comment.css';
import DeleteIcon from '../../../../../assets/icons/DeleteIcon';
import EditIcon from '../../../../../assets/icons/EditIcon';
import SaveIcon from '../../../../../assets/icons/CheckIcon';
import ProfilePicture from '../../../../ProfilePicture/ProfilePicture';

const Comment = ({ userName, email, profilePic, date, content, onDelete, onEdit, currentUserEmail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    console.log('userEmail:', email);
    console.log('currentUserEmail:', currentUserEmail);
    console.log('Email match:', email === currentUserEmail);
  }, [email, currentUserEmail]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(editContent);
    setIsEditing(false);
  };

  return (
    <div className="comment-item">
      <ProfilePicture user={{ displayName: userName, photo: profilePic, email: email }} className="comment-pic" />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-name">{userName}</span>
          <span className="comment-date">{date}</span>
        </div>
        {isEditing ? (
          <input
            type="text"
            className="comment-edit-input"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        ) : (
          <div className="comment-text">{content}</div>
        )}
        {email === currentUserEmail && (
          <div className="comment-actions-container">
            <button className="comment-action" onClick={onDelete}>
              <DeleteIcon />
            </button>
            {isEditing ? (
              <button className="comment-action" onClick={handleSave}>
                <SaveIcon />
              </button>
            ) : (
              <button className="comment-action" onClick={handleEdit}>
                <EditIcon />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
