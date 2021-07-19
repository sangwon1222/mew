import {ResourceManager} from '../../Core/ResourceManager';
import Config from '../../Config';

export class WordImgBoard extends PIXI.Sprite {

    private presentBox: PIXI.Sprite;
    private imgSpr: PIXI.Sprite;
    private imgTexture: PIXI.Texture;
    private mMask: PIXI.Graphics;

    constructor() {
        super();
        this.presentBox = new PIXI.Sprite(ResourceManager.Handle.getViewerResource('present_box.png').texture);
        this.presentBox.anchor.set(0.5,0.5);
        this.presentBox.x = Config.app.width / 2 + 2;
        this.presentBox.y = 102;
        this.addChild(this.presentBox);
        this.imgSpr = new PIXI.Sprite();
        this.imgSpr.anchor.set(0.5, 0.5);
        this.imgSpr.x = Config.app.width / 2;
        this.imgSpr.y = 98;
        this.addChild(this.imgSpr);

        this.mMask = new PIXI.Graphics();
        this.mMask.beginFill(0xFF0000);
        this.mMask.drawRoundedRect(540, 21, 200, 154,24);
        this.mMask.endFill();
        this.addChild(this.mMask);
        this.imgSpr.mask = this.mMask;
    }

    makeWordImg( productName: string, imgStr: string ) {
        this.imgTexture = ResourceManager.Handle.getProductResource(productName,imgStr).texture
        this.imgSpr.texture = this.imgTexture;
    }
}