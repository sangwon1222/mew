import * as PIXI from "pixi.js";
// import "pixi-spine";
window.PIXI = PIXI;
import PIXISound from "pixi-sound";

import { SceneBase } from "./SceneBase";
import Config from "../Config";
import { LoadingScreen } from "./Popup/LoadingScreen";
import { Video } from "../GameObject/Common/Video";
import gsap from "gsap/all";

// import { gsap } from 'gsap'
//(window as any)["PIXI"] = PIXI;
document.addEventListener("visibilitychange", () => {
  if (document.hidden == false) {
    PIXISound.resumeAll();
  } else {
    PIXISound.pauseAll();
  }
});
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

export class App extends PIXI.Application {
  //-----------------------------------
  // singleton
  private static _handle: App;
  static get Handle(): App {
    return App._handle;
  }
  //-----------------------------------
  private mCurrentSceneIDX: number;
  private mSceneArray: Array<SceneBase>;
  private mLoadingScreen: LoadingScreen;
  get loadingScreen(): LoadingScreen {
    return this.mLoadingScreen;
  }
  set loadingScreen(v: LoadingScreen) {
    this.mLoadingScreen = v;
  }

  private mSceneRoot: PIXI.Container;
  private mModalRoot: PIXI.Container;
  get sceneRoot(): PIXI.Container {
    return this.mSceneRoot;
  }
  get modalRoot(): PIXI.Container {
    return this.mModalRoot;
  }

  private mVideoStopper: Array<HTMLVideoElement>;

  get videoStop(): Array<HTMLVideoElement> {
    return this.mVideoStopper;
  }
  set videoStop(v: Array<HTMLVideoElement>) {
    this.mVideoStopper = v;
  }

  constructor(canvas: HTMLCanvasElement) {
    // const w = 1280;
    // const h = 800;
    super({
      width: Config.app.width,
      height: Config.app.height,
      backgroundColor: Config.app.background,
      // transparent: true,
      // resolution: window.devicePixelRatio || 1,
      view: canvas,
    });
    this.mVideoStopper = [];

    this.mSceneRoot = new PIXI.Container();
    this.mModalRoot = new PIXI.Container();

    this.stage.addChild(this.mSceneRoot);
    this.stage.addChild(this.mModalRoot);

    this.mCurrentSceneIDX = 0;
    this.mSceneArray = [];
    this._initAppSetup();
    // this.stage.addChild( this.mSceneArray[0] )

    // this.mLoadingScreen = new LoadingScreen();

    App._handle = this;
    // hack for browser
    (window as any)["app"] = this;
  }
  //--------------------------------------
  private _initAppSetup() {
    // this.stage.sortableChildren = true;
  }

  get currentScene(): SceneBase {
    return this.mSceneArray[this.mCurrentSceneIDX];
  }
  get currentSceneIDX(): number {
    return this.mCurrentSceneIDX;
  }

  addScene(scene: SceneBase) {
    this.mSceneArray.push(scene);
  }

  getScene(name: string): SceneBase {
    if (name == null) return null;
    for (const scene of this.mSceneArray) {
      if (name == scene.gamename) {
        return scene;
      }
    }
  }

  async goScene(name?: string) {
    this.videoAllStop();
    let flag = false;
    let idx = 0;
    this.mLoadingScreen = new LoadingScreen();
    if (name == null) name = this.mSceneArray[0].gamename;
    for (const scene of this.mSceneArray) {
      if (name == scene.gamename) {
        // 모든 사운드 정지
        scene.removeChildren();
        this.mSceneRoot.removeChildren();
        this.mModalRoot.removeChildren();
        this.mSceneRoot.addChild(scene);

        if (this.mLoadingScreen) {
          this.mModalRoot.addChild(this.mLoadingScreen);
          await this.mLoadingScreen.start();
        }

        this.mCurrentSceneIDX = idx;

        // console.warn(`현재 APP 스텝`,this.mCurrentSceneIDX)
        await scene.onInit();

        if (this.mLoadingScreen) {
          scene.onStart();
          await this.mLoadingScreen.end();
          // console.log(`로딩스크린종료`)
          this.mModalRoot.removeChild(this.mLoadingScreen);
        } else {
          await scene.onStart();
        }
        flag = true;
      }
      idx += 1;
    }

    if (!flag) {
      console.log(`[${name}] 無`);
    }
  }
  //--------------------------------------

  exit() {
    this.onCloseApp();
  }

  async startApp(appData: any) {
    // console.log( "App start ");

    this.start();
    await this.onStartApp();
    this.goScene();
  }

  videoAllStop() {
    if (this.mVideoStopper) {
      for (let i = 0; i < this.mVideoStopper.length; i++) {
        this.mVideoStopper[i].pause();
        if (i == this.mVideoStopper.length - 1) {
          this.mVideoStopper = [];
        }
      }
    }
  }
  //--------------------------------
  onStartApp() {
    //
  }
  onCloseApp() {
    //
  }
}
