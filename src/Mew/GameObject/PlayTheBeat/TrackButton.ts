import {ResourceManager} from '../../Core/ResourceManager';
import {Splash} from '../../GameObject/Common/Splash';

export class TrackButton extends PIXI.Sprite {

    private _index: number;

    private _btnSprite: PIXI.Sprite;

    private _btnTextureNormal: PIXI.Texture;
    private _btnTextureDown: PIXI.Texture;

    private _buttonPos: Array < number > ;

    constructor($index: number) {
        super();
        this._index = $index;
        const colors: Array < string > = ["blue", "violet", "green", "yellow"];
        this._buttonPos = [188, 484, 798, 1094];
        const btnNormal = colors[this._index] + "_btn_normal.png"
        const btnDown = colors[this._index] + "_btn_down.png"
        this.anchor.set(0.5, 0.5);
        this._btnTextureNormal = ResourceManager.Handle.getViewerResource(btnNormal).texture;
        this._btnTextureDown = ResourceManager.Handle.getViewerResource(btnDown).texture;
        this.position.set(this._buttonPos[this._index], 628);
        this.onKeyUp();
    }

    onKeyDown() {
        this.texture = this._btnTextureDown;
    }

    onKeyUp() {
        this.texture = this._btnTextureNormal;
    }

    playEffect() {
        const ef = new Splash(ResourceManager.Handle.getViewerResource(`ptb_particle.json`).spineData, `ptb_particle`, false)
        ef.position.set(this._buttonPos[this._index], 628);
        this.parent.addChild(ef);
        ef.start()
    }

    get index() {
        return this._index;
    }
}