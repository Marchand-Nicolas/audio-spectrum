import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      setError("Impossible de récupérer les appareils.");
    } else {
      setAudioInputDevices([]);
      setAudioOutputDevices([]);
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            if (device.kind === "audioinput")
              setAudioInputDevices((prev) => [...prev, device]);
            if (device.kind === "audiooutput")
              setAudioOutputDevices((prev) => [...prev, device]);
          });
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
    }
  }, []);

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
    </div>
  );
}
