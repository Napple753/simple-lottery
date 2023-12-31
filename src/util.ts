import { Log, Candidate } from './myTypes'
import Encoding from 'encoding-japanese';

export function loadMusic(src:string){
    const music:HTMLAudioElement = document.createElement("audio");
    music.src=src;
    music.autoplay = false;
    document.body.appendChild(music);

    return music;
}

export function shuffleArray<T=any>(source0:T[]):T[]{
    const source = [...source0]
    const shuffled = [];
    for(let i=source.length;i>0;i--){
      shuffled.push(source.splice(Math.floor(i*Math.random()),1)[0])
    }
    return shuffled
}

export function getDummyList(source0:Candidate[], count:number, winner:Candidate){
    function getLongerDummyList(source0:Candidate[], count:number, winner:Candidate):Candidate[]{
        if((source0.length-1) < count){
            let dummyList:Candidate[] = [];
            while(dummyList.length < (count - (source0.length-1))){
                dummyList = dummyList.concat(shuffleArray<Candidate>(source0))
            }
            return dummyList.concat(getLongerDummyList(source0, source0.length - 1, winner));
        }
        return shuffleArray<Candidate>(source0.filter(p=>p.id!==winner.id)).slice(0,count); 
    }

    const longerList = getLongerDummyList(source0, count, winner);
    return longerList.slice(-count)
}

export function wait(time:number){
    return new Promise((resolve)=>setTimeout(resolve,time));
}

export class LotteryBox{
    #notSelected:Candidate[]
    #candidates:Candidate[]

    #log:Log<Candidate> = [];

    constructor(candidates:Candidate[]){
        this.#candidates = [...candidates];
        this.#notSelected = [...this.#candidates];
    }

    draw(prizeName:string,count:number){
        const selected = this.#drawMany(count);
        this.#log.push({
            prizeName,
            selected,
            timestamp:Date.now()
        });
        return selected;
    }

    #drawMany(count:number):Candidate[]{
        if(count>this.#candidates.length){
            const shuffled = shuffleArray(this.#candidates);
            return shuffled.concat(this.#drawMany(count - this.#candidates.length))
        }
        const selected:Candidate[] = [];
        for(let i=0;i<count;i++){
            selected.push(this.#drawOne(selected));
        }
        return selected;
    }

    get log():Log<Candidate>{
        return JSON.parse(JSON.stringify(this.#log));
    }

    #drawOne(selected:Candidate[]):Candidate{
        if(this.#notSelected.length==0){
            this.#notSelected = [...this.#candidates];
        }
        const pickedId = Math.floor(Math.random()*this.#notSelected.length);
        if(selected.map(c=>c.id).includes(this.#notSelected[pickedId].id)){
            return this.#drawOne(selected);
        }
        return this.#notSelected.splice(pickedId,1)[0];
    }
}

export function readAnyEncoding(reader:FileReader):string{
    let array:Uint8Array|Uint16Array|Uint32Array = new Uint8Array(reader.result as any);

    // 文字コードを取得
    switch (Encoding.detect(array)) {
      case 'UTF16':
          // 16ビット符号なし整数値配列と見なす
          array = new Uint16Array(reader.result as any);
          break;
      case 'UTF32':
          // 32ビット符号なし整数値配列と見なす
          array = new Uint32Array(reader.result as any);
          break;
    }

    // Unicodeの数値配列に変換
    var unicodeArray = Encoding.convert(array, 'UNICODE');
    // Unicodeの数値配列を文字列に変換
    return Encoding.codeToString(unicodeArray);
}