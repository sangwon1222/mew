import { ResourceManager } from '../../Core/ResourceManager';
import gsap from 'gsap';
import Config from '../../Config'
import { App } from '@/Mew/Core/App';
import { Outro } from './Outro';
import { SceneBase } from '@/Mew/Core/SceneBase';

export class Video extends PIXI.Container{

    private mVideo: HTMLVideoElement;
    private mVideoSprite: PIXI.Sprite;
    get videoElement(): HTMLVideoElement{ return this.mVideo }
    
    constructor(product: string , video: string){
        super();
        
        /**초기화*/
        this.mVideo = ResourceManager.Handle.getProductResource( product , video ).data ;
        App.Handle.videoStop.push(this.mVideo);

        const cbCanPlay=()=>{
            this.mVideo.play();
            gsap.delayedCall( 0.1,()=>{
                this.mVideo.currentTime = 0;
                this.mVideo.pause();
            });
            this.mVideo.removeEventListener("canplay", cbCanPlay)
        }
        this.mVideo.addEventListener( "canplay", cbCanPlay);
        
        this.mVideoSprite = new PIXI.Sprite();
        this.mVideoSprite.texture = PIXI.Texture.from( this.mVideo );
        
        this.mVideoSprite.scale.set( Config.app.videoScale)

        this.addChild(this.mVideoSprite)

        this.createVideo();
            
    }

    createVideo(){
        this.mVideo.currentTime = 0;
        this.mVideo.pause();
        this.mVideo.onended = async ()=>{
            // this.mVideo.currentTime=0;
            // this.play();
            // console.log(this.parent);
            (this.parent as SceneBase).onEnd();
            const outro = new Outro();
            this.addChild(outro)
            await outro.outro();
        }
    }

    play(){
        this.mVideo.play();
        App.Handle.videoStop.push( this.mVideo )
    }

    pause(){
        this.mVideo.pause();
    }

    
}
