import {ResourceManager} from "../../Core/ResourceManager"

export class ScreenShotButton extends PIXI.Sprite {

    private mCamera: PIXI.spine.Spine;

    constructor(cameraX = 0, cameraY = 0) {
        super();
        this.mCamera = new PIXI.spine.Spine(ResourceManager.Handle.getCommonResource("screen_shot.json").spineData);
        this.mCamera.scale.set(0.67,0.67);
        this.mCamera.position.set(cameraX, cameraY);
        this.mCamera.state.setAnimation(0, "idle", false);

        this.interactive = true;
        this.buttonMode = true;

        this.on("pointerdown", (evt) => {
            this.mCamera.state.setAnimation(0, "shot", false);
            this.interactive = false;
            this.onScreenShot();

        })

        this.addChild(this.mCamera);
    }



   

    onScreenShot() {
        //
    }
}