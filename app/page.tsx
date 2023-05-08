"use client";

import Graph from "@/app/components/graph";
import { ReactNode, useState } from "react";
import styles from "@/app/styles/home.module.css";
import { Source } from "@/app/types/audio";
import StreamSelector from "@/app/components/streamSelector";
import ControlBar from "@/app/components/controlBar";
import Settings from "./components/settings";
import { State } from "./types/menus";

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

  return (
    <main className={styles.mainContainer} id="myButton">
      <ControlBar
        audioObject={audioObject}
        setState={setState}
        sourceType={sourceType}
        playBackSource={playBackSource}
        setPlayBackSource={setPlayBackSource}
      />
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
        />
      </section>
      <section className={styles.graphContainer}>
        {state === "playing" ? (
          <Graph stream={stream} sourceType={sourceType} />
        ) : null}
      </section>
      {menu}
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
