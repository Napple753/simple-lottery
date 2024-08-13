const ENABLE_PARTY_LOG = false;

import { digestMessage } from "@/logic/digestMessage";
import { Candidate, DisplaySetting, WinnerLog } from "@/myTypes";
import { PartyPlans, PartyLog } from "@/Schema";

export class PartyLogControl {
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
    if (!ENABLE_PARTY_LOG) return;
    localStorage.setItem(this.#partyId, JSON.stringify(this.partyLog));
  }

  updatePartyIds() {
    if (!ENABLE_PARTY_LOG) return;
    const partyIdLogs = PartyLogControl.getSavedPartyList();
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
    if (!ENABLE_PARTY_LOG) return;
    localStorage.removeItem(this.#partyId);
    const partyIdLogs = PartyLogControl.getSavedPartyList();
    const newPartyIdLogs = partyIdLogs.filter(
      (partyIdLog) => partyIdLog.partyId !== this.#partyId,
    );
    localStorage.setItem("partyIdLogs", JSON.stringify(newPartyIdLogs));
  }

  static getSavedPartyList(): PartyLog[] {
    if (!ENABLE_PARTY_LOG) return [];
    return (
      JSON.parse(localStorage.getItem("partyIdLogs") || "[]") as PartyLog[]
    ).sort((a, b) => b.startDateTS - a.startDateTS);
  }
}
