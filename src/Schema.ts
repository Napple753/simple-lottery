import { z } from "zod";

export const ProgramBase = z.object({
  type: z.string(),
});

export const Prize = ProgramBase.merge(
  z.object({
    type: z.literal("PRIZE"),
    prize_name: z.string(),
    img: z.string().optional(),
    winner_number: z.number(),
  }),
);
export type Prize = z.infer<typeof Prize>;

export const Message = ProgramBase.merge(
  z.object({
    type: z.literal("MESSAGE"),
    message: z.string({ invalid_type_error: "Message must be a string." }),
  }),
);
export type Message = z.infer<typeof Message>;

export const DisplayWinner = ProgramBase.merge(
  z.object({
    type: z.literal("DISPLAY_WINNERS"),
  }),
);
export type DisplayWinner = z.infer<typeof DisplayWinner>;

export const Program = z.union([Prize, Message, DisplayWinner]);
export type Program = z.infer<typeof Program>;

export const PartyPlans = z.object({
  program_name: z.string(),
  program: z.array(Program),
});
export type PartyPlans = z.infer<typeof PartyPlans>;

export const PartyLog = z.object({
  partyId: z.string(),
  partyName: z.string(),
  startDateTS: z.number(),
});
export type PartyLog = z.infer<typeof PartyLog>;
