// PWA
export const manifestForPlugIn = {
    includeAssests: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
    manifest: {
        "name": "Fretboard Notes Trainer",
        "short_name": "Fretboard Notes Trainer",
        "icons": [
          {
            "src": "/fretboard-notes-trainer/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/fretboard-notes-trainer/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/fretboard-notes-trainer/pwa-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/fretboard-notes-trainer/pwa-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        "start_url": "/fretboard-notes-trainer/",
        "display": "standalone",
        "background_color": "#FFFFFF",
        "theme_color": "#FFFFFF",
        "description": "The application is used to practice finding notes on the neck of the guitar."
      }
};
