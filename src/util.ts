export function loadMusic(src:string){
    const music:HTMLAudioElement = document.createElement("audio");
    music.src=src;
    music.autoplay = false
    console.log(music);
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