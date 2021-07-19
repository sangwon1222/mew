import { Button } from '../Common/Button';
import gsap from 'gsap';
import { WordsPlay } from '@/Mew/scenes/WordsPlay';
import { ResourceManager } from '@/Mew/Core/ResourceManager';

export class Card extends Button{

    private mPicture: PIXI.Sprite
    private mNormal: PIXI.Texture

    private mID: number
    get idx(): number {return this.mID}

    get picture(): PIXI.Sprite {return this.mPicture}

    constructor(normal: PIXI.Texture, down?: PIXI.Texture ,over?: PIXI.Texture ,  delay?: number , id?: number){
        super( normal, down ,over)

        this.mID = id;
        this.mNormal = normal;
        const mask = new PIXI.Graphics();
        mask.beginFill(0x0000,1)
        mask.drawRoundedRect(0, -3,this.width*0.903, this.height*0.87, 20)
        mask.endFill();
        this.addChild(mask)
        mask.pivot.set((this.width*0.903)/2, (this.height*0.87)/2)

        this.mPicture = new PIXI.Sprite(
            ResourceManager.Handle.getProductResource(WordsPlay.Handle.productName,`img_${ WordsPlay.Handle.quizList[ WordsPlay.Handle.randomIDXArray[this.mID] ] }.png`).texture
        );
        this.mPicture.anchor.set(0.5)
        this.mPicture.x = this.width
        this.addChild(this.mPicture)
        this.mPicture.mask = mask

        if(delay !=0 ){
            gsap.delayedCall(delay,()=>{
                gsap.to(this.mPicture,{x:0, duration:1})
            })
        }else{
            gsap.to(this.mPicture,{x:0, duration:1})
        }
        
        this.interactive = false;
    }
    nextQuiz(){
        gsap.to(this.mPicture ,{x:-this.width , duration:1})
    }

    correctMotion(): Promise<void>{
        return new Promise<void>( (resolve,reject)=>{
            
            this.texture = ResourceManager.Handle.getViewerResource(`wordsplay_card_correct.png`).texture
            
            const correctSound = ResourceManager.Handle.getCommonResource(`common_snd_correct.mp3`).sound
            correctSound.play();

            const correctIMG = new PIXI.Sprite( ResourceManager.Handle.getViewerResource(`wordsplay_correct_check.png`).texture)
            correctIMG.anchor.set(0.5)
            correctIMG.alpha=0;
            this.addChild(correctIMG)
            gsap.to(correctIMG,{alpha:1, duration:0.5})
            gsap.delayedCall(1,()=>{
                this.removeChild(correctIMG)
                this.texture = this.mNormal;
                resolve();
            })
        } )
        
    }
    wrongMotion(): Promise<void>{
        return new Promise<void>( (resolve,reject)=>{
            
            const wrongSound = ResourceManager.Handle.getViewerResource(`wp_4.mp3`).sound;
            wrongSound.play();
            this.texture = ResourceManager.Handle.getViewerResource(`wordsplay_card_wrong.png`).texture

            const wrongIMG = new PIXI.Sprite( ResourceManager.Handle.getViewerResource(`wordsplay_wrong_check.png`).texture)
            wrongIMG.anchor.set(0.5)
            wrongIMG.alpha=0;
            this.addChild(wrongIMG)
            gsap.to(wrongIMG,{alpha:1, duration:0.5})
            gsap.delayedCall(1,()=>{
                this.removeChild(wrongIMG)
                
                this.texture = this.mNormal;
                resolve();
            })    
        } )
        
    }
}