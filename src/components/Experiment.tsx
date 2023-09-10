import React, { useState } from "react";
import Timer from "./Timer";
import Songplayer from "./Songplayer";
import Picker from "./Picker";
import { api } from "~/utils/api";

interface ExperimentProps {
  children?: React.ReactNode;
}

const Experiment: React.FC<ExperimentProps> = () => {
  const { data, isLoading } = api.example.getSong.useQuery();
  const [started, setStarted] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <>
      <Timer
        seconds={15}
        on={started}
        onComplete={(reset) => {
          setStarted(false);
          reset();
        }}
      />
      <Songplayer
        onPlay={() => {
          setStarted(true);
        }}
        isLoading={isLoading}
        songSrc={data}
        startSeconds={5}
      />
      <Picker
        height={200}
        onChange={(x, y) => {
          setX(x);
          setY(y);
        }}
      />
      <div>
        <p>
          x: {x} y: {y}
        </p>
      </div>
    </>
  );
};

export default Experiment;
