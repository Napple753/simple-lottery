import { Log, Candidate } from "../myTypes";
import { shuffleArray } from "./shuffleArray";
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
