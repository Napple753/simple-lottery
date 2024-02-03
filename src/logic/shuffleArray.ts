export function shuffleArray<T = any>(source0: T[]): T[] {
  const source = [...source0];
  const shuffled = [];
  for (let i = source.length; i > 0; i--) {
    shuffled.push(source.splice(Math.floor(i * Math.random()), 1)[0]);
  }
  return shuffled;
}
