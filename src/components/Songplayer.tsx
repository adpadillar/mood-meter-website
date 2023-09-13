import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

interface SongplayerProps {
  children?: React.ReactNode;
  songSrc?: string;
  isLoading?: boolean;
  startSeconds?: number;

  onEnd?: () => void;
  onPlay?: () => void;
}

const Songplayer: React.FC<SongplayerProps> = ({
  songSrc,
  isLoading = false,
  startSeconds = 0,
  onEnd,
  onPlay,
}) => {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const audio = new Audio(songSrc);
      audio.load();
      audio.pause();
      audio.currentTime = startSeconds;
      setAudio(audio);
    }
  }, [isLoading, songSrc, startSeconds]);

  const play = () => {
    if (audio) {
      onPlay?.();
      void audio.play();
      setPlaying(true);

      setTimeout(() => {
        onEnd?.();
        pause();
      }, 15 * 1000);
    }
  };

  const pause = () => {
    if (audio) {
      void audio.pause();
      audio.currentTime = startSeconds;
      setPlaying(false);
    }
  };

  return (
    <Button
      isLoading={isLoading || playing}
      onClick={playing ? undefined : play}
      color={playing ? "default" : "primary"}
    >
      {isLoading ? "Loading" : <>{playing ? "Playing" : "Play"}</>}
    </Button>
  );
};

export default Songplayer;
