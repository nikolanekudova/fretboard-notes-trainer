#Fretboard Notes Trainer

The web application is used to **practice finding notes** quickly on the neck of the guitar. At its core is an algorithm for recognizing the frequency of a note from the audio input from the microphone of the device it is running on.

- The user manually triggers note recognition, a **random note is generated** and its expected location on the string (e.g. note A on string A). 
- If the note is sufficiently similar in frequency to the note displayed to the user, the application plays a note indicating success and displays the next note. 
- If the note is different, the application does nothing. 
- The user has the option to manually exit the application.

You can find app [here](https://nikolanekudova.github.io/fretboard-notes-trainer/).