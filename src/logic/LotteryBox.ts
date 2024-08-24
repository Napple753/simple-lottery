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

  /**
   * キャンセルして再抽選する
   * @param programId 記録用進行プログラム番号
   * @param canceledId キャンセルする当選者のID
   * @returns
   */
  redraw(programId: number, canceledId: number) {
    const programLog = this.#winnerLogIds.find(
      (log) => log.programId == programId,
    );
    if (!programLog) {
      throw new Error("Specified program not found!");
    }
    const canceledIndex = programLog.selected.findIndex(
      (id) => id == canceledId,
    );
    if (canceledIndex === -1) {
      throw new Error("Specified winner not found!");
    }

    programLog.cancelled.push(canceledId);

    const redrawWinner = this.#drawOne([
      ...programLog.selected,
      ...programLog.cancelled,
    ]);
    programLog.selected.splice(canceledIndex, 1, redrawWinner.id);

    return redrawWinner;
  }

  #drawMany(count: number): Candidate[] {
    if (count > this.#candidates.length) {
      const shuffled = shuffleArray(this.#candidates);
      return shuffled.concat(this.#drawMany(count - this.#candidates.length));
    }
    const selected: Candidate[] = [];
    for (let i = 0; i < count; i++) {
      selected.push(this.#drawOne(selected.map((c) => c.id)));
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

  #drawOne(excludeIds: number[]): Candidate {
    // 未選択がない場合は全員が選ばれたとみなして再度未選択を作成する
    if (this.#notSelected.length == 0) {
      this.#notSelected = [...this.#candidates];
    }

    // 未選択からランダムに選ぶ
    const pickedId = Math.floor(Math.random() * this.#notSelected.length);

    // 抽選対象外の場合は再度選ぶ
    if (excludeIds.includes(this.#notSelected[pickedId].id)) {
      return this.#drawOne(excludeIds);
    }

    // 選ばれた候補を未選択から削除して返す
    return this.#notSelected.splice(pickedId, 1)[0];
  }
}
