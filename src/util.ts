import { Log, Candidate } from "./myTypes";
import Encoding from "encoding-japanese";

export function loadMusic(src: string) {
  const music: HTMLAudioElement = document.createElement("audio");
  music.src = src;
  music.autoplay = false;
  document.body.appendChild(music);

  return music;
}

export function shuffleArray<T = any>(source0: T[]): T[] {
  const source = [...source0];
  const shuffled = [];
  for (let i = source.length; i > 0; i--) {
    shuffled.push(source.splice(Math.floor(i * Math.random()), 1)[0]);
  }
  return shuffled;
}

/**
  ダミー配列作成関数
   * @param source ダミー配列のもとになる配列。当選者を含んでもよい
   * @param  count ダミー配列の長さ
   * @param winner 当選者
   * @return ダミー配列。最後の(count-1)個には当選者は含まれない
   */
export function getDummyList(
  source: Candidate[],
  count: number,
  winner: Candidate,
) {
  const dummyList: Candidate[] = [];
  const candidateNumber = source.length;
  for (let i = 0; i < Math.floor(count / candidateNumber); i++) {
    dummyList.push(...shuffleArray<Candidate>(source));
  }
  dummyList.push(
    ...shuffleArray<Candidate>(source).filter((p) => p.id !== winner.id),
  );

  return dummyList.slice(-count);
}

export function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export class LotteryBox {
  #notSelected: Candidate[];
  #candidates: Candidate[];

  #log: Log<number> = [];

  constructor(candidates: Candidate[]) {
    this.#candidates = [...candidates];
    this.#notSelected = [...this.#candidates];
  }

  draw(prizeName: string, count: number) {
    const selected = this.#drawMany(count);
    const selectedIds = selected.map((c) => c.id);
    this.#log.push({
      prizeName,
      selected: selectedIds,
      timestamp: Date.now(),
    });
    return selected;
  }

  #drawMany(count: number): Candidate[] {
    if (count > this.#candidates.length) {
      const shuffled = shuffleArray(this.#candidates);
      return shuffled.concat(this.#drawMany(count - this.#candidates.length));
    }
    const selected: Candidate[] = [];
    for (let i = 0; i < count; i++) {
      selected.push(this.#drawOne(selected));
    }
    return selected;
  }

  get log(): Log<Candidate> {
    return this.#log.map((log) => {
      const selectedCandidates = log.selected.map((selectedId) => {
        const candidate = this.#candidates.find(
          (c) => c.id == selectedId,
        ) as Candidate;
        return candidate;
      });
      return {
        prizeName: log.prizeName,
        selected: selectedCandidates,
        timestamp: log.timestamp,
      };
    });
  }

  #drawOne(selected: Candidate[]): Candidate {
    if (this.#notSelected.length == 0) {
      this.#notSelected = [...this.#candidates];
    }
    const pickedId = Math.floor(Math.random() * this.#notSelected.length);
    if (selected.map((c) => c.id).includes(this.#notSelected[pickedId].id)) {
      return this.#drawOne(selected);
    }
    return this.#notSelected.splice(pickedId, 1)[0];
  }
}

export function readAnyEncoding(reader: FileReader): string {
  let array: Uint8Array | Uint16Array | Uint32Array = new Uint8Array(
    reader.result as any,
  );

  // 文字コードを取得
  switch (Encoding.detect(array)) {
    case "UTF16":
      // 16ビット符号なし整数値配列と見なす
      array = new Uint16Array(reader.result as any);
      break;
    case "UTF32":
      // 32ビット符号なし整数値配列と見なす
      array = new Uint32Array(reader.result as any);
      break;
  }

  // Unicodeの数値配列に変換
  var unicodeArray = Encoding.convert(array, "UNICODE");
  // Unicodeの数値配列を文字列に変換
  return Encoding.codeToString(unicodeArray);
}
