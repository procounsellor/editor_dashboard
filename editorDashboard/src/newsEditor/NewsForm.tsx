import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './NewsForm.css';

const NewsForm: React.FC = () => {
  const [news, setNews] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({
    show: false,
    message: "",
    type: 'success'
  });
  const quillWrapperRef = useRef<HTMLDivElement>(null);

  // Apply direct styling to fix centering issues
  useEffect(() => {
    // Ensure the parent div takes up full width
    const appDiv = document.getElementById('root');
    if (appDiv) {
      appDiv.style.width = '100vw';
      appDiv.style.margin = '0';
      appDiv.style.padding = '0';
      appDiv.style.display = 'flex';
      appDiv.style.justifyContent = 'center';
      appDiv.style.alignItems = 'center';
      appDiv.style.minHeight = '100vh';
    }
    
    // Ensure body has no margin
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';
    
    // Add fixed styling to ReactQuill
    const fixQuillStyles = () => {
      // Find all Quill editors
      const quillContainers = document.querySelectorAll('.ql-container');
      const quillEditors = document.querySelectorAll('.ql-editor');
      
      // Apply direct styling
      quillContainers.forEach((container) => {
        (container as HTMLElement).style.width = '100%';
        (container as HTMLElement).style.margin = '0 auto';
      });
      
      quillEditors.forEach((editor) => {
        (editor as HTMLElement).style.width = '100%';
        (editor as HTMLElement).style.margin = '0 auto';
        (editor as HTMLElement).style.textAlign = 'left';
        (editor as HTMLElement).style.minHeight = '250px'; // Fixed height
      });
    };
    
    // Apply immediately and after a short delay to ensure ReactQuill is rendered
    fixQuillStyles();
    const timer = setTimeout(fixQuillStyles, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // Show notification with auto-dismissal
  const showNotificationMessage = (message: string, type: 'success' | 'error') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 5000);
  };
  
  // Initiate confirmation dialog
  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      showNotificationMessage("Please upload an image.", "error");
      return;
    }
    
    if (!news.trim()) {
      showNotificationMessage("Please enter news content.", "error");
      return;
    }
    
    // Show confirmation dialog
    setShowConfirm(true);
  };
  
  // Cancel submission
  const handleCancel = () => {
    setShowConfirm(false);
  };
  
  // Actual submission after confirmation
  const handleSubmit = async () => {
    setShowConfirm(false);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", image!);
    formData.append("news", JSON.stringify({ descriptionParagraph: "Auto Title", fullNews: news }));

    try {
      const res = await fetch("http://localhost:8080/api/news", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (res.ok) {
        showNotificationMessage("News posted successfully!", "success");
        setNews("");
        setImage(null);
        setPreview(null);
      } else {
        showNotificationMessage(`Server error: ${text}`, "error");
      }
    } catch (err) {
      console.error("Error submitting form", err);
      showNotificationMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="centered-container">
      <div className="news-form-wrapper">
        <form onSubmit={handleInitiateSubmit} className="news-form">
          <h2 className="news-form-title">Submit News</h2>
          
          {/* Editor container with ref for better control */}
          <div className="editor-container" ref={quillWrapperRef}>
            <ReactQuill
              theme="snow"
              value={news}
              onChange={setNews}
              className="news-editor"
            />
          </div>
          
          {/* Clear separation between editor and image upload */}
          <div className="image-upload">
            <label
              htmlFor="file-upload"
              className="file-input-label"
            >
              {preview ? "Change Image" : "Pick Image"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {preview && (
              <div className="preview-container">
                <img
                  src={preview}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit News"}
          </button>
        </form>
      </div>
      
      {/* Notification popup */}
      {notification.show && (
        <div className={`notification-popup ${notification.type}`}>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(prev => ({...prev, show: false}))}
            className="close-notification"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
      
      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>Confirm Submission</h3>
            <p>Are you sure you want to submit this news article?</p>
            <div className="confirmation-buttons">
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
              <button onClick={handleSubmit} className="confirm-button">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsForm;