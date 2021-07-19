import {ResourceManager} from '../../Core/ResourceManager';
import gsap from 'gsap';
import {Sine} from 'gsap';

export class NoteCharacter extends PIXI.Sprite {

    private _colors = ["red", "orange", "yellow", "green", "blue", "navy", "purple"];
    private _movePositions = [{
            'start': [540, 0],
            'end': [0, 1000]
        },
        {
            'start': [610, 0],
            'end': [444, 1000]
        },
        {
            'start': [676, 0],
            'end': [830, 1000]
        },
        {
            'start': [746, 0],
            'end': [1270, 1000]
        }
    ];

    // const buttonPos = [188, 484, 798, 1094] // 628;
    //
    private _track: number;
    private _spine: PIXI.spine.Spine;
    private _noteTimeLine: gsap.core.Timeline;

    constructor(track: number) {
        super();

        this._track = track;
        const rndColor = Math.floor(Math.random() * 7);
        this._spine = new PIXI.spine.Spine(ResourceManager.Handle.getViewerResource("ptb_" + this._colors[rndColor] + ".json").spineData);
        this._spine.state.timeScale = 1.5;

        this.scale.set(0.05, 0.05);

        const animationName = "running_" + this._colors[rndColor];
        this._spine.state.setAnimation(0, animationName, true);

        const stx = this._movePositions[track].start[0];
        const sty = this._movePositions[track].start[1];
        this.anchor.set(0.5, 0.5);
        this.position.set(stx, sty);
        this.addChild(this._spine);


        gsap.to(this.scale, {
            x: 0.5,
            y: 0.5,
            duration: 5
        });

        this._noteTimeLine = gsap.timeline();
        this._noteTimeLine.to(this, {
            ease: Sine.easeIn,
            x: this._movePositions[track].end[0],
            y: this._movePositions[track].end[1],
            duration: 5
        });

        this._noteTimeLine.eventCallback("onComplete", () => {
            this.noteOutRange(this);
        });

        this._noteTimeLine.eventCallback("onUpdate", () => {
            if (this.y >= 560) {
                this.noteInRange(this);
                this._noteTimeLine.eventCallback("onUpdate", null);
            }
        });
    }

    noteOutRange(note: NoteCharacter) {
        //
    }


    noteInRange(note: NoteCharacter) {
        //
    }

    removeNoteCharacter() {

        this.parent.removeChild(this);
        gsap.killTweensOf(this);
    }

    get track(): number {
        return this._track;
    }
}