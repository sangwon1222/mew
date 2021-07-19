import * as PIXI from "pixi.js";
import "pixi-sound";
import "pixi-spine";

import { SceneBase } from "../../Core/SceneBase";
import { App } from "../../Core/App";
import { ResourceManager } from "../../Core/ResourceManager";
import Config from "../../Config";
import gsap from "gsap";

export class Splash extends PIXI.Container {
  private mSpine: PIXI.spine.Spine;
  private mSpineData: PIXI.spine.core.SkeletonData;
  private mAnimationName: string;
  private mRepeat: boolean;

  constructor(
    source: PIXI.spine.core.SkeletonData,
    animationName?: string,
    repeat?: boolean
  ) {
    super();
    this.mSpineData = source;

    this.mSpine = new PIXI.spine.Spine(this.mSpineData);
    this.mSpine.scale.set(Config.app.videoScale);
    this.addChild(this.mSpine);

    this.mAnimationName = animationName;
    if (repeat) {
      this.mRepeat = repeat;
    } else {
      this.mRepeat = false;
    }
    // console.log(this.mAnimationName)
  }

  start(delay?: number): Promise<void> {
    // "animation"
    return new Promise<void>((resolve, reject) => {
      this.mSpine.state.setAnimation(0, this.mAnimationName, this.mRepeat);

      if (delay) {
        gsap.delayedCall(delay, () => {
          // gsap.to(this , {alpha:0, duration:0.5})
          // .eventCallback("onComplete",()=>{  resolve();   })
          resolve();
        });
      } else {
        this.mSpine.state.addListener({
          complete: () => {
            resolve();
          },
        });
      }
    });
  }
}
