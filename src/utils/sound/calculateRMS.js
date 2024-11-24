export function calculateRMS(audioData) {
    let rms = 0;

    for (let i = 0; i < audioData.length; i++) {
        rms += audioData[i] * audioData[i];
    }

    rms = Math.sqrt(rms / audioData.length);

    return rms;
}