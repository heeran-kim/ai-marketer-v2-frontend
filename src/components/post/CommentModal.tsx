import { useState } from "react";


type Comment = {
  username: string;
  text: string;
  date:string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
}

const CommentModal: React.FC<ModalProps> = ({ isOpen, onClose, comments }) => {
  if (!isOpen) return null;
  
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '80vh', // Set a max height so it scrolls if content is too long
    overflowY: 'auto',  // Scroll vertically if needed
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  };

  const commentStyle: React.CSSProperties = {
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          &times;
        </button>
        <h2>Comments</h2>
        <ul>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <li key={index} style={commentStyle}>
                  <strong>{comment.username}</strong> <span style={{ color: "#777", fontSize: "0.85em" }}>{comment.date}</span><br />
                  <span style={{ fontSize: "0.9em", color: "#444" }}>{comment.text}</span>
              </li>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommentModal;
