import {ResourceManager} from '../../Core/ResourceManager';
import * as Util from "../../Core/Util"

export class ImageAsset extends PIXI.Sprite {
    private mImage: PIXI.Sprite;
    private mGuideLine: PIXI.Graphics;
    private mCloseBTN: PIXI.Sprite;
    private mScaleBTN: PIXI.Sprite;
    private mRotateBTN: PIXI.Sprite;

    private mDragRotInitValue: number;
    private mDragInitValue: number;


    constructor(productName: string, name: string) {
        super();
        this.mImage = new PIXI.Sprite(ResourceManager.Handle.getProductResource(productName, name).texture);
        this.mImage.anchor.set(0.5);
        this.addChild(this.mImage);

        this.mDragRotInitValue = Math.atan2(-this.mImage.height / 2, -this.mImage.width / 2);
        this.mDragInitValue = Math.sqrt(Math.pow(this.mImage.width / 2, 2) + Math.pow(this.mImage.height / 2, 2));

        // mGuideLine
        this.mGuideLine = new PIXI.Graphics();
        this.mGuideLine.interactive = true;

        let moveDragging = false;
        let moveClickLocalPos = new PIXI.Point();
        let moveDragData: any = {};

        this.mGuideLine
            .on("pointerdown", (evt: PIXI.InteractionEvent) => {
                moveDragData = evt.data;
                const current = moveDragData.getLocalPosition(this.parent) as PIXI.Point;
                const flag = Util.getColorByPoint(this.mImage, current);

                if(flag.a) {
                    moveDragging = true;
                    moveClickLocalPos = this.toLocal(evt.data.global);  
                }    
            })
            .on("pointerup", (evt) => {
                moveDragging = false;
            })
            .on("pointerupoutside", (evt) => {
                moveDragging = false;
            })
            .on("pointermove", (evt) => {
                
                if (moveDragging) {
                    const current = moveDragData.getLocalPosition(this.parent) as PIXI.Point;
                    const tx = Math.cos(this.rotation) * moveClickLocalPos.x - Math.sin(this.rotation) * moveClickLocalPos.y;
                    const ty = Math.sin(this.rotation) * moveClickLocalPos.x + Math.cos(this.rotation) * moveClickLocalPos.y;
                    this.x = current.x - tx;
                    this.y = current.y - ty;
                }
            });


        this.addChild(this.mGuideLine);

        // mCloseBtn
        this.mCloseBTN = new PIXI.Sprite(ResourceManager.Handle.getViewerResource("close_btn.png").texture);
        this.mCloseBTN.anchor.set(0.5);
        this.mCloseBTN.interactive = true;
        this.mCloseBTN
            .on("pointerdown", (evt) => {
                //SoundController.Handle.play(`snd_sticker_out.mp3`);
                const snd = ResourceManager.Handle.getViewerResource('snd_sticker_out.mp3').sound
                snd.play();  
                this.parent.removeChild(this);
                evt.stopPropagation();
            });

        this.addChild(this.mCloseBTN);

        // mRotateBTN
        let rotationDragging = false;
        let rotationDragData: any;

        this.mRotateBTN = new PIXI.Sprite(ResourceManager.Handle.getViewerResource("rotation_btn.png").texture);
        this.mRotateBTN.anchor.set(0.5);
        this.mRotateBTN.interactive = true;
        this.mRotateBTN
            .on("pointerdown", (evt: PIXI.InteractionEvent) => {
                rotationDragging = true;
                rotationDragData = evt.data;

                const dragpos: PIXI.Point = rotationDragData.getLocalPosition(this.parent);
                dragpos.x -= this.x;
                dragpos.y -= this.y;

                this.rotation = Math.atan2(dragpos.y, dragpos.x) + this.mDragRotInitValue;
                this.realignInterface();
                evt.stopPropagation();
            })
            .on("pointerup", (evt) => {
                rotationDragging = false;
                evt.stopPropagation();
            })
            .on("pointerupoutside", (evt) => {
                rotationDragging = false;
                evt.stopPropagation();
            })
            .on("pointermove", (evt) => {
                if (rotationDragging) {
                    const dragpos: PIXI.Point = rotationDragData.getLocalPosition(this.parent);
                    dragpos.x -= this.x;
                    dragpos.y -= this.y;
                    this.rotation = Math.atan2(dragpos.y, dragpos.x) + this.mDragRotInitValue;
                    this.realignInterface();
                    evt.stopPropagation();
                }
            });

        this.addChild(this.mRotateBTN);


        this.mScaleBTN = new PIXI.Sprite(ResourceManager.Handle.getViewerResource("scale_btn.png").texture);
        this.mScaleBTN.anchor.set(0.5);
        this.mScaleBTN.interactive = true;

        let scaleDragging = false;

        this.mScaleBTN
            .on("pointerdown", (evt: PIXI.InteractionEvent) => {
                scaleDragging = true;
                const dragpos: PIXI.Point = this.toLocal(evt.data.global);
                const delta = Math.sqrt(Math.pow(dragpos.x, 2) + Math.pow(dragpos.y, 2)) / this.mDragInitValue;
                this.mImage.scale.set(delta);
                this.realignInterface();
                evt.stopPropagation();
            })
            .on("pointerup", (evt) => {
                scaleDragging = false;
                evt.stopPropagation();
            })
            .on("pointerupoutside", (evt) => {
                scaleDragging = false;
                evt.stopPropagation();
            })
            .on("pointermove", (evt) => {
                if (scaleDragging) {
                    scaleDragging = true;
                    const dragpos: PIXI.Point = this.toLocal(evt.data.global);
                    const delta = Math.sqrt(Math.pow(dragpos.x, 2) + Math.pow(dragpos.y, 2)) / this.mDragInitValue;
                    this.mImage.scale.set(delta);
                    this.realignInterface();
                    evt.stopPropagation();

                }
            });

        this.addChild(this.mScaleBTN);

        this.realignInterface();
    }

    realignInterface() {
        this.mGuideLine.clear();
        this.mGuideLine.lineStyle(2, 0xFFFFFF);
        this.mGuideLine.drawRect(-this.mImage.width / 2, -this.mImage.height / 2, this.mImage.width, this.mImage.height);
        this.mGuideLine.hitArea = new PIXI.Rectangle(-this.mImage.width / 2, -this.mImage.height / 2, this.mImage.width, this.mImage.height)
        this.mScaleBTN.x = this.mImage.width / 2;
        this.mScaleBTN.y = this.mImage.height / 2;
        this.mRotateBTN.x = -this.mImage.width / 2;
        this.mRotateBTN.y = this.mImage.height / 2;
        this.mCloseBTN.x = -this.mImage.width / 2;
        this.mCloseBTN.y = -this.mImage.height / 2;
    }

    select(flag: boolean) {
        this.mGuideLine.renderable = flag;
        this.mScaleBTN.renderable = flag;
        this.mRotateBTN.renderable = flag;
        this.mCloseBTN.renderable = flag;
    }

    setInteractive(flag: boolean) {
        this.mGuideLine.interactive = flag;
        this.mScaleBTN.interactive = flag;
        this.mRotateBTN.interactive = flag;
        this.mCloseBTN.interactive = flag;
    }

    getHitArea(): PIXI.IHitArea {
        return this.mGuideLine.hitArea;
    }

    getImage(): PIXI.Sprite {
        return this.mImage;
    }
}