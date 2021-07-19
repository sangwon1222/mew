import {
    ResourceManager
} from '../../Core/ResourceManager';
import {
    AlphabetAsset
} from './AlphabetAsset';
import Config from '../../Config';
import gsap from 'gsap';

export class WordBoard extends PIXI.Sprite {
    private wordExBg: PIXI.NineSlicePlane;
    private puzzleAry: Array < AlphabetAsset > ;
    private puzzleYpos: number;
    private brokenPuzzleAry: Array < number > ;

    private _firstStart: boolean;

    constructor() {
        super();
        this.wordExBg = new PIXI.NineSlicePlane(ResourceManager.Handle.getViewerResource("word_ex_bg.png").texture, 30, 0, 30, 0);
        this.addChild(this.wordExBg);
        this.puzzleYpos = 60;
        this._firstStart = true; // HowTo가 끝나고 퍼즐이 부숴지는 효과를 주기 위한 flag
    }

    makeWord(word: string, step: number) {

        this.removePuzzle();
        this.puzzleAry = [];
        const wordAry: Array < string > = word.split("");

        this.brokenPuzzleAry = [];
        const length = wordAry.length;
        let xpos = 68;
        const tileSize = 108;
        let mWidth = 0;
  
        for (let i = 0; i < length; i++) {

            const puzzle = new AlphabetAsset(wordAry[i]);
            puzzle.alphabet = wordAry[i];
            puzzle.x = xpos;
            puzzle.y = this.puzzleYpos;
            xpos += tileSize;
            if (i == length - 1) mWidth = tileSize * (i + 1) + 30;
            this.puzzleAry.push(puzzle);
            this.addChild(puzzle);
        }
        this.wordExBg.width = mWidth;
        this.parent.parent.y = 350;
        this.parent.parent.x = Config.app.width / 2 - this.parent.width / 2;
    
       this.setMultiRandomValue(step, length);
    }

    // needNumber : 필요한 랜덤 수
    // range : 랜덤 범위
    // setMultiRandomValue(2, 10) -> 10개의 스페링으로 된 단어에서 랜덤으로 부술 단어 2개를 지정.
    private setMultiRandomValue(needNumber: number, range: number) {
        if (needNumber > range) needNumber = range;

        let cnt = 0;
        let flag: boolean;
        while (cnt < needNumber) {
            flag = true;
            const rnd = Math.floor(Math.random() * range);

            for (let i = 0; i < this.brokenPuzzleAry.length; i++) {
                if (this.brokenPuzzleAry[i] == rnd) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                this.brokenPuzzleAry.push(rnd);
                cnt++;

            }
        }

        // 오름차순으로 정렬
        this.brokenPuzzleAry.sort(function (a, b) {
            return a - b;
        });
       // console.log(this.brokenPuzzleAry);

        if(!this._firstStart) {
            this.playBrokenPuzzle();
        }
    }

    playBrokenPuzzle(){
        gsap.delayedCall(1, () => {this.setBrokenAnimation();});
        gsap.delayedCall(1, () => {this.setPuzzleStyle(0);});
    }

    private setBrokenAnimation() {

        const length = this.brokenPuzzleAry.length;
        let cnt = 0;

        const snd = ResourceManager.Handle.getViewerResource('wm_6.mp3').sound
        snd.play();

        for (let i = 0; i < length; i++) {
            const pz = this.getPuzzle(this.brokenPuzzleAry[i]);
            const ani = new PIXI.spine.Spine(ResourceManager.Handle.getViewerResource("spell_particle.json").spineData);
            ani.scale.set(0.617);
            ani.x = pz.x;
            ani.y = pz.y;
            ani.state.setAnimation(0, "particle", false);
            this.addChild(ani);

            ani.state.addListener({
                complete: (trackIndex: PIXI.spine.core.TrackEntry) => {
                    setTimeout(() => {     
                        cnt++;
                        ani.removeAllListeners();
                        ani.parent.removeChild(ani);
                        if(cnt == length) this.animationFinish();
                    });
                }
            });
        }
    }

    private setPuzzleStyle(index: number) {

        const length = this.brokenPuzzleAry.length;

        for (let i = 0; i < length; i++) {
            if (i == index) {
                this.getPuzzle(this.brokenPuzzleAry[i]).setCurrentStyle();
            } else if (i < index) {
                this.getPuzzle(this.brokenPuzzleAry[i]).setNormalStyle();
            } else {
                this.getPuzzle(this.brokenPuzzleAry[i]).setNextStyle();
            }
        }
    }

    private removePuzzle() {
        if (this.puzzleAry) {
            const length = this.puzzleAry.length;
            for (let i = 0; i < length; i++) {
                this.removeChild(this.puzzleAry[i]);
            }
        }
    }

    getPuzzleXpos(index: number): number {
        const asset: AlphabetAsset = this.puzzleAry[index];
        return asset.x;
    }

    getPuzzleYpos(): number {
        return this.puzzleYpos;
    }

    getPuzzle(index: number): AlphabetAsset {
        const asset: AlphabetAsset = this.puzzleAry[index];
        return asset;
    }

    getBrokenPuzzleIndex(index: number): number {
        const brokenIndex = this.brokenPuzzleAry[index];
        //console.log('brkonIndex = %d', brokenIndex);
        return brokenIndex;
    }

    set firstStart( flag: boolean ) {
        this._firstStart = flag;
    }

    playEmphasizeAnimation() {
        if (this.puzzleAry) {
            const length = this.puzzleAry.length;
            for (let i = 0; i < length; i++) {
                const asset: AlphabetAsset = this.puzzleAry[i];
                asset.setAnimation();
            }
        }
    }

    pickAnswer(index: number) {
        this.setPuzzleStyle(index);
    }

    animationFinish() {
        //overload
    }
}