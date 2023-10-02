# Face Trace

A web app build on react with typescript that uses the face-api.js API to run realtime face detection and processing.

## Captures
![Screenshot 2023-10-01 at 20 44 03](https://github.com/RamiChaar/face-trace/assets/99862145/8213914d-fbd4-49bc-b955-0b10e6ea8be6)

<img width="1129" alt="Screenshot 2023-10-01 at 20 38 22" src="https://github.com/RamiChaar/face-trace/assets/99862145/eec505f2-3b1f-4d62-ac0a-653977684d2e">

## Features

#### Realtime face & emotion tracking with webcam

- Estimates age and gender of each face within view
- Displays the average presence of each detected emotion

#### Image upload detection

- Upload any image file to process with the tinyfacedetection model API (face-api.js)
- Each detected face is outlined and information regarding each one displayed (age, gender, emotions)

## Working Site

https://main.d281b90asnm6xn.amplifyapp.com

## Tools and framework used

- React (ts)
- Node
- Visual Studio Code
- AWS Amplify Web Hosting

## API References / Credit

- face-api.js (https://github.com/justadudewhohacks/face-api.js)
