import React, { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import "./FooterStyle.css";

const Footer = () => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('src\\footer\\easterEgg\\cat.mp3');

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .catch(error => console.error("Audio playback failed:", error));
    }
  };

  const handleClick = () => {
    setShowEasterEgg(true);
    playSound();
  };

  const handleClose = () => {
    setShowEasterEgg(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="contact-info">
          <h3>Daniel Goldberg</h3>
          <p>Email: danielgoldberg972000@gmail.com</p>
          <p>Phone: 0546306960</p>
        </div>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/daniel-goldberg-930296285/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://github.com/cinemapizzas" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </div>
      </div>

      <div className="easter-egg-button-container">
        <button className="easter-egg-button" onClick={handleClick}></button>
      </div>

      {showEasterEgg && (
        <div className="easter-egg">
          <button className="close-button" onClick={handleClose}>X</button>
          <img src="src\footer\easterEgg\giphy.gif" alt="Easter Egg" className="bobbing-image" />
        </div>
      )}
    </footer>
  );
};

export default Footer
