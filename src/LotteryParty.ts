import { Candidate, EventPlans, DisplaySetting } from "./myTypes.ts";
import { LotteryBox } from "./util.ts";

export class LotteryParty {
  #candidates;
  #eventPlans;
  #displaySetting;
  #lotteryBox;

  /**
   * 当選済みの当選者リストを格納する配列
   */
  #winnerList: number[][] = [];

  /**
   * 現在のプログラムの当選者を格納するキャッシュ配列
   */
  #currentWinners: Candidate[] = [];

  #currentProgramId = -1;

  /**
   * @param candidates 抽選の対象者
   * @param eventPlans 抽選会の設定
   * @param displaySetting 当選者の表示設定
   */
  constructor(
    candidates: Candidate[],
    eventPlans: EventPlans,
    displaySetting: DisplaySetting,
  ) {
    this.#candidates = candidates;
    this.#eventPlans = eventPlans;
    this.#displaySetting = displaySetting;

    this.#lotteryBox = new LotteryBox(candidates);
  }

  /**
   * 現在のプログラム番号
   */
  get currentProgramNumber() {
    return this.#currentProgramId;
  }

  /**
   * 現在のプログラム
   */
  get currentProgram() {
    return this.#eventPlans.program[this.#currentProgramId];
  }

  /**
   * 当選者の表示設定
   */
  get displaySetting() {
    return this.#displaySetting;
  }
  /**
   * 候補者リスト
   */
  get candidates() {
    return this.#candidates;
  }

  /**
   * プログラムを次に進める
   */
  next() {
    this.#currentProgramId = Math.min(
      this.#currentProgramId + 1,
      this.#currentProgramId - 1,
    );

    if (this.currentProgram.type === "PRIZE") {
      const prize_name = this.currentProgram.prize_name;
      const winner_number = this.currentProgram.winner_number;
      const winners = this.#lotteryBox.draw(prize_name, winner_number);
      this.#currentWinners = winners;
      this.#winnerList[this.#currentProgramId] = winners.map((c) => c.id);
    } else {
      this.#currentWinners = [];
      this.#winnerList[this.#currentProgramId] = [];
    }
  }

  /**
   * 現在のプログラムの当選者
   */
  get currentWinners() {
    return this.#currentWinners;
  }

  /**
   * @returns 次のプログラムがあるかどうか
   */
  hasNext(): boolean {
    return this.#currentProgramId < this.#eventPlans.program.length - 1;
  }
}
