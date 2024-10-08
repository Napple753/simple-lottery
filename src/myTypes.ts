export type CandidateId = number;

export type Candidate = {
  id: CandidateId;
  data: string[];
};

// export interface ProgramBase {
//   type: string;
// }

// export interface Prize extends ProgramBase {
//   type: "PRIZE";
//   prize_name: string;
//   img?: string;
//   winner_number: number;
// }

// // eslint-disable-next-line
// export function isPrize(arg: any): arg is Prize {
//   return (
//     arg !== null &&
//     typeof arg === "object" &&
//     arg.type === "PRIZE" &&
//     typeof arg.prize_name === "string" &&
//     (typeof arg.img === "string" || arg.img === undefined) &&
//     typeof arg.winner_number === "number" &&
//     Number.isInteger(arg.winner_number)
//   );
// }

// export interface Message extends ProgramBase {
//   type: "MESSAGE";
//   message: string;
// }

// // eslint-disable-next-line
// export function isMessage(arg: any): arg is Message {
//   return (
//     arg !== null &&
//     typeof arg === "object" &&
//     arg.type === "MESSAGE" &&
//     typeof arg.message === "string"
//   );
// }

// export interface DisplayWinner extends ProgramBase {
//   type: "DISPLAY_WINNERS";
// }

// // eslint-disable-next-line
// export function isDisplayWinner(arg: any): arg is DisplayWinner {
//   return (
//     arg !== null && typeof arg === "object" && arg.type === "DISPLAY_WINNERS"
//   );
// }

// export type Program = Prize | Message | DisplayWinner;

// // eslint-disable-next-line
// export function isProgram(arg: any): arg is Program {
//   return isPrize(arg) || isMessage(arg) || isDisplayWinner(arg);
// }

// export type PartyPlans = {
//   program_name: string;
//   program: Program[];
// };

// // eslint-disable-next-line
// export function isPartyPlans(arg: any): arg is PartyPlans {
//   return (
//     arg !== null &&
//     typeof arg === "object" &&
//     typeof arg.program_name === "string" &&
//     Array.isArray(arg.program) &&
//     arg.program.every((p: unknown) => isProgram(p))
//   );
// }

export type TimeStamp = number;

export type WinnerIdLog = {
  programId: number;
  prizeName: string;
  selected: { id: CandidateId; selectTS: TimeStamp; prizeName: string }[];
  cancelled: {
    id: CandidateId;
    selectTS: TimeStamp;
    cancelledTS: TimeStamp;
    prizeName: string;
  }[];
};

export type WinnerCandidateLog = {
  programId: number;
  prizeName: string;
  selected: { candidate: Candidate; selectTS: TimeStamp; prizeName: string }[];
  cancelled: {
    candidate: Candidate;
    selectTS: TimeStamp;
    cancelledTS: TimeStamp;
    prizeName: string;
  }[];
};

export type DisplaySetting = {
  top_pos: number | null;
  main_pos: number | null;
  bottom_pos: number | null;
};

// export type PartyLog = {
//   partyId: string;
//   partyName: string;
//   startDateTS: number;
// };

// // eslint-disable-next-line
// export function isPartyLog(arg: any): arg is PartyPlans {
//   return (
//     arg !== null &&
//     typeof arg === "object" &&
//     typeof arg.partyId === "string" &&
//     typeof arg.partyName === "string" &&
//     typeof arg.startDateTS === "number"
//   );
// }
