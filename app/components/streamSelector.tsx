import { Source } from "@/app/types/audio";
import styles from "../styles/components/streamSelector.module.css";
import { useEffect, useState } from "react";
import BottomPopup from "./popup/bottomPopup";
import FileInput from "./elements/fileInput";
import { State } from "../types/menus";

export default function StreamSelector({
  sourceType,
  setSourceType,
  setStream,
  setAudioObject,
  state,
  setState,
  audioInputDeviceId,
  audioOutputDeviceId,
  playBackSource,
}: {
  sourceType: Source;
  setSourceType: (sourceType: Source) => void;
  setStream: (stream: MediaStream | null) => void;
  setAudioObject: (audioObject: HTMLAudioElement | null) => void;
  state: State;
  setState: (state: State) => void;
  audioInputDeviceId: string | undefined;
  audioOutputDeviceId: string | undefined;
  playBackSource: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [browserSupport, setBrowserSupport] = useState<boolean>(true);

  useEffect(() => {
    if (state === "home-empty") return;
    // As we are going to use experimental features, we need to check if the browser supports them, and add @ts-ignore in the code to avoid errors
    if (sourceType === "mic") {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: audioInputDeviceId
            ? { exact: audioInputDeviceId }
            : undefined,
        },
      };
      const audio = document.createElement("audio");
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        // Play the stream
        if (playBackSource) {
          audio.srcObject = stream;
          audio.onloadedmetadata = () => {
            setAudioObject(audio);
            try {
              // @ts-ignore
              audio.setSinkId(audioOutputDeviceId);
            } catch (err) {
              setBrowserSupport(false);
              return;
            }
            audio.play();
            setStream(stream);
            setState("playing");
          };
        } else {
          setStream(stream);
          setState("playing");
        }
      });
      return () => {
        audio.pause();
        audio.srcObject = null;
      };
    }
    if (sourceType === "file") {
      if (!file) {
        setStream(null);
        return;
      }
      const audio = document.createElement("audio");
      audio.src = URL.createObjectURL(file);
      audio.loop = true;
      audio.onloadedmetadata = () => {
        setAudioObject(audio);
        try {
          // @ts-ignore
          audio.setSinkId(audioOutputDeviceId);
        } catch (err) {
          console.log(err);
          setBrowserSupport(false);
          return;
        }
        audio.play();
        audio.volume = playBackSource ? 1 : 0.0000001;
        try {
          // @ts-ignore
          setStream(audio.captureStream());
        } catch (err) {
          setBrowserSupport(false);
          return;
        }
        setState("playing");
      };
      return () => {
        audio.pause();
        audio.src = "";
        URL.revokeObjectURL(audio.src);
      };
    }
  }, [
    sourceType,
    file,
    state,
    audioInputDeviceId,
    audioOutputDeviceId,
    playBackSource,
  ]);

  useEffect(() => {
    if (state === "home-empty") setFile(null);
  }, [state]);

  function selectSource(sourceType: Source) {
    setSourceType(sourceType);
    setState("home-source-selected");
  }

  return state !== "playing" ? (
    <div className={styles.container}>
      <h1 className="text-center">Spectre audio</h1>
      <div className={styles.boxContainer}>
        <button onClick={() => selectSource("file")} className={styles.box}>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>

          <label htmlFor="file">Fichier</label>
        </button>
        <button onClick={() => selectSource("mic")} className={styles.box}>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
          </svg>

          <label htmlFor="mic">Microphone</label>
        </button>
      </div>

      {!browserSupport ? (
        <BottomPopup>
          <p>
            Navigateur non supporté. Veuillez télécharger notre application ou
            utiliser un navigateur tel que Chrome, Edge, Opera, ...
          </p>
          <button className={styles.downloadButton}>Télécharger l'app</button>
        </BottomPopup>
      ) : sourceType === "file" && state === "home-source-selected" ? (
        <BottomPopup>
          <FileInput accept="audio/*" callback={(files) => setFile(files[0])} />
        </BottomPopup>
      ) : sourceType === "mic" && state === "home-source-selected" ? (
        <BottomPopup>
          <p>Veuillez autoriser l'accès au microphone pour continuer</p>
        </BottomPopup>
      ) : null}
    </div>
  ) : null;
}
