export const en = {
  "app-short-name": "SEDERHANA",
  "app-description":
    "Simple Event Drawing Engine for Reliable and Honest Awarding with No Ambiguity",
  "load-party-plan": "Load Party Plan",
  "load-candidate-list": "Load candidate list",
  "execute-drawing": "Execute drawing",
  "party-plan-file": "Party Plan file(.json/.jsonc) and optional images",
  "or-you-can": "Or you can ",
  "use-sample": "use sample file",
  "download-sample": "download sample file",
  "candidate-list-file": "Candidate list file(.csv)",
  "winner-s": "Winner(s)",
  "list-up-winners": "List up winners",
  next: "Next",
  "use-csv-header": "Use CSV header",
  "n-loaded": "{count} loaded",
  "display-order": "Display order",
  "display-sample": "Display sample",
  "start-drawing": "Start drawing",
  "winners-so-far": "Winners so far",
  "prize-won": "Prize won",
  "winning-datetime": "Winning datetime",
  "is-cancelled": "is cancelled",
  "end-message": "End",
  "another-party": "Reset and draw for another party",
  "save-winners-csv": "Save winners CSV",
  "plan-file-invalid": "Party plan file is invalid.",
  "time-before-first-winner-s": "Drawing time[s]",
  "time-between-winners-s": "Interval[s]",
  "before-leave": "Are you sure you want to leave this page?",

  redraw: "Redraw",
  "redraw-confirmation":
    "Are you sure you want to cancel this winner and redraw?",
  "keep-winner": "Keep this winner",

  "candidates-less-than-winners": `The number of candidates is less than the number of "{prizeName}" winners.`,

  "plan-file-needed": "A party plan file is needed.",
  "plan-file-must-be-only-one":
    "Only one party plan file can be loaded at a time.",
};

export type message_list = Partial<typeof en>;
