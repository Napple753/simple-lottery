import {
  WinnerIdLog,
  Candidate,
  CandidateId,
  TimeStamp,
  WinnerCandidateLog,
} from "@/myTypes";
import { shuffleArray } from "@/logic/shuffleArray";

export class LotteryBox {
  #notSelected: Candidate[];
  #candidates: Candidate[];

  #winnerLogIds: WinnerIdLog[] = [];

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
  draw(
    programId: number,
    prizeName: string,
    count: number,
    subPrizeName?: string[],
  ) {
    const selected = this.#drawMany(count);
    const selectedIds = selected.map((c) => c.id);
    const timestamp = Date.now();
    this.#winnerLogIds.push({
      programId,
      prizeName,
      selected: selectedIds.map((id, i) => ({
        id,
        selectTS: timestamp + i,
        prizeName: subPrizeName ? subPrizeName[i] : prizeName,
      })),
      cancelled: [],
    });
    return selected;
  }

  /**
   * キャンセルして再抽選する
   * @param programId 記録用進行プログラム番号
   * @param canceledCandidateId キャンセルする当選者のID
   * @returns
   */
  redraw(programId: number, canceledCandidateId: CandidateId) {
    const programLog = this.#winnerLogIds.find(
      (log) => log.programId == programId,
    );
    if (!programLog) {
      throw new Error("Specified program not found!");
    }
    const canceledIndex = programLog.selected.findIndex(
      (s) => s.id === canceledCandidateId,
    );
    if (canceledIndex === -1) {
      throw new Error("Specified winner not found!");
    }

    const timestamp = Date.now();

    const cancelledLog: {
      id: CandidateId;
      selectTS: TimeStamp;
      cancelledTS: TimeStamp;
      prizeName: string;
    } = {
      ...programLog.selected[canceledIndex],
      cancelledTS: timestamp,
    };

    const redrawWinner = this.#drawOne([
      ...programLog.selected.map((c) => c.id),
      ...programLog.cancelled.map((c) => c.id),
      cancelledLog.id,
    ]);
    programLog.cancelled.push(cancelledLog);
    programLog.selected.splice(canceledIndex, 1, {
      id: redrawWinner.id,
      selectTS: timestamp,
      prizeName: cancelledLog.prizeName,
    });

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

  get winnerLogIds(): WinnerIdLog[] {
    return this.#winnerLogIds;
  }

  get winnerLogCandidates(): WinnerCandidateLog[] {
    return this.#winnerLogIds.map((log) => {
      const selectedCandidates = log.selected
        .map((s) => ({
          candidate: this.#candidates.find((c) => c.id == s.id),
          selectTS: s.selectTS,
          prizeName: s.prizeName,
        }))
        .filter(
          (
            c,
          ): c is {
            candidate: Candidate;
            selectTS: TimeStamp;
            prizeName: string;
          } => c.candidate !== undefined,
        );
      const canceledCandidates = log.cancelled
        .map((s) => ({
          candidate: this.#candidates.find((c) => c.id == s.id),
          selectTS: s.selectTS,
          cancelledTS: s.cancelledTS,
          prizeName: s.prizeName,
        }))
        .filter(
          (
            c,
          ): c is {
            candidate: Candidate;
            selectTS: TimeStamp;
            cancelledTS: TimeStamp;
            prizeName: string;
          } => c.candidate !== undefined,
        );
      return {
        programId: log.programId,
        prizeName: log.prizeName,
        selected: selectedCandidates,
        cancelled: canceledCandidates,
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
