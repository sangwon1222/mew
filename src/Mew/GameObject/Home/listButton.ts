import * as Util from "../../Core/Util";
import { ResourceManager } from "../../Core/ResourceManager";
import { Home } from "../../scenes/Home";
import gsap from "gsap";
import { App } from "../../Core/App";
import Config from "../../Config";

const gameList = [
  "Song",
  "ReadTheLyrics",
  "WordsToKnow",
  "SpellTheWord",
  "WordsPlay",
  "MyOwnStage",
  "ChantSong",
  "WordsGame",
  "ListeningGame",
  "SingAlong",
  "PlayTheBeat",
  "Pigment",
];

export enum PointerMode {
  none,
  down,
  over,
  move,
}

export class ListButton extends PIXI.Sprite {
  private mClickFlag = true;
  private mIdx = 0;

  private mPointerMode = PointerMode.none;

  get pointerMode(): PointerMode {
    return this.mPointerMode;
  }
  set pointerMode(v: PointerMode) {
    this.mPointerMode = v;
    this._setClickScope(null, 0);
  }

  constructor(idx: number) {
    super();

    this.texture = ResourceManager.Handle.getViewerResource(
      `main_activity_${idx}_normal.png`
    ).texture;

    this.anchor.set(0.5);

    this.interactive = true;
    this.buttonMode = true;
    this.mIdx = idx;

    this
      // .on("pointerover", (evt) => {
      //   this.mPointerMode = PointerMode.over;
      //   this._setClickScope(evt.data.global, idx);
      // })
      // .on("pointerout", (evt) => {
      //   this.mPointerMode = PointerMode.none;
      //   this._setClickScope(evt.data.global, idx);
      // })
      .once("pointertap", async (evt) => {
        await (this.parent.parent as Home).offInteractive();
        this.mPointerMode = PointerMode.down;
        this._setClickScope(evt.data.global, idx);
        if (this.mClickFlag) {
          this._moveToActivity();
          this.mClickFlag = false;
        }
      })
      // .on("pointermove", (evt: PIXI.InteractionEvent) => {
      //   if (this.mPointerMode != PointerMode.down) {
      //     this.mPointerMode = PointerMode.move;
      //     this._setClickScope(evt.data.global, idx);
      //   }
      // });
  }

  private _setTexture(name: string): PIXI.Texture {
    const rsc = ResourceManager.Handle.getViewerResource(name);
    if (rsc === undefined) {
      return null;
    } else {
      return rsc.texture;
    }
  }

  _setClickScope(gPos: PIXI.IPoint, idx) {
    if (this.mPointerMode == PointerMode.none) {
      this.texture = this._setTexture(`main_activity_${idx}_normal.png`);
      this.mPointerMode = PointerMode.none;
    }

    if (this.mPointerMode == PointerMode.down) {
      this.texture = this._setTexture(`main_activity_${idx}_down.png`);
    }

    if (this.mPointerMode == PointerMode.over) {
      this.texture = this._setTexture(`main_activity_${idx}_over.png`);
      this.mPointerMode = PointerMode.none;
    }

    if (this.mPointerMode == PointerMode.move) {
      if (Util.getColorByPoint(this, new PIXI.Point(gPos.x, gPos.y)).a > 50) {
        this.mClickFlag = true;
        this.buttonMode = true;
        this.texture = this._setTexture(`main_activity_${idx}_over.png`);
        gsap.to(this.scale, {
          x: 1.1,
          y: 1.1,
          duration: 0.5,
        });
      } else {
        gsap.to(this.scale, {
          x: 1,
          y: 1,
          duration: 0.5,
        });
        this.texture = this._setTexture(`main_activity_${idx}_normal.png`);
        this.mClickFlag = false;
        this.buttonMode = false;
        this.mPointerMode = PointerMode.none;
      }
    }
  }

  async _moveToActivity() {
    await this._activitySoundON();
    const scene = App.Handle.getScene(gameList[this.mIdx - 1]);

    scene.productName = Home.Handle.productName;

    App.Handle.goScene(gameList[this.mIdx - 1]);
  }

  _activitySoundON(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const activitySound = ResourceManager.Handle.getViewerResource(
        `snd_activity_title_${gameList[this.mIdx - 1].toLowerCase()}.mp3`
      ).sound;
      activitySound.play();
      gsap.delayedCall(activitySound.duration, () => {
        resolve();
      });
    });
  }
}
