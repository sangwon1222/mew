import {ResourceManager} from '../../Core/ResourceManager';
import {ImageAsset} from '../../GameObject/MyOwnStage/ImageAsset';
import Config from '../../Config';
import * as Util from "../../Core/Util"
import gsap from 'gsap';

export class PlayGround extends PIXI.Sprite {
    private pname: string;
    private isClick: boolean;

    constructor(productName: string) {
        super();
        this.pname = productName;
        this.texture = ResourceManager.Handle.getProductResource(this.pname, 'bg.png').texture;
        this.interactive = true;
        this.on("pointerdown", (evt: PIXI.InteractionEvent) => {
            this.picking(evt.data.global);
        })
    }

    createAsset(imgname: string, mpoint: PIXI.Point) {

        const newSticker = new ImageAsset(this.pname, imgname);
        this.unselectAll();
        newSticker.x = mpoint.x;
        newSticker.y = mpoint.y;
        newSticker.scale.set(0.5,0.5);
        newSticker.alpha = 0;

        // 스티커 위치 값을 랜덤으로 잡아준다.
        const minWidthRange = newSticker.width / 2;
        const maxWidthRange = Config.app.width - newSticker.width / 2;

        const minHeightRange = newSticker.height / 2;
        const maxHegihtRange = (Config.app.height - newSticker.height / 2) * 0.7;

        const rndX = Math.floor(Math.random() * (maxWidthRange - minWidthRange + 1)) + minWidthRange;
        const rndY = Math.floor(Math.random() * (maxHegihtRange - minHeightRange + 1)) + minHeightRange;

   
        this.addChild(newSticker);

        gsap.to(newSticker.scale, {
            x: 1,
            y: 1,
            duration: 0.2
        })

        gsap.to(newSticker, {
            x: rndX,
            y: rndY,
            alpha: 1,
            duration: 0.2
        }).eventCallback("onComplete", () => {
            //
        });
    }


    //myContainer.children.sort(depthCompare);

    picking(clickPos: PIXI.Point) {
        this.unselectAll();

        const arr = this.children.slice().reverse();
        // const flag = Util.getColorByPoint(this.mImage, current);

        //         if(flag.a) {

        for (const child of arr) {
            const asset: ImageAsset = child as ImageAsset;
            if (asset) {
                const localpos: PIXI.Point = asset.toLocal(clickPos);
                if (asset.getHitArea().contains(localpos.x, localpos.y)) {

                    const flag = Util.getColorByPoint(asset.getImage(), asset.parent.toLocal(clickPos));
                    if(flag.a) {

                    asset.select(true);
                    this.removeChild(asset);
                    this.addChild(asset);
                    break;
                }
                   
                }
            }
        }
    }

    unselectAll() {
        for (const child of this.children) {
            const asset: ImageAsset = child as ImageAsset;
            if (asset) {
                asset.select(false);
            }
        }
    }



    setChildInteractive(flag: boolean) {
        for (const child of this.children) {
            const asset: ImageAsset = child as ImageAsset;
            if (asset) {
                asset.setInteractive(flag);
            }
        }
    }
}
