export function playSound(soundEffect) {
    var audio = new Audio(soundEffect);

    audio.play();
}