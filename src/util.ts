import { log } from './myTypes'

export function loadMusic(src:string){
    const music:HTMLAudioElement = document.createElement("audio");
    music.src=src;
    music.autoplay = false;
    document.body.appendChild(music);

    return music;
}

export function shuffleArray(source0:any[]):any[]{
    const source = [...source0]
    const shuffled = [];
    for(let i=source.length;i>0;i--){
      shuffled.push(source.splice(Math.floor(i*Math.random()),1)[0])
    }
    return shuffled
}

export function wait(time:number){
    return new Promise((resolve)=>setTimeout(resolve,time));
}

export class LotteryBox<T>{
    #notSelected:T[]
    #candidates:T[]

    #log:log<T> = [];

    constructor(candidates:T[]){
        this.#candidates = [...candidates];
        this.#notSelected = [...this.#candidates];
    }

    draw(prizeName:string,count:number){
        const selected:T[] = [];
        for(let i=0;i<count;i++){
            selected.push(this.#drawOne(selected));
        }
        this.#log.push({
            prizeName,
            selected,
            timestamp:Date.now()
        });
        console.log(this.#log)
        return selected;
    }

    get log():log<T>{
        return JSON.parse(JSON.stringify(this.#log));
    }

    #drawOne(selected:T[]):T{
        if(this.#notSelected.length==0){
            this.#notSelected = [...this.#candidates];
        }
        const pickedId = Math.floor(Math.random()*this.#notSelected.length);
        if(selected.includes(this.#notSelected[pickedId])){
            return this.#drawOne(selected);
        }
        return this.#notSelected.splice(pickedId,1)[0];
    }
}