import { ResourceManager } from '@/Mew/Core/ResourceManager'
import { Button } from '../Common/Button'
import { Home } from '@/Mew/scenes/Home'
import { ListeningGame } from '@/Mew/scenes/ListeningGame'
import gsap from 'gsap'
import PIXISound from 'pixi-sound'


const style = new PIXI.TextStyle({
    fontFamily: 'Bpreplay',
    fontSize: 48*0.67,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: '0x0000' , 
    dropShadow: true,
});

export class Answer extends PIXI.Container{
    
    private mBG: PIXI.NineSlicePlane
    private mAnswerText: PIXI.Text

    constructor(answer: string ){
        super()
        
        this.mAnswerText = new PIXI.Text(answer,style)
        this.addChild(this.mAnswerText)
        this.mAnswerText.alpha =0;
        
        this.mBG = new PIXI.NineSlicePlane(
            ResourceManager.Handle.getViewerResource(`img_blank.png`).texture,
            50,
            0,
            50,
            0
            )
        this.mBG.width = this.mAnswerText.width
        this.addChild(this.mBG)

        const mark = new PIXI.Sprite( ResourceManager.Handle.getViewerResource(`img_blank_q.png`).texture )
        mark.anchor.set(0.5)
        mark.position.set(this.mBG.width/2,this.mBG.height/2)
        this.mBG.addChild(mark)
        
        // const debug = new PIXI.Graphics();
        // debug.lineStyle(2,0x0000,1)
        // debug.drawRect(0,0,this.width, this.height)
        // debug.endFill()
        // this.addChild(debug)
    }
    correct(){
        gsap.to(this.mBG,{alpha:0 , duration:0.5})
        .eventCallback("onComplete",()=>{
            gsap.to(this.mAnswerText,{alpha:1 , duration:0.5})
        })
    }
}

export class QuizBox extends PIXI.Container{

    private mBG: PIXI.Sprite
    private mTextBox: PIXI.Container;
    private mSoundButton: Button;
    private mSound: PIXI.sound.Sound

    private mAnserText: Answer;

    constructor(){
        super()

        this.mBG = new PIXI.Sprite(ResourceManager.Handle.getViewerResource(`img_qbox.png`).texture )
        this.addChild(this.mBG)

        this.mTextBox = new PIXI.Container();
        
        this.mSound = ResourceManager.Handle.getProductResource(
            ListeningGame.Handle.productName,
            `sb_${ListeningGame.Handle.productName.slice(1)}_${ListeningGame.Handle.quizData[0].idx}.mp3`
            // ListeningGame.Handle.quizData[0].sound
            ).sound;

        this.mSoundButton = new Button(
            ResourceManager.Handle.getCommonResource(`common_btn_speaker_normal.png`).texture,
            ResourceManager.Handle.getCommonResource(`common_btn_speaker_down.png`).texture,
            ResourceManager.Handle.getCommonResource(`common_btn_speaker_over.png`).texture,
        )
        this.mSoundButton.position.set(this.mBG.width*0.9 , this.mBG.height*0.65)
        this.mBG.addChild(this.mSoundButton)

        this.mSoundButton.onClick=()=>{
            this.onSound();
        }

        this.resetQuiz();

        this.pivot.set(this.width/2,this.height/2)
    }

    onSound(correct?: boolean): Promise<void>{
        return new Promise<void>((resolve , reject)=>{
            if(!correct)ListeningGame.Handle.stone.banClickStone(this.mSound.duration);
            
            this.mSound.stop();
            this.mSound = ResourceManager.Handle.getProductResource(ListeningGame.Handle.productName,`sb_${ListeningGame.Handle.productName.slice(1)}_${ListeningGame.Handle.quizData[0].idx}.mp3`).sound;
            this.mSoundButton.interactive = false;
            this.mSoundButton.buttonMode  = false;

            this.mSoundButton.wrongMotion(ResourceManager.Handle.getCommonResource(`common_btn_speaker_down.png`).texture)
            this.mSound.play();

            gsap.delayedCall(this.mSound.duration,()=>{
                this.mSoundButton.correctMotion(ResourceManager.Handle.getCommonResource(`common_btn_speaker_normal.png`).texture)
                this.mSoundButton.interactive = true;
                this.mSoundButton.buttonMode  = true;
                resolve();
            })
        })
        
    }

    correct(): Promise<void>{
        return new Promise<void> ((resolve, reject)=>{
            this.onSound(true);
            gsap.delayedCall(this.mSound.duration,()=>{
                this.mAnserText.correct();
                resolve();
            })
        })
        
    }

    resetQuiz(){
        this.mTextBox.removeChildren();
        const textData = ListeningGame.Handle.quizData[0].text; 
        const answerData = ListeningGame.Handle.quizData[0].answer; 
        
        const startText = textData.split("_")[0]
        const endText = textData.split("_")[1]

        this.mAnserText = new Answer(answerData)
        if(startText){
            const text1 = new PIXI.Text(startText , style)
            this.mAnserText.x = text1.width;    
            this.mTextBox.addChild(text1)
        }

        this.mTextBox.addChild(this.mAnserText)

        if(endText){
            const text2 = new PIXI.Text(endText , style)
            text2.x = this.mAnserText.x + this.mAnserText.width;
            this.mTextBox.addChild(text2)
        }

        this.mTextBox.pivot.set(this.mTextBox.width/2,this.mTextBox.height/2)
        this.mTextBox.position.set(this.mBG.width/2 , this.mBG.height*0.65)
        this.addChild(this.mTextBox)

    }
}