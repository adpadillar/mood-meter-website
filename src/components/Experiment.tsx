import React, { useState } from "react";
import Timer from "./Timer";
import Songplayer from "./Songplayer";
import Picker from "./Picker";
import { api } from "~/utils/api";
import { type Category } from "~/server/api/routers/schemas";

interface ExperimentProps {
  children?: React.ReactNode;
  category: Category;
}

const Experiment: React.FC<ExperimentProps> = ({ category }) => {
  const { data, isLoading } = api.example.getSong.useQuery(
    { category },
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );
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
        <p>Experiment type: {category}</p>
      </div>
    </>
  );
};

export default Experiment;
