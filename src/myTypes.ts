export type Candidate = {
    id:number,
    data:string[]
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

export function isPrize(arg:any): arg is Prize{
    return arg!==null
        && typeof arg === "object"
        && arg.type === "PRIZE"
        && typeof arg.prize_name === "string"
        && (typeof arg.img === "string" || arg.img === undefined)
        && typeof arg.winner_number === "number"
        && Number.isInteger(arg.winner_number)
}

export interface Message extends ProgramBase{
    type:"MESSAGE",
    message:string
}
export function isMessage(arg:any): arg is Message{
    return arg!==null
        && typeof arg === "object"
        && arg.type === "MESSAGE"
        && typeof arg.message === "string"
}

export interface DisplayWinner extends ProgramBase{
    type:"DISPLAY_WINNERS"
}
export function isDisplayWinner(arg:any): arg is DisplayWinner{
    return arg!==null
        && typeof arg === "object"
        && arg.type === "DISPLAY_WINNERS"
}

export type Program = Prize|Message|DisplayWinner;

export function isProgram(arg:any): arg is Program{
    return isPrize(arg) || isMessage(arg) || isDisplayWinner(arg);
}

export type Settings = {
    program_name:string,
    program:Program[]
}
export function isSettings(arg:any): arg is Settings{
    return arg!==null
        && typeof arg === "object"
        && typeof arg.program_name === "string"
        && Array.isArray(arg.program)
        && arg.program.every(p=>isProgram(p))
}

export type Log<T> = {
    prizeName:string,
    selected:T[]
    timestamp:number,
}[];

export type DisplaySetting = {
    top_pos:number,
    main_pos:number,
    bottom_pos:number,
}