import React, { useEffect, useState } from 'react';

const TokenTimer = ({ onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return 0;
    const elapsedTime = (Date.now() - parseInt(loginTime)) / 1000;
    return Math.max(0, 1800 - Math.floor(elapsedTime));
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      console.log("Token expired");
      onExpire();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          console.log("Token expired");
          onExpire();
          return 0;
        }
        console.log(`Time left: ${prevTime - 1} seconds`);
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onExpire]);

  return null; 
};

export default TokenTimer;
