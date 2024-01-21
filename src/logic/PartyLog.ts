import { digestMessage } from "../logic/digestMessage";
import { PartyPlans, Candidate, DisplaySetting, WinnerLog } from "../myTypes";

export class PartyLog {
  #partyId: string;
  #partyPlans: PartyPlans;
  #hashedCandidates!: string;
  #displaySetting: DisplaySetting;
  #winnerIds: WinnerLog<number>[];
  #currentProgramId: number;

  constructor(
    partyId: string,
    partyPlans: PartyPlans,
    candidates: Candidate[],
    displaySetting: DisplaySetting,
  ) {
    this.#partyId = partyId;
    this.#partyPlans = partyPlans;
    digestMessage(JSON.stringify(candidates)).then(
      (hashedCandidates) => (this.#hashedCandidates = hashedCandidates),
    );
    this.#displaySetting = displaySetting;
    this.#winnerIds = [];
    this.#currentProgramId = 0;
    this.saveToLocalStorage();
    this.updatePartyIds();
  }

  set winnerIds(winnerIds: WinnerLog<number>[]) {
    this.#winnerIds = winnerIds;
  }

  set currentProgramId(currentProgramId: number) {
    this.#currentProgramId = currentProgramId;
  }

  get partyLog() {
    return {
      partyId: this.#partyId,
      partyPlans: this.#partyPlans,
      hashedCandidates: this.#hashedCandidates,
      displaySetting: this.#displaySetting,
      winnerIds: this.#winnerIds,
      currentProgramId: this.#currentProgramId,
    };
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#partyId, JSON.stringify(this.partyLog));
  }

  updatePartyIds() {
    const partyIdLogs: {
      partyId: string;
      partyName: string;
      startDateTS: number;
    }[] = JSON.parse(localStorage.getItem("partyIdLogs") || "[]");
    const lastLog = partyIdLogs.find(
      (partyIdLog) => partyIdLog.partyId === this.#partyId,
    );
    if (lastLog) return;
    partyIdLogs.push({
      partyId: this.#partyId,
      partyName: this.#partyPlans.program_name,
      startDateTS: Date.now(),
    });
    localStorage.setItem("partyIdLogs", JSON.stringify(partyIdLogs));
  }

  deleteFromLocalStorage() {
    localStorage.removeItem(this.#partyId);
    const partyIdLogs: {
      partyId: string;
      partyName: string;
      startDateTS: number;
    }[] = JSON.parse(localStorage.getItem("partyIdLogs") || "[]");
    const newPartyIdLogs = partyIdLogs.filter(
      (partyIdLog) => partyIdLog.partyId !== this.#partyId,
    );
    localStorage.setItem("partyIdLogs", JSON.stringify(newPartyIdLogs));
  }
}
