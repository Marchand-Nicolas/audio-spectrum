import { useEffect, useState } from "react";
import styles from "../styles/components/controlBar.module.css";
import { Source } from "../types/audio";
import { State } from "../types/menus";

export default function ControlBar({
  audioObject,
  setState,
  sourceType,
  playBackSource,
  setPlayBackSource,
}: {
  audioObject: HTMLAudioElement | null;
  setState: (state: State) => void;
  sourceType: Source;
  playBackSource: boolean;
  setPlayBackSource: (playBackSource: boolean) => void;
}) {
  const [time, setTime] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(0);

  useEffect(() => {
    if (!audioObject) return;
    const slider = document.getElementById("slider") as HTMLInputElement;
    if (slider === null) return;
    audioObject.currentTime = time;
    const interval = setInterval(() => {
      slider.value = String(audioObject.currentTime);
      setMaxTime(audioObject.duration);
    }, 10);
    return () => clearInterval(interval);
  }, [audioObject, time]);

  useEffect(() => {
    // Set video time to audio time
    const videoBackground = document.getElementById(
      "video"
    ) as HTMLVideoElement;
    if (videoBackground === null) return;
    videoBackground.currentTime = time;
  }, [time]);

  return (
    <div className={styles.container}>
      {
        // Left arrow icon : Return to home
      }
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={styles.icon}
        onClick={() => setState("home-empty")}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
      {
        // Sound icon : Toggle sound
      }
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={styles.icon}
        onClick={() => setPlayBackSource(!playBackSource)}
      >
        {playBackSource ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
          />
        )}
      </svg>
      {
        // Slider : Change time
      }
      {sourceType === "file" ? (
        <>
          <input
            title="slider"
            type="range"
            min="0"
            max={isNaN(maxTime) ? 1000 : maxTime}
            step={0.01}
            className={styles.slider}
            onChange={(e) => setTime(Number(e.target.value))}
            id="slider"
          />
        </>
      ) : null}
    </div>
  );
}
