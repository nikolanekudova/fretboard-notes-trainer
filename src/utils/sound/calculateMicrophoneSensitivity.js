export function calculateMicrophoneSensitivity(sensitivity) {
    switch (sensitivity) {
        case "low":
            return 0.05;
        case "medium":
            return 0.005;
        case "high":
            return 0.0005;
        default:
            return 0.005;
    }
}