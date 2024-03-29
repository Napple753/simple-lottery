import { WinnerLog, Candidate } from "@/myTypes";
import { shuffleArray } from "@/logic/shuffleArray";

export class LotteryBox {
  #notSelected: Candidate[];
  #candidates: Candidate[];

  #winnerLogIds: WinnerLog<number>[] = [];

  /**
   * 抽選用クラスの作成
   * @param candidates 抽選対象
   */
  constructor(candidates: Candidate[]) {
    this.#candidates = [...candidates];
    this.#notSelected = [...this.#candidates];
  }

  /**
   * 抽選を行う
   * @param programId 記録用進行プログラム番号
   * @param prizeName 記録用賞の名前
   * @param count 当選者の数
   * @returns
   */
  draw(programId: number, prizeName: string, count: number) {
    const selected = this.#drawMany(count);
    const selectedIds = selected.map((c) => c.id);
    this.#winnerLogIds.push({
      programId,
      prizeName,
      selected: selectedIds,
      cancelled: [],
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

  get winnerLogIds(): WinnerLog<number>[] {
    return this.#winnerLogIds;
  }

  get winnerLogCandidates(): WinnerLog<Candidate>[] {
    return this.#winnerLogIds.map((log) => {
      const selectedCandidates = log.selected.map((selectedId) => {
        const candidate = this.#candidates.find(
          (c) => c.id == selectedId,
        ) as Candidate;
        return candidate;
      });
      return {
        programId: log.programId,
        prizeName: log.prizeName,
        selected: selectedCandidates,
        cancelled: [],
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
