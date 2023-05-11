import { ReactNode, useEffect, useState } from "react";
import styles from "../styles/components/settings.module.css";

export default function Settings({
  audioInputDeviceId,
  setAudioInputDeviceId,
  audioOutputDeviceId,
  setAudioOutputDeviceId,
}: {
  audioInputDeviceId: string | undefined;
  setAudioInputDeviceId: (audioInputDeviceId: string | undefined) => void;
  audioOutputDeviceId: string | undefined;
  setAudioOutputDeviceId: (audioOutputDeviceId: string | undefined) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  const [additionalContent, setAdditionalContent] = useState<ReactNode | null>(
    null
  );
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    if (reload) {
      setError(null);
      setAdditionalContent(null);
      setReload(false);
      return;
    }
    try {
      // @ts-ignore
      navigator.permissions.query({ name: "microphone" }).then((result) => {
        if (result.state === "denied" || result.state === "prompt") {
          setError(
            "Permission refusée. Accès au microphone nécessaire pour gérer les appareils audio (entrées et sorties)."
          );
          setAdditionalContent(
            <>
              <p>
                Vous pouvez changer les permissions dans les paramètres de votre
                navigateur.
              </p>
              <ul>
                <li>
                  <a
                    className="link"
                    href="https://support.google.com/chrome/answer/2693767?hl=fr"
                  >
                    Aide Chrome
                  </a>
                </li>
                <li>
                  <a
                    className="link"
                    href="https://support.mozilla.org/fr/kb/autoriser-bloquer-microphone-camera-ordinateur"
                  >
                    Aide Firefox
                  </a>
                </li>
              </ul>
            </>
          );
          // Ask for microphone permission
          navigator.mediaDevices.getUserMedia({ audio: true });
          // Reload on permission change
          result.addEventListener("change", () => {
            setReload((prev) => !prev);
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
    if (!navigator.mediaDevices?.enumerateDevices) {
      setError("Impossible de récupérer les appareils.");
    } else {
      let audioInput: MediaDeviceInfo[] = [];
      let audioOutput: MediaDeviceInfo[] = [];
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            if (device.kind === "audioinput") audioInput.push(device);
            if (device.kind === "audiooutput") audioOutput.push(device);
          });
          setAudioInputDevices(audioInput);
          setAudioOutputDevices(audioOutput);
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
    }
  }, [setReload, reload]);

  return (
    <div className={styles.container}>
      <h1>Appareils</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <strong>Entrées (micro)</strong>
          {audioInputDevices.map((device, index) => (
            <div key={`${index}__${device.deviceId}`}>
              <input
                defaultChecked={
                  device.deviceId ===
                  (audioInputDeviceId ? audioInputDeviceId : "default")
                }
                title="Appareils audio entrée"
                type="radio"
                name="input"
                onChange={() => setAudioInputDeviceId(device.deviceId)}
              />
              <label className="ml-2">{device.label}</label>
            </div>
          ))}

          <strong>Sorties</strong>
          {audioOutputDevices.map((device, index) => (
            <div key={`${index}__${device.deviceId}}`}>
              <input
                defaultChecked={
                  device.deviceId ===
                  (audioOutputDeviceId ? audioOutputDeviceId : "default")
                }
                title="Appareils audio entrée"
                type="radio"
                name="output"
                onChange={() => {
                  setAudioOutputDeviceId(device.deviceId);
                }}
              />
              <label className="ml-2">{device.label}</label>
            </div>
          ))}
        </>
      )}
      {additionalContent}
    </div>
  );
}
