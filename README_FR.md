## Démarrer avec "Audio Spectrum"
Cliquez sur ce [lien](https://audio-spectrum-web.vercel.app/) pour accéder au site web. Il vous sera demandé de choisir entre deux types d'entrée audio : Fichier ou Micro.
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/3091011f-5682-4bb8-bde9-6f572dff88a6)
Si vous obtenez le message suivant, cela signifie que votre navigateur n'est pas compatible. Vous pouvez utiliser un autre navigateur ou télécharger l'application.
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/e73fb5d3-1893-4e3b-b423-210bce7694d5)
L'application fonctionne exactement comme le site web, vous pouvez donc suivre les étapes suivantes de la même manière.
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/c21c2da6-35df-496a-92af-fb16e54dd804)
Après avoir sélectionné l'entrée audio, le spectre devrait s'afficher.
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/b55f7e81-f688-4670-97eb-e13de8bd8a75)
Attention : Il se peut que les périphériques utilisés par défaut soient incorrects (l'audio ne sera pas émis, ou le microphone ne fonctionnera pas, etc.), en utilisant le bouton en bas à droite vous pouvez sélectionner d'autres périphériques
![image](https://github.com/Marchand-Nicolas/audio-spectrum/assets/60229704/d9fcf6e2-f483-4d84-9de6-5628c07dd41a)

## Technologies
Il s'agit d'un projet [Next.js](https://nextjs.org/) démarré avec [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

L'application est alimentée par [electron](https://www.electronjs.org/), qui charge simplement le site web avec un navigateur web intégré supporté.

Autres : 
 - [Typescript](https://www.typescriptlang.org/)
 - [Tailwind-css](https://tailwindcss.com/)