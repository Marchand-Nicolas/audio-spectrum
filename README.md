🇫🇷 : You can also read [French README.md](https://github.com/Marchand-Nicolas/audio-spectrum/blob/main/README_FR.md)

## Getting Started with "Audio Spectrum"
Click on this [link](https://audio-spectrum-web.vercel.app/) to access the website. You will be asked to choose between two kind of audio input : File or Micro.
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/3091011f-5682-4bb8-bde9-6f572dff88a6)
if you get the following message, this means your browser is not supported. You can use another browser or download the app.
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/e73fb5d3-1893-4e3b-b423-210bce7694d5)
The app works exactly like the website, so you can do next steps same way.
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/c21c2da6-35df-496a-92af-fb16e54dd804)
After selecting the audio input, the spectrum should be shown.
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/b55f7e81-f688-4670-97eb-e13de8bd8a75)
Warning : Maybe the default devices used are incorrect (audio will not be output, or the microphone will not work, etc.), using the bottom right button you can select other devices
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/d9fcf6e2-f483-4d84-9de6-5628c07dd41a)

## Technologies
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The app is powered by [electron](https://www.electronjs.org/), which simply load the website with a supported built-in web browser.

Other : 
 - [Typescript](https://www.typescriptlang.org/)
 - [Tailwind-css](https://tailwindcss.com/)

## Styling

The color and spacing of the bars, and the height of the background bars depend on the intensity of the music right now compared to the global intensity of the music
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/c690cf96-18d8-4c43-8807-d69a4ff78c08)

## Linked repos

 - https://github.com/Marchand-Nicolas/audio-spectrum-api
 - https://github.com/Marchand-Nicolas/audio-spectrum-app