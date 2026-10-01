import cannonUrl from "../sounds/cannon-shot.mp3";
import explosionUrl from "../sounds/explosion-ship.mp3";

const cannon = new Audio(cannonUrl);
const explosion = new Audio(explosionUrl);

cannon.preload = "auto";
explosion.preload = "auto";

cannon.volume = 0.6;
explosion.volume = 1;

function play(sound) {
  const instance = sound.cloneNode();
  instance.volume = sound.volume;
  instance.play().catch(() => {});
}

export function playShot(hit) {
  play(hit ? explosion : cannon);
}
