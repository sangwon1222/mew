import { Splash } from "./Splash";
import Config from "@/Mew/Config";
import { ResourceManager } from "@/Mew/Core/ResourceManager";
import gsap from "gsap";
import { Button } from "./Button";
import { App } from "@/Mew/Core/App";

const gameList = [
  "Home",
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

export class Outro extends PIXI.Container {
  private mDimmed: PIXI.Graphics;
  private mOutroSplash: Splash;

  constructor() {
    super();

    this.mDimmed = new PIXI.Graphics();
    this.mDimmed.beginFill(0x0000, 0.8);
    this.mDimmed.drawRect(0, 0, Config.app.width, Config.app.height);
    this.mDimmed.endFill();
    this.addChild(this.mDimmed);
    this.mDimmed.interactive = true;
    this.mDimmed.buttonMode = false;
    this.mDimmed.on("pointertap", (evt) => {
      //   console.log(`Click Outro`);
      evt.stopPropagation();
    });

    this.mOutroSplash = new Splash(
      ResourceManager.Handle.getCommonResource(`common_ending.json`).spineData,
      `eop01`
    );
    if (this.mOutroSplash != undefined) {
      // this.mOutroSplash.scale.set( Config.app.videoScale )
      this.mOutroSplash.position.set(
        Config.app.width / 2,
        Config.app.height * 0.6
      );
      this.addChild(this.mOutroSplash);
    }
  }

  async outro() {
    // console.warn(`현재 게임 ${gameList[App.Handle.currentSceneIDX]}`);
    // console.warn(
    //   `다음 게임 누르면 ${gameList[App.Handle.currentSceneIDX + 1]}`
    // );
    // console.warn(`어게인 게임 누르면 ${gameList[App.Handle.currentSceneIDX]}`);
    const playAgain = new Button(
      ResourceManager.Handle.getCommonResource(
        `common_ending_again_normal.png`
      ).texture,
      ResourceManager.Handle.getCommonResource(
        `common_ending_again_down.png`
      ).texture
    );
    playAgain.position.set(
      Config.app.width / 2 - playAgain.width * 0.6,
      Config.app.height * 0.85
    );
    playAgain.onClick = () => {
      App.Handle.goScene(gameList[App.Handle.currentSceneIDX]);
    };

    const nextActivity = new Button(
      ResourceManager.Handle.getCommonResource(
        `common_ending_next_normal.png`
      ).texture,
      ResourceManager.Handle.getCommonResource(
        `common_ending_next_down.png`
      ).texture
    );
    nextActivity.position.set(
      Config.app.width / 2 + nextActivity.width * 0.6,
      Config.app.height * 0.85
    );
    nextActivity.onClick = () => {
      App.Handle.goScene(gameList[App.Handle.currentSceneIDX + 1]);
    };

    const subSound = ResourceManager.Handle.getCommonResource(
      `common_snd_ending.mp3`
    ).sound;
    const mainSound = ResourceManager.Handle.getCommonResource(
      `common_snd_ending_nar.mp3`
    ).sound;
    gsap.delayedCall(1, () => {
      subSound.play();
      gsap.delayedCall(subSound.duration - 1, () => {
        mainSound.play();
        this.addChild(nextActivity);
        this.addChild(playAgain);
      });
      //
    });
    await this.mOutroSplash.start(subSound.duration + mainSound.duration);
  }
}
