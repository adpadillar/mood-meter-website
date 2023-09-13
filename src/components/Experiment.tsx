import React, { useState } from "react";
import Timer from "./Timer";
import Songplayer from "./Songplayer";
import Picker from "./Picker";
import { api } from "~/utils/api";
import { Button } from "@nextui-org/react";

interface ExperimentProps {
  children?: React.ReactNode;
}

const Experiment: React.FC<ExperimentProps> = () => {
  const { mutate } = api.example.uploadSongExperiment.useMutation({
    onSuccess: async () => {
      setFinishedSong(false);
      setMovedPicker(false);
      await refetch();
    },
  });
  const { data, isLoading, refetch } = api.example.getExperimentSong.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const [finishedSong, setFinishedSong] = useState(false);
  const [movedPicker, setMovedPicker] = useState(false);
  const [started, setStarted] = useState(false);
  const [pleasentness, setPleasentness] = useState(0);
  const [energy, setEnergy] = useState(0);

  const readyToRate = finishedSong && movedPicker;

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
        onPlay={() => setStarted(true)}
        onEnd={() => setFinishedSong(true)}
        isLoading={isLoading}
        songSrc={data?.url}
        startSeconds={5}
      />
      {data && (
        <Button
          onClick={
            !readyToRate
              ? undefined
              : () =>
                  mutate({
                    experiment: {
                      createdAt: Date.now(),
                      energy,
                      pleasentness,
                      songId: data.id,
                      classification: data.clasification,
                    },
                    id: data.id,
                  })
          }
          color={!readyToRate ? "default" : "primary"}
          disabled={!readyToRate}
          title={!readyToRate ? "Play song and rate it first" : undefined}
          className={
            !readyToRate ? "cursor-not-allowed opacity-60" : "opacity-100"
          }
        >
          Rate Song
        </Button>
      )}
      <Picker
        height={310}
        width={310}
        onChange={({ x, y, initialX, initialY }) => {
          setPleasentness(x);
          setEnergy(y);
          if (x !== initialX || y !== initialY) {
            setMovedPicker(true);
          }
        }}
      />
      <div>
        <p>
          x: {pleasentness} y: {energy}
        </p>
      </div>
    </>
  );
};

export default Experiment;
