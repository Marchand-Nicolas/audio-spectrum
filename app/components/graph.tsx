import { Source } from "@/app/types/audio";
import { useEffect, useState } from "react";

export default function Graph({
  stream,
  sourceType,
  windowWidth,
  windowHeight,
}: {
  stream: MediaStream | null;
  sourceType: Source;
  windowWidth: number;
  windowHeight: number;
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
    // Blured circle to add a depth effect. Follows the music
    const circle = document.getElementById("circle") as HTMLDivElement;
    // Start the animation
    const interval = setInterval(draw, 1);
    let lastBarHeightAverage = 0;
    // Compute global average to know if the music is loud or not
    let barHeightGlobalAverage = 0;
    let barHeightGlobalAverageCount = 0;
    let powerScores: number[] = [];
    let barSpace = 1;
    let state = 0;
    let lastPowerScoreAverage = 0;
    function draw() {
      if (!canvasCtx) throw new Error("No canvas context");
      // Canvas size
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      // Reset the canvas
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      // Get the data from the analyser
      analyser.getByteTimeDomainData(dataArray);
      // Begin the path
      canvasCtx.beginPath();
      // The bigger the bars are, the less there are
      const barWidth = (WIDTH / bufferLength) * 5;
      let x = 0;
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);
      let barHeight;
      // Bar height average to know if the music is loud or not
      let barHeightAverage = 0;
      let barNumber = 0;
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        barHeightAverage += barHeight;
        barNumber++;
        // Colors
        const r = state === 0 ? barHeight + 500 * (i / bufferLength) : 50;
        const g = 250 * (i / bufferLength);
        const b = state === 0 ? 50 : barHeight + 500 * (i / bufferLength);
        // Background bars
        // We divide the colors by 2 to have a darker background
        canvasCtx.fillStyle = `rgb(${r / 2},${g / 2},${b / 2})`;
        // The more the music is loud, the more the background bars are high
        const backgroundBarHeight =
          barHeight *
          (1 + lastBarHeightAverage / 200) *
          (state === 0 ? 1 : 1.2) *
          (lastPowerScoreAverage || 1);
        canvasCtx.fillRect(
          x,
          canvas.height - backgroundBarHeight / 2 - window.innerHeight / 2,
          barWidth,
          backgroundBarHeight
        );
        // Bars
        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(
          x,
          canvas.height - barHeight / 2 - window.innerHeight / 2,
          barWidth,
          barHeight
        );
        // Adding a little space between the bars
        x += barWidth + barSpace;
      }
      barHeightAverage /= barNumber;
      lastBarHeightAverage = barHeightAverage;
      if (
        !isNaN(barHeightAverage) &&
        barHeightAverage !== 0 &&
        !isNaN(lastBarHeightAverage) &&
        lastBarHeightAverage !== 0
      ) {
        barHeightGlobalAverage += barHeightAverage;
        barHeightGlobalAverageCount++;
        const proportion =
          barHeightAverage /
          (barHeightGlobalAverage / barHeightGlobalAverageCount);
        if (barHeightGlobalAverageCount > 1000) {
          powerScores.push(proportion);
          if (powerScores.length > 70) {
            powerScores.shift();
            const powerScoreAverage = powerScores.reduce((a, b) => a + b) / 70;
            lastPowerScoreAverage = powerScoreAverage;
            if (powerScoreAverage > 1.15 && state !== 1) {
              barSpace = 0;
              state = 1;
            }
            if (powerScoreAverage < 0.85 && state !== 0) {
              barSpace = 1;
              state = 0;
            }
          }
        }
        // Background blured circle to add a depth effect
        const r = state === 0 ? 255 : 50;
        const g = 50;
        const b = state === 0 ? 50 : 255;
        circle.style.height = `${barHeightAverage * 8}px`;
        circle.style.backgroundColor = `rgb(${r},${g},${b})`;
        circle.style.opacity = `${Math.min(Math.max(0.2, proportion / 3), 1)}`;
      }
    }

    return () => {
      // Stop the animation and close the audio context
      clearInterval(interval);
      audioCtx.close();
    };
  }, [stream, sourceType]);
  return (
    <canvas
      id="canvas"
      width={windowWidth || window.innerWidth}
      height={windowHeight || window.innerHeight}
    ></canvas>
  );
}
