// Enhanced Cover Letter Field Component
import React, { useState } from "react";
import { FaExpand, FaCompress, FaFileAlt } from "react-icons/fa";

const CoverLetterField = ({ value, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        onChange(e);
        const words = newValue.trim() ? newValue.trim().split(/\s+/) : [];
        setWordCount(words.length);
    };

    return (
        <div className={`cover-letter-container ${isExpanded ? 'expanded' : ''}`}>
            <div className="cover-letter-header">
                <label><FaFileAlt /> Cover Letter</label>
                <div className="cover-letter-controls">
                    <span className="word-count">{wordCount} words</span>
                    <button 
                        type="button" 
                        className="expand-button" 
                        onClick={toggleExpand}
                        aria-label={isExpanded ? "Compress editor" : "Expand editor"}
                        title={isExpanded ? "Click to compress the editor" : "Click to expand and write in full view"}
                    >
                        {isExpanded ? <FaCompress /> : <FaExpand />}
                        <span className="expand-text">
                            {isExpanded ? " Compress View" : " Expand to Full View"}
                        </span>
                    </button>
                </div>
            </div>

            <textarea 
                name="coverLetter" 
                value={value} 
                onChange={handleChange}
                placeholder="Tell us why you're the perfect fit for this role. Highlight your relevant experience, skills, and what makes you excited about this position..."
                rows={isExpanded ? 20 : 12}
                className="cover-letter-textarea"
                required
            ></textarea>

            <div className="writing-tips">
                <p><strong>Pro Tips:</strong> Keep your cover letter concise (250–400 words). Highlight relevant achievements and explain why you're interested in this specific role.</p>
            </div>
        </div>
    );
};

export default CoverLetterField;
