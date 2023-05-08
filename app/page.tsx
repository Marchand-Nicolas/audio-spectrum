"use client";

import Graph from "@/app/components/graph";
import { ReactNode, useState } from "react";
import styles from "@/app/styles/home.module.css";
import { Source } from "@/app/types/audio";
import StreamSelector from "@/app/components/streamSelector";
import ControlBar from "@/app/components/controlBar";

export default function Home() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sourceType, setSourceType] = useState<Source>("file");
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);
  const [showStreamSelector, setShowStreamSelector] = useState<boolean>(true);

  return (
    <main className={styles.mainContainer}>
      <ControlBar
        audioObject={audioObject}
        setShowStreamSelector={setShowStreamSelector}
        sourceType={sourceType}
      />
      <section>
        <StreamSelector
          setSourceType={setSourceType}
          sourceType={sourceType}
          setStream={setStream}
          setAudioObject={setAudioObject}
          showStreamSelector={showStreamSelector}
          setShowStreamSelector={setShowStreamSelector}
        />
      </section>
      <section className={styles.graphContainer}>
        {!showStreamSelector ? (
          <Graph stream={stream} sourceType={sourceType} />
        ) : null}
      </section>
    </main>
  );
}
