import {ResourceManager} from '../../Core/ResourceManager';
import gsap from 'gsap';

export class TrackAsset extends PIXI.Sprite {

    private _index: number;
    private _trackTextureDown: PIXI.Texture;
    private _trackTextureCorrect: PIXI.Texture;

    private _trackCorrectSpr: PIXI.Sprite;
    private _trackDownSpr: PIXI.Sprite;

    constructor($index: number) {
        super();
        this._trackCorrectSpr = new PIXI.Sprite();
        this._trackDownSpr = new PIXI.Sprite();

        const trackPos = [0, 282, 642, 704];
        this._index = $index;
        this._trackTextureDown = ResourceManager.Handle.getViewerResource("track_0" + ($index + 1) as string + "_down.png").texture;
        this._trackTextureCorrect = ResourceManager.Handle.getViewerResource("track_0" + ($index + 1) as string + "_correct.png").texture;
        this.position.set(trackPos[this._index], 0);

        this.addChild(this._trackDownSpr);
        this.addChild(this._trackCorrectSpr);

        this._trackCorrectSpr.texture = this._trackTextureCorrect;
        this._trackCorrectSpr.renderable = false;

    }

    onKeyDown() {
        this._trackDownSpr.texture = this._trackTextureDown;
    }

    onKeyUp() {
        this._trackDownSpr.texture = null;
    }

    onKeyCorrect() {
        this._trackCorrectSpr.renderable = true;
        gsap.delayedCall(0.3, () => {
            this._trackCorrectSpr.renderable = false

        })
    }

    get index() {
        return this._index;
    }
}