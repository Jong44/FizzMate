import React, { useState } from "react";
import { motion } from "framer-motion";

const dialogVariants = {
  open: { opacity: 1, scale: 1 },
  closed: { opacity: 0, scale: 0 },
};

const EmotionDialog = ({ 
    isOpen, 
    onClose,
    selectedEmotionCallback,

 }) => {
    const emotions = [
        "Senang",
        "Sedih",
        "Marah",
        "Takut",
        "Terkejut",
        "Cemas",
        "Gembira",
        "Tidak Nyaman",
    ]
    const [selectedEmotion, setSelectedEmotion] = useState([]);
    const handleSelectEmotion = (emotion) => {
        if (selectedEmotion.includes(emotion)) {
            setSelectedEmotion(selectedEmotion.filter((e) => e !== emotion));
        } else {
            setSelectedEmotion([...selectedEmotion, emotion]);
        }
    };

    const handleSaveEmotion = () => {
        selectedEmotionCallback(selectedEmotion);
        onClose();
    }
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
        isOpen ? "block" : "hidden"
      } flex justify-center items-center`} onClick={onClose} 
    >
      <motion.div
        className="dialog"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={dialogVariants}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
            <h1
             className="text-2xl font-bold"
            >Gimana Perasaanmu Hari Ini?</h1>
            {emotions.map((emotion, index) => (
            <button
              key={index}
              className={`bg-gray-200 p-2 m-2 rounded-lg ${
                selectedEmotion.includes(emotion) ? "bg-blue-500" : ""
              }`}
              onClick={() => handleSelectEmotion(emotion)}
            >
                {emotion}
            </button>
            ))}
            <div>
                <button
                    className="bg-blue-500 text-white p-2 m-2 rounded-lg"
                    onClick={handleSaveEmotion}
                >
                    Save
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmotionDialog;
