import { ResourceManager } from "../../Core/ResourceManager";
import Config from "../../Config";
import { WordsToKnow } from "../../scenes/WordsToKnow";
import gsap from "gsap";

const textSytle = new PIXI.TextStyle({
  fill: "#2664AE",
  fontFamily: "BPreplay",
  fontWeight: "800",
  fontSize: 32,
  padding:20,
});

export enum ChangeMode {
  normal,
  current,
  complete,
}

export class ExamCard extends PIXI.Sprite {
  private mComplete: PIXI.Texture;
  private mCurrent: PIXI.Texture;
  private mNormal: PIXI.Texture;

  private mChangeMode = ChangeMode.normal;
  private mIDX: number;

  get cardIDX(): number {
    return this.mIDX;
  }

  get changeMode(): ChangeMode {
    return this.mChangeMode;
  }
  set changeMode(v: ChangeMode) {
    this.mChangeMode = v;
  }

  private mCurrentArrow: PIXI.Sprite;
  private mCurrentArrowBlink: any;

  constructor(idx: number) {
    super();

    this.mIDX = idx;
    this.mNormal = ResourceManager.Handle.getViewerResource(
      `wordstoknow_card.png`
    ).texture;
    this.mCurrent = ResourceManager.Handle.getViewerResource(
      `wordstoknow_card_current.png`
    ).texture;
    this.mComplete = ResourceManager.Handle.getViewerResource(
      `wordstoknow_card_complete.png`
    ).texture;

    this.mCurrentArrow = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(
        `wordstoknow_card_arrow.png`
      ).texture
    );
    this.mCurrentArrow.anchor.set(0.5, 0);
    this.mCurrentArrow.alpha = 0;
    this.addChild(this.mCurrentArrow);

    this.anchor.set(0.5);
    this.texture = this.mNormal;
    this.mCurrentArrow.position.set(0, -this.height * 0.6);

    this.interactive = true;
    this.buttonMode = true;

    this.on("pointertap", () => {
      this.onClick();
    });
  }

  changeTexture() {
    if (this.mChangeMode == ChangeMode.normal) {
      this.texture = this.mNormal;
      if (this.mCurrentArrowBlink) {
        this.mCurrentArrowBlink.kill();
      }
      this.mCurrentArrow.alpha = 0;
    }
    if (this.mChangeMode == ChangeMode.current) {
      this.texture = this.mCurrent;
      this.mCurrentArrowBlink = gsap
        .to(this.mCurrentArrow, { alpha: 1, duration: 1 })
        .repeat(-1)
        .yoyo(true);
      this.mCurrentArrowBlink.play();
    }
    if (this.mChangeMode == ChangeMode.complete) {
      this.texture = this.mComplete;
      if (this.mCurrentArrowBlink) {
        this.mCurrentArrowBlink.kill();
      }
      this.mCurrentArrow.alpha = 0;
    }
  }

  onClick() {
    if (this.mIDX <= WordsToKnow.Handle.currentStep) {
      WordsToKnow.Handle.cardToCenterBook(this.mIDX);
    }
  }
}

export class ExamCardGroup extends PIXI.Container {
  private mQuizStep: Array<ExamCard>;
  private mQuizList: any;

  constructor() {
    super();
    this.mQuizStep = [];
    this.createExamCard();
  }

  createExamCard() {
    this.mQuizList = WordsToKnow.Handle.quizList;
    let offSetY = Config.app.height * 0.2;

    for (let i = 0; i < 10; i++) {
      const quiz = new ExamCard(i);
      if (i < 5) {
        quiz.position.set(quiz.width * 0.6, offSetY);
      } else {
        if (i == 5) {
          offSetY = Config.app.height * 0.2;
        }
        quiz.position.set(Config.app.width - quiz.width * 0.6, offSetY);
      }
      const quizText = new PIXI.Text(this.mQuizList[i], textSytle);
      quizText.anchor.set(0.5);
      quiz.addChild(quizText);
      this.mQuizStep.push(quiz);
      this.addChild(quiz);

      offSetY = offSetY + quiz.height * 1.2;
    }
  }

  checkCurrentStep(currentStep: number) {
    this.mQuizStep[currentStep].changeMode = ChangeMode.current;
    this.mQuizStep[currentStep].changeTexture();

    if (this.mQuizStep[currentStep - 1] != undefined) {
      this.mQuizStep[currentStep - 1].changeMode = ChangeMode.complete;
      this.mQuizStep[currentStep - 1].changeTexture();
    }
  }
}
