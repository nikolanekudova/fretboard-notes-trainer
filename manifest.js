// PWA
export const manifestForPlugIn = {
    registerType: "prompt",
    includeAssests: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
    manifest: {
        name: "Fretboard Notes Trainer",
        short_name: "fretboard",
        description: "Fretboard Notes Trainer",
        icons: [
            {
                src: "/fretboard-notes-trainer/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "favicon",
            },
            {
                src: "/fretboard-notes-trainer/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "favicon",
            },
            {
                src: "/fretboard-notes-trainer/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "apple touch icon",
            },
            {
                src: "/fretboard-notes-trainer/maskable-icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
        theme_color: "#ffffff",
        display: "standalone",
        scope: "/fretboard-notes-trainer/",
        start_url: "/fretboard-notes-trainer/",
        orientation: "portrait",
    },
};
