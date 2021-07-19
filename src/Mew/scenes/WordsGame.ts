import { SceneBase } from "../Core/SceneBase";
import { Home } from "./Home";
import PIXISound from "pixi-sound";
import { Outro } from "../GameObject/Common/Outro";
import { HowTo } from "../GameObject/Common/HowTo";
import { Header } from "../GameObject/Common/Header";
import { ResourceManager } from "../Core/ResourceManager";
import { Progress } from "../GameObject/Common/Progress";
import * as Util from "../Core/Util";
import Config from "../Config";
import { Mew } from "../GameObject/WordsGame/Mew";
import { BallGroup } from "../GameObject/WordsGame/Ball";
import { QuizBoard } from "../GameObject/WordsGame/QuizBoard";
import { WordsGameViewerData } from "../Resource/ViewerResource/WordsGame";
import * as WordsGameProductData from "../Resource/ProductResource/WordsGame";

const quizList = {
  b1: [
    "star",
    "world",
    "little",
    "sky",
    "diamond",
    "leaf",
    "girl",
    "car",
    "owl",
    "tree",
  ],
  b2: [
    "corner",
    "pie",
    "thumb",
    "plum",
    "boy",
    "bear",
    "sock",
    "box",
    "gift",
    "candle",
  ],
  b3: [
    "mouse",
    "clock",
    "up",
    "down",
    "one",
    "ball",
    "chair",
    "drawer",
    "frame",
    "light",
  ],
  b4: [
    "cat",
    "cow",
    "dog",
    "moon",
    "dish",
    "spoon",
    "bag",
    "jump",
    "violin",
    "house",
  ],
  b5: [
    "snow",
    "horse",
    "song",
    "field",
    "tail",
    "cloud",
    "elf",
    "sled",
    "snowman",
    "santa",
  ],
  b6: [
    "daddy",
    "finger",
    "mommy",
    "brother",
    "sister",
    "baby",
    "family",
    "cap",
    "stage",
    "puppet",
  ],
  b7: [
    "happy",
    "hand",
    "clap",
    "angry",
    "stomp",
    "feet",
    "scare",
    "say",
    "sleep",
    "nap",
  ],
  b8: [
    "comb",
    "hair",
    "bed",
    "early",
    "morning",
    "wash",
    "face",
    "brush",
    "teeth",
    "dress",
  ],
  b9: [
    "farm",
    "guitar",
    "pond",
    "grandfather",
    "pig",
    "duck",
    "horse",
    "sheep",
    "dog",
    "old",
  ],
  b10: [
    "wheels",
    "bus",
    "town",
    "wiper",
    "door",
    "road",
    "window",
    "rain",
    "round",
    "rainbow",
  ],
};

const textStyle = new PIXI.TextStyle({
  fontFamily: "Bpreplay",
  fontSize: 48 * 0.67,
  // fontStyle: 'italic',
  fontWeight: "bold",
  fill: "0x0000",
  dropShadow: true,
});

export class WordsGame extends SceneBase {
  private mMew: Mew;
  private mBallGroup: BallGroup;
  private mQuizBoard: QuizBoard;

  private mProgress: Progress;
  private mCorrect: string;
  private mCurrentStep: number;
  private mRandomStep: Array<number>;

  private mBG: PIXI.Sprite;

  get textStyle(): PIXI.TextStyle {
    return textStyle;
  }
  get BGinteractive(): boolean {
    if (this.mBG.interactive !== undefined) return this.mBG.interactive;
  }
  set BGinteractive(v: boolean) {
    this.mBG.interactive = v;
  }

  get ballGroup(): BallGroup {
    return this.mBallGroup;
  }
  get quizBoard(): QuizBoard {
    return this.mQuizBoard;
  }

  get correctID(): number {
    return this.mRandomStep[0];
  } /**단어 인덱스 */
  get quizData(): string {
    return quizList[this.productName][this.mRandomStep[0]];
  }
  get correct(): string {
    return this.mCorrect;
  } /**단어의 퀴즈 알파벳 */

  static _handle: WordsGame;
  static get Handle(): WordsGame {
    return WordsGame._handle;
  }

  constructor() {
    super(`WordsGame`);
    WordsGame._handle = this;
  }

  async onInit() {
    this.productName = Home.Handle.productName;
    // this.productName = `b1`;

    await this.loadViewerResource(WordsGameViewerData);
    await this.loadProductResource(WordsGameProductData[this.productName]);
  }

  async onStart() {
    PIXISound.stopAll();

    this.mCurrentStep = 0;
    const a = [];
    // for (let i = 0; i < quizList[this.productName].length; i++) {
    //   a.push(i);
    // }
    for (let i = 0; i < quizList[this.productName].length; i++) {
      a.push(i);
    }
    this.mRandomStep = Util.shuffleArray(a);

    const BGM = ResourceManager.Handle.getViewerResource(`snd_bgm.mp3`).sound;
    BGM.play({ loop: true });

    this.mBG = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`bg.png`).texture
    );
    this.addChild(this.mBG);

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordsgame_text.png`).texture
    );
    title.y = 10;
    this.addChild(title);

    this.mProgress = new Progress(5);
    this.mProgress.position.set(
      Config.app.width / 2,
      Config.app.height - this.mProgress.height
    );
    this.addChild(this.mProgress);

    const bob = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource(`bob.json`).spineData
    );
    bob.state.setAnimation(0, `bob_de`, true);
    bob.scale.set(Config.app.videoScale);
    bob.position.set(Config.app.width * 0.3, Config.app.height * 0.85);
    this.addChild(bob);

    const pho = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource(`pho.json`).spineData
    );
    pho.state.setAnimation(0, `defalt`, true);
    pho.scale.set(Config.app.videoScale);
    pho.position.set(
      Config.app.width * 0.3 + pho.width,
      Config.app.height * 0.85
    );
    this.addChild(pho);

    /**HOWTO */
    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    this.removeChild(howTo);

    this.mMew = new Mew();
    this.mMew.position.set(Config.app.width / 2, Config.app.height * 0.8);
    this.addChild(this.mMew);

    // const debug = new PIXI.Graphics();
    // debug.lineStyle(2,0x0000,1)
    // debug.drawRect(0,0,this.mMew.width, this.mMew.height)
    // debug.endFill();
    // this.mMew.addChild(debug)

    this.mBallGroup = new BallGroup();
    this.mBallGroup.position.set(
      Config.app.width / 2 + 50,
      Config.app.height * 0.1
    );
    this.addChild(this.mBallGroup);

    this.mCorrect = this.mBallGroup.correct;

    this.mQuizBoard = new QuizBoard();
    this.mQuizBoard.position.set(
      Config.app.width / 2 - this.mQuizBoard.width / 2,
      this.mQuizBoard.height / 2
    );
    this.addChild(this.mQuizBoard);

    // const ghost = new PIXI.spine.Spine(ResourceManager.Handle.getViewerResource(`coommon_ghost.json`).spineData)
    // ghost.state.setAnimation(0, `defalt` , true )
    // /**fail // in   // success // */
    // ghost.scale.set(Config.app.videoScale)
    // ghost.position.set(Config.app.width/ 2 ,Config.app.height/2)
    // this.addChild(ghost)

    this.mBG.interactive = true;
    this.mBG
      .on("pointerdown", () => {
        this.mMew.startAim();
      })
      .on("pointermove", (evt: PIXI.InteractionEvent) => {
        this.mMew.calcBodyDirection(evt.data.global);
      })
      .on("pointerup", () => {
        this.mMew.fire();
      });

    const header = new Header();
    this.addChild(header);
  }

  NextStep() {
    this.mRandomStep.splice(0, 1);
    this.mProgress.nextStar();
    this.mCurrentStep += 1;
    if (this.mCurrentStep == 5) {
      this.onEnd();
    } else {
      this.removeChild(this.mBallGroup);
      this.mBallGroup = new BallGroup();
      this.mBallGroup.position.set(
        Config.app.width / 2 + 50,
        Config.app.height * 0.1
      );
      this.addChild(this.mBallGroup);

      this.mCorrect = this.mBallGroup.correct;

      this.removeChild(this.mQuizBoard);
      this.mQuizBoard = new QuizBoard();
      this.mQuizBoard.position.set(
        Config.app.width / 2 - this.mQuizBoard.width / 2,
        this.mQuizBoard.height / 2
      );
      this.addChild(this.mQuizBoard);
    }
    this.mBG.interactive = true;
  }

  async onEnd() {
    PIXISound.stopAll();
    /**OUTRO */
    const outro = new Outro();
    this.addChild(outro);
    await outro.outro();
  }
}
