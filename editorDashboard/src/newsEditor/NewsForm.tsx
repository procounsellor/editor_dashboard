import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './NewsForm.css'; // Make sure to import the CSS file

const NewsForm: React.FC = () => {
  const [news, setNews] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("news", JSON.stringify({ descriptionParagraph: "Auto Title", fullNews: news }));

    try {
      const res = await fetch("http://localhost:8080/api/news", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (res.ok) {
        alert("News posted successfully!");
        setNews("");
        setImage(null);
        setPreview(null);
      } else {
        alert("Server error: " + text);
      }
    } catch (err) {
      console.error("Error submitting form", err);
      alert("Network error");
    }
  };

  return (
    <div className="news-form-container">
      <h2 className="news-form-title">Submit News</h2>
      <form onSubmit={handleSubmit} className="news-form">
        <ReactQuill
          theme="snow"
          value={news}
          onChange={setNews}
          className="news-editor"
          placeholder="Write the news here..."
        />
        <div className="image-upload">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="image-preview" />}
        </div>
        <button type="submit" className="submit-button">
          Submit News
        </button>
      </form>
    </div>
  );
};

export default NewsForm;
