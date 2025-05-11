import { useState, ChangeEvent } from "react";


type Comment = {
  id: string;
  username: string;
  text: string;
  date:string;
  replies: string[];
  likes: number;
  self_like: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  isLoaded: boolean;
  likeComment: (id:string) => void;
  deleteComment: (id:string) => void;
  sendReply: (id:string,message:string) => void;
}

const CommentModal: React.FC<ModalProps> = ({ isOpen, onClose, comments, isLoaded, likeComment, deleteComment, sendReply }) => {
  const [formData, setFormData] = useState({text: ""});

  const [visible, setVisible] = useState<boolean[]>();

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

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (id:string, message:string) => {
    sendReply(id,message);
    setVisible([]);
  };

  const setReplyVisible = (index:number) => {
    const localVisibility=[]
    for (let i=0;i<comments.length;i++)
    {
      localVisibility.push(false);
    }
    localVisibility[index]=true;
    setVisible(localVisibility);
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          &times;
        </button>
        <h2>Comments</h2>
        {isLoaded?
        <ul>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <li key={index} style={commentStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{comment.username}</strong>
                      <span style={{ color: "#777", fontSize: "0.85em", marginLeft: "8px" }}>{comment.date}</span>
                    </div>
                    {comment.username!="User"&&
                    <button
                      style={{ color: "#aaa", background: "none", border: "none", cursor: "pointer" }}
                      onClick={() => deleteComment(comment.id)}
                    >
                      🗑️
                    </button>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9em", color: "#444" }}>
                  <span>{comment.text}</span>
                  <button style={{ marginLeft: "8px", color: comment.self_like ? "red" : "#aaa" }} onClick={()=>likeComment(comment.id)}>
                    {comment.self_like ? "❤️" : comment.likes!=null ? "🤍" : ""} {comment.likes}
                  </button>
                  </div>
                  {
                    comment.username!="User"&&visible&&visible[index]?
                    <form onSubmit={()=>handleSubmit(comment.id,formData.text)}>
                        <input
                            type="text"
                            name="text"
                            placeholder="Reply"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors`}
                            required={true}
                            value={formData.text}
                            onChange={handleChange}
                        />
                        <button style={{color:'blue'}} type="submit">Reply</button>
                    </form>
                    :comment.username!="User"&&
                    <button style={{color:'blue'}} onClick={()=>setReplyVisible(index)}>Reply</button>
                  }
                  {comment.replies.map((reply,index)=>(
                    <li key={index} style={{paddingLeft: '20px'}}>
                    <strong>{comment.username=='User'?'Someone Replied:':'You Replied:'}</strong> <span style={{ color: "#777", fontSize: "0.85em" }}></span><br />
                    <span style={{ fontSize: "0.9em", color: "#444" }}>{reply}</span>
                    </li>
                  ))}
              </li>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
      :
      <p>Loading...</p>
      }
      </div>
    </div>
  );
};

export default CommentModal;
