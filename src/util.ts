import { log } from './myTypes'
import Encoding from 'encoding-japanese';

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

export function readAnyEncoding(reader:FileReader):string{
    let array:Uint8Array|Uint16Array|Uint32Array = new Uint8Array(reader.result);

    // 文字コードを取得
    switch (Encoding.detect(array)) {
      case 'UTF16':
          // 16ビット符号なし整数値配列と見なす
          array = new Uint16Array(reader.result);
          break;
      case 'UTF32':
          // 32ビット符号なし整数値配列と見なす
          array = new Uint32Array(reader.result);
          break;
    }

    // Unicodeの数値配列に変換
    var unicodeArray = Encoding.convert(array, 'UNICODE');
    // Unicodeの数値配列を文字列に変換
    return Encoding.codeToString(unicodeArray);
}