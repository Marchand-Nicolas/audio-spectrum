import { useEffect, useState } from "react";
import styles from "../styles/components/controlBar.module.css";
import { Source } from "../types/audio";

export default function ControlBar({
  audioObject,
  setShowStreamSelector,
  sourceType,
}: {
  audioObject: HTMLAudioElement | null;
  setShowStreamSelector: (showStreamSelector: boolean) => void;
  sourceType: Source;
}) {
  const [time, setTime] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(0);

  useEffect(() => {
    if (!audioObject) return;
    const slider = document.getElementById("slider") as HTMLInputElement;
    audioObject.currentTime = time;
    const interval = setInterval(() => {
      slider.value = String(audioObject.currentTime);
      setMaxTime(audioObject.duration);
    }, 10);
    return () => clearInterval(interval);
  }, [audioObject, time]);

  return (
    <div className={styles.container}>
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={styles.icon}
        onClick={() => setShowStreamSelector(true)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
      {sourceType === "file" ? (
        <>
          <input
            title="slider"
            type="range"
            min="0"
            max={maxTime}
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