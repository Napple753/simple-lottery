export type Person = {
    name:string,
    ruby:string,
    id:string
}

export interface ProgramBase {
    type:string
}

export interface Prize extends ProgramBase{
    type:"PRIZE",
    prize_name:string,
    img?:string,
    winner_number:number
}

export interface Message extends ProgramBase{
    type:"MESSAGE",
    message:string
}

export interface DisplayWinner extends ProgramBase{
    type:"DISPLAY_WINNERS"
}

export type Program = Prize|Message|DisplayWinner;