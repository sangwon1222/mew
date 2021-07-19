import { SceneBase } from "../Core/SceneBase";
import "pixi-spine";
import { ResourceManager } from "../Core/ResourceManager";
import { Header } from "../GameObject/Common/Header";
import Config from "../Config";
import { Splash } from "../GameObject/Common/Splash";
import { QuizCardBox } from "../GameObject/WordsPlay/QuizCardBox";
import { AirPlane } from "../GameObject/WordsPlay/AirPlane";
import gsap from "gsap";
import * as Util from "../Core/Util";
import { Progress } from "../GameObject/Common/Progress";
import { HowTo } from "../GameObject/Common/HowTo";
import { Outro } from "../GameObject/Common/Outro";
import PIXISound from "pixi-sound";
import { Home } from "./Home";
import { WordsPlayViewerData } from "../Resource/ViewerResource/WordsPlay";
import * as WordsPlayProductData from "../Resource/ProductResource/WordsPlay";

const quizData = {
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
    "moon",
    "dog",
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
export class WordsPlay extends SceneBase {
  private mQuizCardBox: QuizCardBox;
  private mAirPlane: AirPlane;
  private mAirPlaneStage: PIXI.Container;

  private mCurrentStep: number;
  private mProgress: Progress;
  private mRandomIDXArray: Array<number>;

  get currentStep(): number {
    return this.mCurrentStep;
  }
  set currentStep(v: number) {
    this.mCurrentStep = v;
  }

  get quizList(): any {
    return quizData[this.productName];
  }
  get randomIDXArray(): Array<number> {
    return this.mRandomIDXArray;
  }
  get quizGroup(): QuizCardBox {
    return this.mQuizCardBox;
  }

  static _handle: WordsPlay;
  static get Handle(): WordsPlay {
    return WordsPlay._handle;
  }

  constructor() {
    super(`WordsPlay`);
    // this.productName = 'b1'
    WordsPlay._handle = this;
  }

  async onInit() {
    this.productName = Home.Handle.productName;

    await this.loadViewerResource(WordsPlayViewerData);
    await this.loadProductResource(WordsPlayProductData[this.productName]);
  }

  async onStart() {
    PIXISound.stopAll();
    this.mRandomIDXArray = [];
    const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.mRandomIDXArray = Util.shuffleArray(a);

    this.mCurrentStep = 0;
    const BGM = ResourceManager.Handle.getViewerResource(`snd_bgm.mp3`).sound;
    BGM.play({ loop: true });
    const BG = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordsplay_bg.png`).texture
    );
    this.addChild(BG);

    const cloud1 = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordsplay_cloud_1.png`).texture
    );
    BG.addChild(cloud1);
    cloud1.position.set(Config.app.width * 1.5, Config.app.height * 0.1);

    const cloud2 = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordsplay_cloud_2.png`).texture
    );
    BG.addChild(cloud2);
    cloud2.position.set(Config.app.width, Config.app.height * 0.2);

    gsap.to(cloud1, { x: -cloud1.width, duration: 100 }).repeat(-1);
    gsap.to(cloud2, { x: -cloud2.width, duration: 50 }).repeat(-1);

    const Spine1 = new Splash(
      ResourceManager.Handle.getViewerResource(
        `wordsplay_cha_3.json`
      ).spineData,
      `cha_3_ani`,
      true
    );
    BG.addChild(Spine1);
    Spine1.position.set(this.width * 0.06, this.height * 0.775);
    Spine1.start();

    const spineBG = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordsplay_bg_front.png`).texture
    );
    spineBG.position.set(0, BG.height - spineBG.height);
    BG.addChild(spineBG);

    const Spine2 = new Splash(
      ResourceManager.Handle.getViewerResource(
        `wordsplay_cha_1.json`
      ).spineData,
      `cha_1_ani`,
      true
    );
    spineBG.addChild(Spine2);
    Spine2.position.set(spineBG.width * 0.855, spineBG.height * 0.55);
    Spine2.start();

    const Spine3 = new Splash(
      ResourceManager.Handle.getViewerResource(
        `wordsplay_cha_2.json`
      ).spineData,
      `cha_2_ani`,
      true
    );
    spineBG.addChild(Spine3);
    Spine3.position.set(spineBG.width * 0.225, spineBG.height * 0.65);
    Spine3.start();

    /**HOWTO */
    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    this.removeChild(howTo);

    const startSND = ResourceManager.Handle.getCommonResource(
      `common_snd_activity_start.mp3`
    ).sound;
    startSND.play();
    this.mAirPlaneStage = new PIXI.Container();
    this.addChild(this.mAirPlaneStage);
    await this.createAirPlane();
    await this.createQuizCard();

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordsplay_title.png`).texture
    );
    title.y = 10;
    this.addChild(title);

    const header = new Header();
    this.addChild(header);

    this.mProgress = new Progress(5);
    this.addChild(this.mProgress);

    this.mProgress.position.set(
      Config.app.width / 2,
      Config.app.height - this.mProgress.height
    );

    await this.mQuizCardBox.startInterActive()
  }

  createAirPlane(): Promise<void> {
    return new Promise<void>(resolve => {
    this.mAirPlane = new AirPlane(this.quizList);
    this.mAirPlane.alpha = 0;
    this.mAirPlaneStage.addChild(this.mAirPlane);
    this.mAirPlane.position.set(Config.app.width / 2, Config.app.height * 0.2);
    /**정답/초기 모션 */
    const planeSound = ResourceManager.Handle.getViewerResource(`snd_plane.mp3`)
      .sound;
    planeSound.play();
    this.mAirPlane.alpha = 1;
    gsap.from(this.mAirPlane, {
      x: this.mAirPlane.width * 2,
      y: 0,
      angle: -15,
      duration: 1.5,
    });
    gsap.delayedCall(1, () => {
      this.mAirPlane.soundOn();
      resolve()
    });
  });
  }

  createQuizCard(): Promise<void> {
    return new Promise<void>(resolve => { 
    this.mQuizCardBox = new QuizCardBox();
    this.addChild(this.mQuizCardBox);
    this.mQuizCardBox.position.set(
      Config.app.width / 2,
      Config.app.height * 0.55
      );
      resolve()
    });
  }

  correctOrWrong(id: number): boolean {
    if (id == 0) {
      return true;
    } else {
      return false;
    }
  }

  async correct() {
    this.mProgress.nextStar();
    if (this.mCurrentStep < 5) {
      await this.mQuizCardBox.waitInterActive()
      await this.mAirPlane.soundOn();
      this.mQuizCardBox.nextQuiz();

      const planeSound = ResourceManager.Handle.getViewerResource(
        `snd_plane.mp3`
      ).sound;
      planeSound.play();

      gsap
        .to(this.mAirPlane, {
          x: -this.mAirPlane.width / 2,
          y: 0,
          angle: 15,
          duration: 1.5,
        })
        .eventCallback("onComplete", async () => {
          this.mCurrentStep += 1;
          await this.nextQuiz();
        });
    }
  }

  wrong() {
    // console.log(`%c 오답 !`, "font-weight:bold; color:red;");
  }

  async nextQuiz() {
    if (this.mCurrentStep < 5) {
      this.mRandomIDXArray.splice(0, 1);
      Util.shuffleArray(this.mRandomIDXArray);

      const nextQuizSound = ResourceManager.Handle.getCommonResource(
        `common_snd_next_question.mp3`
      ).sound;
      nextQuizSound.play();
      gsap.delayedCall(nextQuizSound.duration, async () => {
        this.mAirPlaneStage.removeChild(this.mAirPlane);
        this.removeChild(this.mQuizCardBox);
         this.createQuizCard();
        await this.createAirPlane();
        await this.mQuizCardBox.startInterActive()
      });
    } else {
      this.onEnd();
    }
  }

  async onEnd() {
    PIXISound.stopAll();
    /**OUTRO */
    const outro = new Outro();
    this.addChild(outro);
    await outro.outro();
  }
}
