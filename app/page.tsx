"use client";

import Graph from "@/app/components/graph";
import { ReactNode, useEffect, useState } from "react";
import styles from "@/app/styles/home.module.css";
import { Source } from "@/app/types/audio";
import StreamSelector from "@/app/components/streamSelector";
import ControlBar from "@/app/components/controlBar";
import Settings from "./components/settings";
import { State } from "./types/menus";
import Share from "@/app/components/share";
import { useSearchParams } from "next/navigation";
import config from "./utils/config";

export default function Home() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sourceType, setSourceType] = useState<Source>("file");
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);
  const [state, setState] = useState<State>("home-empty");
  const [menu, setMenu] = useState<ReactNode>(null);
  const [audioInputDeviceId, setAudioInputDeviceId] = useState<
    string | undefined
  >("");
  const [audioOutputDeviceId, setAudioOutputDeviceId] = useState<
    string | undefined
  >("");
  const [playBackSource, setPlayBackSource] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  const searchParams = useSearchParams();
  const customFileName = searchParams.get("file");

  useEffect(() => {
    // Resize the canvas (graph) when the window is resized
    const onResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // Clear the menu when the state changes
    setMenu(null);
  }, [state]);

  return (
    <main className={styles.mainContainer}>
      {
        // Show video if the file is a video
      }
      {state === "playing" &&
      (sourceType === "url" ||
        (sourceType === "file" && file?.type.includes("video"))) ? (
        <video
          className={styles.video}
          src={
            sourceType === "file"
              ? URL.createObjectURL(file as Blob)
              : `${config.apiURL}/files/${customFileName}`
          }
          autoPlay
          loop
          muted
          id="video"
        />
      ) : null}
      {state === "playing" ? (
        <div id="circle" className={styles.circle} />
      ) : null}
      {
        // Control bar (play, time, etc.)
      }
      <ControlBar
        audioObject={audioObject}
        setState={setState}
        sourceType={sourceType}
        playBackSource={playBackSource}
        setPlayBackSource={setPlayBackSource}
      />
      {
        // Stream selector (file, mic, etc.)
      }
      <section>
        <StreamSelector
          setSourceType={setSourceType}
          sourceType={sourceType}
          setStream={setStream}
          setAudioObject={setAudioObject}
          state={state}
          setState={setState}
          audioInputDeviceId={audioInputDeviceId}
          audioOutputDeviceId={audioOutputDeviceId}
          playBackSource={playBackSource}
          file={file}
          setFile={setFile}
        />
      </section>
      {
        // Graph (audio visualizer)
      }
      <section className={styles.graphContainer}>
        {state === "playing" ? (
          <Graph
            stream={stream}
            sourceType={sourceType}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
          />
        ) : null}
      </section>
      {
        // Share
        state === "playing" ? (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.openDetailsMenuIcon}
            onClick={() =>
              setMenu(
                <Share file={file} setMenu={setMenu} sourceType={sourceType} />
              )
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        ) : null
      }

      {menu}
      {
        // Settings icon : Open settings
      }
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={styles.settingsIcon}
        onClick={() => {
          if (menu) setMenu(null);
          else
            setMenu(
              <Settings
                audioInputDeviceId={audioInputDeviceId}
                setAudioInputDeviceId={setAudioInputDeviceId}
                audioOutputDeviceId={audioOutputDeviceId}
                setAudioOutputDeviceId={setAudioOutputDeviceId}
              />
            );
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
        />
      </svg>
    </main>
  );
}
