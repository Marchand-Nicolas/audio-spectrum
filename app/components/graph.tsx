import { Source } from "@/app/types/audio";
import { useEffect, useState } from "react";

export default function Graph({
  stream,
  sourceType,
}: {
  stream: MediaStream | null;
  sourceType: Source;
}) {
  useEffect(() => {
    if (stream === null) return;
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasCtx = canvas.getContext("2d");
    const circle = document.getElementById("circle") as HTMLDivElement;
    const interval = setInterval(() => {
      draw();
    }, 0);
    function draw() {
      if (!canvasCtx) throw new Error("No canvas context");
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.beginPath();
      const barWidth = (WIDTH / bufferLength) * 5;
      let x = 0;
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);
      let barHeight;
      let barHeightAverage = 0;
      let barNumber = 0;
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        barHeightAverage += barHeight;
        barNumber++;
        // Background bars
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;
        canvasCtx.fillStyle = `rgb(${r / 2},${g / 2},${b / 2})`;
        const backgroundBarHeight = barHeight * (1 + barHeightAverage / 10000);
        canvasCtx.fillRect(
          x,
          canvas.height - backgroundBarHeight - window.innerHeight / 2,
          barWidth,
          backgroundBarHeight * 2
        );
        // Bars
        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(
          x,
          canvas.height - barHeight - window.innerHeight / 2,
          barWidth,
          barHeight * 2
        );
        x += barWidth + 1;
      }
      barHeightAverage /= barNumber;
      circle.style.height = `${barHeightAverage * 25}px`;
    }

    return () => {
      clearInterval(interval);
      audioCtx.close();
    };
  }, [stream, sourceType]);
  return (
    <canvas
      id="canvas"
      width={window.innerWidth}
      height={window.innerHeight}
    ></canvas>
  );
}
