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
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "favicon",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "favicon",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "apple touch icon",
            },
            {
                src: "/maskable_icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
        theme_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
    },
};
