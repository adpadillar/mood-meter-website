import React, { useState, useEffect, useRef } from "react";

interface PickerProps {
  onChange: (x: number, y: number) => void;
  height?: number;
  width?: number;
  pickerSize?: number;
}

const Picker: React.FC<PickerProps> = ({
  onChange,
  height = 300,
  width = 300,
  pickerSize = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState<number>((width - pickerSize) / 2 + 1);
  const [y, setY] = useState<number>((height - pickerSize) / 2 + 1);

  useEffect(() => {
    onChange(x, y);
  }, [x, y, onChange]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && pickerRef.current && dotRef.current) {
        const rect = pickerRef.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        if (offsetX < 0 || offsetX > rect.width - dotRef.current.clientWidth) {
          // out of bounds in x direction
          // set x to min or max value depending on which side it's out of bounds

          // left side
          if (offsetX < 0) {
            setX(0);
          }

          // right side
          if (offsetX > rect.width - dotRef.current.clientWidth) {
            setX(rect.width - dotRef.current.clientWidth);
          }
        } else {
          // in bounds in x direction
          setX(offsetX);
        }

        if (
          offsetY < 0 ||
          offsetY > rect.height - dotRef.current.clientHeight
        ) {
          // out of bounds in y direction
          // set y to min or max value depending on which side it's out of bounds

          // top side
          if (offsetY < 0) {
            setY(0);
          }

          // bottom side
          if (offsetY > rect.height - dotRef.current.clientHeight) {
            setY(rect.height - dotRef.current.clientHeight);
          }
        } else {
          // in bounds in y direction
          setY(offsetY);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onChange]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

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
      }}
      onMouseDown={handleMouseDown}
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

export default Picker;
