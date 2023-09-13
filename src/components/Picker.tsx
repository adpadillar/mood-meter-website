import React, { useState, useEffect, useRef } from "react";

interface MoodpickerProps {
  onChange: ({
    x,
    y,
    initialX,
    initialY,
  }: {
    x: number;
    y: number;
    initialX: number;
    initialY: number;
  }) => void;
  height?: number;
  width?: number;
  pickerSize?: number;
}

const Moodpicker: React.FC<MoodpickerProps> = ({
  onChange,
  height = 300,
  width = 300,
  pickerSize = 10,
}) => {
  const [xInitial, yInitial] = [
    (width - pickerSize) / 2 + 1,
    (height - pickerSize) / 2 + 1,
  ];
  const [isDragging, setIsDragging] = useState(false);
  const [x, setX] = useState(xInitial);
  const [y, setY] = useState(yInitial);
  const pickerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange({ x, y, initialX: xInitial, initialY: yInitial });
  }, [x, y, onChange, xInitial, yInitial]);

  const handleMove = (clientX: number, clientY: number) => {
    if (pickerRef.current && dotRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      if (offsetX < 0 || offsetX > rect.width - dotRef.current.clientWidth) {
        // Handle out of bounds in x direction
        if (offsetX < 0) {
          setX(0);
        } else {
          setX(rect.width - dotRef.current.clientWidth);
        }
      } else {
        setX(offsetX);
      }

      if (offsetY < 0 || offsetY > rect.height - dotRef.current.clientHeight) {
        // Handle out of bounds in y direction
        if (offsetY < 0) {
          setY(0);
        } else {
          setY(rect.height - dotRef.current.clientHeight);
        }
      } else {
        setY(offsetY);
      }
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        handleMove(event.clientX, event.clientY);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault(); // Prevent scrolling
      const touch = event.touches[0];
      handleMove(touch?.clientX ?? 0, touch?.clientY ?? 0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="mood-picker"
      ref={pickerRef}
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#f0f0f0",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none", // Prevents default touch behavior (like scrolling)
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        handleMove(e.clientX, e.clientY);
      }}
    >
      {/* Horizontal Axis */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          top: "50%",
          borderTop: "1px solid #000",
        }}
      ></div>
      {/* Vertical Axis */}
      <div
        style={{
          position: "absolute",
          height: "100%",
          left: "50%",
          borderLeft: "1px solid #000",
        }}
      ></div>
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${pickerSize}px`,
          height: `${pickerSize}px`,
          backgroundColor: "red",
          borderRadius: "50%",
          cursor: "move",
        }}
      ></div>
    </div>
  );
};

export default Moodpicker;
