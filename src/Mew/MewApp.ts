import { App } from "./Core/App";
import { Splash } from "./GameObject/Common/Splash";
import { Common } from "./Resource/CommonResource/Common";
import { LoadingScreen } from "./Core/Popup/LoadingScreen";
import Config from "./Config";
import { ResourceManager } from "./Core/ResourceManager";
import PIXISound from "pixi-sound";
import { Home } from "./scenes/Home";
import { Song } from "./scenes/Song";
import { ChantSong } from "./scenes/ChantSong";
import { WordsToKnow } from "./scenes/WordsToKnow";
import { WordsPlay } from "./scenes/WordsPlay";
import { SpellTheWord } from "./scenes/SpellTheWord";
import { ListeningGame } from "./scenes/ListeningGame";
import { WordsGame } from "./scenes/WordsGame";
import { MyOwnStage } from "./scenes/MyOwnStage";
import { PlayTheBeat } from "./scenes/PlayTheBeat";
import { SingAlong } from "./scenes/SingAlong";
import { Pigment } from "./scenes/Pigment";
import { ReadTheLyrics } from "./scenes/ReadTheLyrics";

import { gsap } from "gsap";
//(window as any)["PIXI"] = PIXI;

export class MewApp extends App {
  private mSplash: Splash;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.addScene(new Home());
    this.addScene(new Song());

    this.addScene(new ReadTheLyrics()); /**Not Ready */

    this.addScene(new WordsToKnow());
    this.addScene(new SpellTheWord());
    this.addScene(new WordsPlay());
    this.addScene(new MyOwnStage());

    this.addScene(new ChantSong());
    this.addScene(new WordsGame());
    this.addScene(new ListeningGame());

    this.addScene(new SingAlong());
    this.addScene(new PlayTheBeat());
    this.addScene(new Pigment());

    this.startApp({});
  }

  async onStartApp() {
    this.videoAllStop();
    PIXISound.stopAll();

    await ResourceManager.Handle.loadCommonResource(Common);
    // console.log(Common)

    this.loadingScreen = new LoadingScreen();

    this.mSplash = new Splash(
      ResourceManager.Handle.getCommonResource(`start_intro.json`).spineData,
      `animation`
    );

    // this.mSplash.position.set(Config.app.width / 2, Config.app.height / 2);
    // this.modalRoot.addChild(this.mSplash);
    // const sound = ResourceManager.Handle.getCommonResource(`intro_effect.mp3`)
    //   .sound;
    // sound.play();
    // await this.mSplash.start();

    this.modalRoot.removeChildren();
  }

  showLoadingScreen() {
    //
  }

  closeLoadingScreen() {
    //
  }

  onCloseApp() {
    //
  }
}
