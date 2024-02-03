export function loadMusic(src: string) {
  const music: HTMLAudioElement = document.createElement("audio");
  music.src = src;
  music.autoplay = false;
  document.body.appendChild(music);

  return music;
}
