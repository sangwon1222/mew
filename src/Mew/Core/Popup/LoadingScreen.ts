import * as PIXI from "pixi.js";
import { ResourceManager } from "../ResourceManager";
import gsap from "gsap";
import Config from "@/Mew/Config";

export class LoadingScreen extends PIXI.Container {
  private mLoading: PIXI.spine.Spine;
  private mBG: PIXI.Sprite;

  constructor() {
    super();
    this.init();
  }
  async init() {
    // console.error( "loading init")

    this.mLoading = new PIXI.spine.Spine(
      ResourceManager.Handle.getCommonResource(`common_loading.json`).spineData
    );
    this.mLoading.scale.set(Config.app.videoScale);
    this.mLoading.position.set(Config.app.width / 2, Config.app.height / 2);
    this.mLoading.state.setAnimation(0, "animation", true);
    this.addChild(this.mLoading);

    this.mBG = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`common_loading_bg.png`).texture
    );
    this.addChild(this.mBG);
  }

  async start() {
    // console.log(`Loading Screen`)
    this.mLoading.visible = true;
  }

  async end(): Promise<void> {
    //
    return new Promise<void>((resolve, reject) => {
      this.mLoading.visible = false;

      gsap
        .to(this, { alpha: 0, duration: 1 })
        .eventCallback("onComplete", () => resolve());
    });
  }
}
