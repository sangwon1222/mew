import { SceneBase } from "../Core/SceneBase";
import { ResourceManager } from "../Core/ResourceManager";
import Config from "../Config";
import gsap, { TweenMax } from "gsap";
import { CenterBook } from "../GameObject/WordsToKnow.ts/CenterBook";
import { Button } from "../GameObject/Common/Button";
import { ExamCardGroup } from "../GameObject/WordsToKnow.ts/ExamCard";
import { Progress } from "../GameObject/Common/Progress";
import PIXISound from "pixi-sound";
import { Header } from "../GameObject/Common/Header";
import { HowTo } from "../GameObject/Common/HowTo";
import { Outro } from "../GameObject/Common/Outro";
import { Home } from "./Home";
import { WordsToKnowViewerData } from "../Resource/ViewerResource/WordsToKnow";
import * as WordsToKnowProductData from "../Resource/ProductResource/WordsToKnow";

export const quizList = {
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

export class WordsToKnow extends SceneBase {
  private mCenterBook: CenterBook;
  private mExamCardGroup: ExamCardGroup;
  private mProgress: Progress;

  private mCurrentStep: number;

  private mButton: Button;
  private mButtonFlag: boolean;
  private mCenterBookFlag: boolean;
  private mButtonResetCore: any;

  get quizList(): any {
    return quizList[this.productName];
  }
  get currentStep(): number {
    return this.mCurrentStep;
  }

  static _handle: WordsToKnow;
  static get Handle(): WordsToKnow {
    return WordsToKnow._handle;
  }

  constructor() {
    super("WordsToKnow");
    // this.productName = "b1";
    WordsToKnow._handle = this;
  }
  async onInit() {
    this.productName = Home.Handle.productName;
    PIXISound.stopAll();

    await this.loadViewerResource(WordsToKnowViewerData);
    await this.loadProductResource(WordsToKnowProductData[this.productName]);
  }

  async onStart() {
    this.mCurrentStep = 0;
    this.mButtonResetCore = gsap.delayedCall(1, () => {
      this.mButton.visible = true;
      this.mButton.interactive = true;
      this.mButton.buttonMode = true;
    });

    /**배경 */
    const BG = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordstoknow_bg.png`).texture
    );
    this.addChild(BG);

    /**게임 타이틀 */
    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordstoknow_title.png`).texture
    );
    title.y = 10;
    BG.addChild(title);

    /**센터 북 */
    this.mCenterBook = new CenterBook();
    this.mCenterBook.pivot.set(
      this.mCenterBook.width / 2,
      this.mCenterBook.height / 2
    );
    this.mCenterBook.position.set(Config.app.width / 2, Config.app.height / 2);
    this.addChild(this.mCenterBook);

    /**버튼 딜레이 */
    this.mButton = new Button(
      ResourceManager.Handle.getViewerResource(
        `wordstoknow_btn_check_normal.png`
      ).texture,
      ResourceManager.Handle.getViewerResource(
        `wordstoknow_btn_check_down.png`
      ).texture,
      ResourceManager.Handle.getViewerResource(
        `wordstoknow_btn_check_over.png`
      ).texture
    );
    this.mCenterBookFlag = true;
    this.mButtonFlag = false;
    gsap.delayedCall(this.mCenterBook.soundDuration, () => {
      this.mButtonFlag = true;
    });

    /**퀴즈 보기 */
    this.mExamCardGroup = new ExamCardGroup();
    this.addChild(this.mExamCardGroup);

    /**HEADER */
    const header = new Header();
    this.addChild(header);

    // // /**HOWTO */
    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    gsap
      .to(howTo, { alpha: 0, duration: 1 })
      .eventCallback("onComplete", () => {
        this.removeChild(howTo);
      });

    /**현재 과정 별 */
    this.mProgress = new Progress(10);
    this.mProgress.position.set(
      Config.app.width / 2,
      Config.app.height - this.mProgress.height
    );
    this.addChild(this.mProgress);

    const BGM = ResourceManager.Handle.getViewerResource(`snd_bgm.mp3`).sound;
    BGM.play({ loop: true });

    await this.mCenterBook.wordsCardSpeak();
    await this.mCenterBook.pictureCardSpeak();
    this.createButton();
  }

  createButton() {
    const sound = ResourceManager.Handle.getCommonResource(
      `common_snd_correct.mp3`
    ).sound;
    sound.play();
    // this.mCenterBook.checkCurrentStep();
    this.mExamCardGroup.checkCurrentStep(this.mCurrentStep);

    this.addChild(this.mButton);
    this.mButton.anchor.set(0.5);
    this.mButton.position.set(
      this.mCenterBook.x,
      this.mCenterBook.y + this.mCenterBook.height * 0.7
    );

    this.mButton.onClick = async () => {
      if (this.mButtonFlag) {
        this.mButtonFlag = false;
        this.mCenterBookFlag = false;
        this.mButton.visible = false;

        if (this.mCenterBook.currentPicture == this.mCurrentStep) {
          /**통과시 */
          this.mCurrentStep += 1;
          this.mProgress.nextStar();
          if (this.mCurrentStep == 10) {
            /**게임끝 */
            this.onEnd();
          } else {
            /** 게임끝 아님 */
            this.mCenterBook.onNextCard(this.mCurrentStep);
            this.mExamCardGroup.checkCurrentStep(this.mCurrentStep);
            gsap.delayedCall(0.5, async () => {
              await this.buttonReset();
              this.mButtonFlag = true;
              this.mCenterBookFlag = true;
            });
          }
        } else {
          // console.log(`현재스텝 아닌 카드 클릭 `)
          this.mCenterBook.currentPicture = this.mCurrentStep;
          this.mCenterBook.onNextCard(this.mCurrentStep);
          gsap.delayedCall(0.5, async () => {
            await this.buttonReset();
            this.mButtonFlag = true;
            this.mCenterBookFlag = true;
          });
        }
      }
    };
  }

  buttonReset(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.mButton.visible == true) {
        resolve();
      }
      const sound = ResourceManager.Handle.getCommonResource(
        `common_snd_correct.mp3`
      ).sound;
      gsap.delayedCall(this.mCenterBook.soundDuration, () => {
        sound.play();

        this.mButton.visible = true;

        this.mButtonResetCore = null;
        resolve();
      });
    });
  }

  async cardToCenterBook(IDX: number) {
    /**클릭 플래그로 일정시간 막아주기 */
    if (this.mCenterBookFlag) {
      this.mButton.visible = false;
      this.mButtonFlag = false;
      // this.mCenterBookFlag = false;
      if (IDX <= this.mCurrentStep) {
        this.mCenterBook.onNextCard(IDX);
        await this.buttonReset();
      }
      // this.mCenterBookFlag = true;
      this.mButtonFlag = true;
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
