import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const FormFillingForm: React.FC = () => {
  const [description, setDescription] = useState(""); // NEW
  const [news, setNews] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: 'success'
  });
  const quillWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const appDiv = document.getElementById('root');
    if (appDiv) {
      appDiv.style.width = '100vw';
      appDiv.style.margin = '0';
      appDiv.style.padding = '0';
      // appDiv.style.display = 'flex';
      // appDiv.style.justifyContent = 'center';
      // appDiv.style.alignItems = 'center';
      // appDiv.style.minHeight = '100vh';
    }

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';

    const fixQuillStyles = () => {
      const quillContainers = document.querySelectorAll('.ql-container');
      const quillEditors = document.querySelectorAll('.ql-editor');

      quillContainers.forEach((container) => {
        (container as HTMLElement).style.width = '100%';
        (container as HTMLElement).style.margin = '0 auto';
      });

      quillEditors.forEach((editor) => {
        (editor as HTMLElement).style.width = '100%';
        (editor as HTMLElement).style.margin = '0 auto';
        (editor as HTMLElement).style.textAlign = 'left';
        (editor as HTMLElement).style.minHeight = '250px';
      });
    };

    fixQuillStyles();
    const timer = setTimeout(fixQuillStyles, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const showNotificationMessage = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showNotificationMessage("Please enter a title.", "error");
      return;
    }
    if (!image) {
      showNotificationMessage("Please upload an image.", "error");
      return;
    }
    if (!news.trim()) {
      showNotificationMessage("Please enter news content.", "error");
      return;
    }
    setShowConfirm(true);
  };

  const handleCancel = () => setShowConfirm(false);

  const handleSubmit = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image!);
    formData.append("news", JSON.stringify({
      descriptionParagraph: description,
      fullNews: news
    }));

    try {
      const res = await fetch("http://localhost:8080/api/news", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (res.ok) {
        showNotificationMessage("News posted successfully!", "success");
        setDescription("");
        setNews("");
        setImage(null);
        setPreview(null);
        setTimeout(() => window.location.reload(), 2000);
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
          <h2 className="news-form-title">Submit FormFilling</h2>

          <input
            type="text"
            placeholder="Enter a short description or title"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="news-title-input"
          />

          <div className="editor-container" ref={quillWrapperRef}>
            <ReactQuill
              theme="snow"
              value={news}
              onChange={setNews}
              className="news-editor"
            />
          </div>

          <div className="image-upload">
            <label htmlFor="file-upload" className="file-input-label">
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
                <img src={preview} alt="Preview" className="image-preview" />
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

      {notification.show && (
        <div className={`notification-popup ${notification.type}`}>
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            className="close-notification"
          >
            ×
          </button>
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}

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

export default FormFillingForm;
