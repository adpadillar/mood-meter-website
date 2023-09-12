import React, { useEffect, useState } from "react";
import { type FileDoc } from "~/server/api/routers/schemas";

interface SongPreviewProps {
  children?: React.ReactNode;
  song: FileDoc;
}

const SongPreview: React.FC<SongPreviewProps> = ({ song }) => {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(song.url);
    audio.load();
    audio.pause();
    setAudio(audio);
  }, [audio, song]);

  const play = () => {
    if (audio) {
      void audio.play();
      setPlaying(true);

      setTimeout(() => {
        pause();
      }, 15 * 1000);
    }
  };

  const pause = () => {
    if (audio) {
      void audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        className="flex h-6 min-w-[2.5rem] items-center justify-center rounded-full bg-red-500 text-white"
        onClick={playing ? pause : play}
      >
        {playing ? "⏸" : "►"}
      </button>
      <a href={song.url}>{song.name.replace(".mp3", "")}</a>
    </div>
  );
};

export default SongPreview;
