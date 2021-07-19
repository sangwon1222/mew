import { ResourceManager } from '../../Core/ResourceManager';
import { Button } from '../Common/Button';
import { Splash } from '../Common/Splash';
import { Home } from '../../scenes/Home';
import { WordsPlay } from '../../scenes/WordsPlay';
import gsap from 'gsap';

const style = new PIXI.TextStyle({
    fontFamily: 'Bpreplay',
    fontSize: 48*0.67,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: '0x0000' , 
    dropShadow: true,
});

export class AirPlane extends PIXI.Container{

    private mQuizTag: PIXI.Sprite;
    
    private mSoundButton: Button;
    private mRandomArray: Array<number>
    private mQuizList: any;

    constructor(data: any){
        super();

        /**비행기 위치모션은 스파인이 아니라 WORDS TO PLAY에 있음 */

        this.mRandomArray = WordsPlay.Handle.randomIDXArray;
        this.mQuizList = data;

        this.mQuizTag = new PIXI.Sprite(ResourceManager.Handle.getViewerResource(`wordsplay_word_box.png`).texture )
        this.addChild(this.mQuizTag)

        /**CREATE SOUNDBUTTON */
        this.mSoundButton = new Button(
            ResourceManager.Handle.getCommonResource(`common_btn_speaker_normal.png`).texture,
            ResourceManager.Handle.getCommonResource(`common_btn_speaker_down.png`).texture,
            ResourceManager.Handle.getCommonResource(`common_btn_speaker_over.png`).texture,
        )
        this.mQuizTag.addChild(this.mSoundButton)        
        this.mSoundButton.position.set(this.mQuizTag.width*0.8,this.mQuizTag.height/2);

        this.mSoundButton.onClick=()=>{
            this.soundOn();
        }

        this.createAirPlane()
        this.createCurrentText()
        // Util.lineGuide(this)
    }
    createAirPlane(){
        const airPlane = new Splash(ResourceManager.Handle.getViewerResource(`common_plane.json`).spineData ,`play` ,true )
        this.mQuizTag.addChild(airPlane)
        airPlane.start();
        airPlane.position.set( -airPlane.width*0.6 , this.mQuizTag.height/2)

        this.pivot.set(this.width/2  , this.height/2)
        this.mQuizTag.position.set(airPlane.width/2  , 0)
    }

    createCurrentText(){
        const text = new PIXI.Text(  
            this.mQuizList[ this.mRandomArray[0] ],
            style  
            )
        this.mQuizTag.addChild(text)
        text.anchor.set(0.5)
        text.position.set(this.mQuizTag.width/2 , this.mQuizTag.height/2)
    }

    soundOn(): Promise<void>{
        return new Promise<void>((resolve,reject)=>{
            this.mSoundButton.interactive = false;
            this.mSoundButton.buttonMode  = false;

            this.mSoundButton.wrongMotion(ResourceManager.Handle.getCommonResource(`common_btn_speaker_down.png`).texture);
            const wordSound = ResourceManager.Handle.getProductResource(
                    Home.Handle.productName,`wd_${WordsPlay.Handle.productName.slice(1)}_${[ this.mRandomArray[0] +1] }.mp3`
                    ).sound;
            wordSound.play();
            gsap.delayedCall(wordSound.duration,()=>{  
                this.mSoundButton.correctMotion(ResourceManager.Handle.getCommonResource(`common_btn_speaker_normal.png`).texture);

                this.mSoundButton.interactive = true;  
                this.mSoundButton.buttonMode  = true;
                resolve();
            })
        })
    }

}