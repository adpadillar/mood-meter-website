import React, { useEffect, useState, useRef } from "react";

interface TimerProps {
  seconds: number;
  on: boolean;
  onComplete?: (reset: () => void) => void;
}

const Timer: React.FC<TimerProps> = ({ seconds, on, onComplete }) => {
  const [time, setTime] = useState<number>(seconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (on && time > 0) {
      // Start the timer when 'on' is true and time is greater than 0
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!on && timerRef.current) {
      // Stop the timer when 'on' becomes false
      clearInterval(timerRef.current);
    }

    return () => {
      // Clear the timer when the component unmounts or 'on' changes
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [on, time]);

  useEffect(() => {
    // Handle timer completion
    const resetTimer = () => {
      setTime(seconds);
    };

    if (time === 0 && on) {
      if (onComplete) {
        onComplete(resetTimer);
      }
    }
  }, [time, on, onComplete, seconds]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div>
      <p className="font-boldr text-3xl">{formatTime(time)}</p>
    </div>
  );
};

export default Timer;
