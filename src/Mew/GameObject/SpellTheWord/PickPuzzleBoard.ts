import {AlphabetAsset} from '../../GameObject/SpellTheWord/AlphabetAsset';
import * as Util from "../../Core/Util"
import {ResourceManager} from '../../Core/ResourceManager';
import gsap from 'gsap';

export class PickPuzzleBoard extends PIXI.Sprite {
    
    private xposAry: Array < number > ;
    private alphabetAry: Array< string >;
    private puzzleAry: Array < AlphabetAsset > ;
    private _isClick: boolean;

    constructor() {
        super();
        this.xposAry = [310, 530, 750, 970];
        this.alphabetAry = [];
        for(let i = 0; i < 26; i++ ) {
            const code = i + 97;
            const ap = String.fromCharCode(code);
            this.alphabetAry.push(ap);
        }
        // console.log(this.alphabetAry);
    }

    makePickPuzzle(answerAlphabet: string) {
        let testAry = [];
        testAry = this.setRandomAlphabetList( answerAlphabet );
        //testAry = this.shuffle(testAry);
        testAry = Util.shuffleArray(testAry);

        this.puzzleAry = [];
        let delayValue = 0.5;

        for (let i = 0; i < 4; i++) {
            const pz = new AlphabetAsset(testAry[i]);
            pz.anchor.set(0.5, 0.5);
            pz.x = this.xposAry[i] + 20;
            pz.y = 670;
            pz.alphabet = testAry[i];
            pz.setAnswerStyle();
            pz.on("pointerup", (evt) => {
                if(this._isClick) this.onPuzzleClick(pz);   
            });
            pz.alpha = 0;
            this.puzzleAry.push(pz);
            this.addChild(pz);

            gsap.to(pz, {
                alpha:1,
                x:this.xposAry[i],
                delay: delayValue,
                duration: delayValue
            }).eventCallback("onComplete", () => {
                pz.interactive = true;
                pz.buttonMode = true;
            });

            delayValue += 0.1;
        }

    }

    onPuzzleClick(param: AlphabetAsset) {
       //console.log(param.alphabet);
    }

    pickWrongAnswer( pz: AlphabetAsset) {
        // 오답인 경우 아래로 떨어지는 모션과 함께 remove한다.
        const snd = ResourceManager.Handle.getViewerResource('wm_4.mp3').sound
        snd.play();

        pz.interactive = false;
        gsap.to(pz, {
            angle:60,
            y: 1000,
            duration: 1
        }).eventCallback("onComplete", () => {
            this.removeChild(pz);
        });
    }

    pickAnswer( pz: AlphabetAsset) {

        const snd = ResourceManager.Handle.getViewerResource('wm_3.mp3').sound
        snd.play();

        const length = this.puzzleAry.length;
        for( let i = 0; i < length; i++) {
            const pza = this.puzzleAry[i];
            pza.interactive = false;
            if( pz == pza) {
                this.removeChild( pza );
            } else {
                gsap.to(pza, {
                    alpha:0,
                    duration: 1
                }).eventCallback("onComplete", () => {
                    this.removeChild(pza);
                });
            }
        }
    }

    set isClick(flag: boolean) {
        this._isClick = flag;
    }

    private setRandomAlphabetList( answerAlphabet: string): Array<any> {
    
        const tempAry = [ answerAlphabet ];
        let i = 0;
        while (i < 3) {
            const rnd  = this.alphabetAry[ Math.floor(Math.random() * 25)];
            const temp = tempAry.find( function (n) {
                return rnd === n;
            });
            if(!temp) {
                tempAry.push(rnd);
                i++;
            }  
        }
        return tempAry;
    }
}