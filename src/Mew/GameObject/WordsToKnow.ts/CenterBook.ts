import { ResourceManager } from "../../Core/ResourceManager";
import Config from "../../Config";
import { WordsToKnow } from "../../scenes/WordsToKnow";
import { Home } from "../../scenes/Home";
import gsap from "gsap";
import PIXISound from "pixi-sound";

const textSytle = new PIXI.TextStyle({
  fill: "#2664AE",
  fontFamily: "BPreplay",
  fontWeight: "800",
  fontSize: 68,
  letterSpacing: -3,
  padding:20
});

export class CenterBook extends PIXI.Container {
  private mWordsTextStage: PIXI.Container;
  private mWordsText: PIXI.Text;

  private mQuizPictureStage: PIXI.Container;
  private mQuizPicture: PIXI.Sprite;

  private mBook: PIXI.Sprite;
  private mQuizList: any;

  private mPictureSound: PIXI.sound.Sound;
  private mWordsSound: PIXI.sound.Sound;
  private mMouseEffect: any;
  private mCurrentPicture: number; /**현재 센터북에 나오는 사진 인덱스 */

  private mScaleAni: any;
  get scaleAni(): any {
    return this.mScaleAni;
  }
  set scaleAni(v: any) {
    this.mScaleAni = v;
  }

  get soundDuration(): number {
    return this.mPictureSound.duration + this.mWordsSound.duration;
  }

  get currentPicture(): number {
    return this.mCurrentPicture;
  }
  set currentPicture(v: number) {
    this.mCurrentPicture = v;
  }

  constructor() {
    super();
    this.mCurrentPicture = 0;
    this.mQuizList = WordsToKnow.Handle.quizList;
    /**사운드 세팅 */
    this.mPictureSound = ResourceManager.Handle.getProductResource(
      Home.Handle.productName,
      `kor/wd_${WordsToKnow.Handle.productName.slice(1)}_${WordsToKnow.Handle
        .currentStep + 1}.mp3`
    ).sound;
    this.mWordsSound = ResourceManager.Handle.getProductResource(
      Home.Handle.productName,
      `wd_${WordsToKnow.Handle.productName.slice(1)}_${WordsToKnow.Handle
        .currentStep + 1}.mp3`
    ).sound;
    /**클릭 이펙트 스파인 */
    this.mMouseEffect = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource(
        `wordstoknow_particle.json`
      ).spineData
    );
    this.mMouseEffect.scale.set(Config.app.videoScale);

    this.mBook = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`wordstoknow_book.png`).texture
    );
    this.addChild(this.mBook);

    this.mQuizPictureStage = new PIXI.Container();
    this.addChild(this.mQuizPictureStage);
    this.mQuizPicture = new PIXI.Sprite();
    this.mQuizPicture.texture = ResourceManager.Handle.getProductResource(
      WordsToKnow.Handle.productName,
      `img_${this.mQuizList[WordsToKnow.Handle.currentStep]}.png`
    ).texture;
    this.mQuizPicture.anchor.set(0.5);
    this.mQuizPictureStage.addChild(this.mQuizPicture);
    this.mQuizPicture.position.set(
      this.mQuizPictureStage.width / 2,
      this.mQuizPictureStage.height / 2
    );
    this.mQuizPictureStage.position.set(
      this.mBook.width / 2 + this.mBook.width * 0.04,
      this.mBook.y + this.mBook.height * 0.1
    );

    const quizMask = new PIXI.Graphics();
    quizMask.beginFill(0x0000, 1);
    // quizMask.lineStyle(2,0x0000,1)
    quizMask.drawRoundedRect(
      0,
      0,
      this.mQuizPictureStage.width,
      this.mQuizPictureStage.height,
      25
    );
    quizMask.endFill();
    this.mQuizPictureStage.addChild(quizMask);
    this.mQuizPictureStage.mask = quizMask;
    this.mQuizPictureStage.interactive = true;
    this.mQuizPictureStage.buttonMode = true;

    this.mQuizPictureStage.on("pointertap", (evt: PIXI.InteractionEvent) => {
      this.addChild(this.mMouseEffect);
      this.mMouseEffect.state.setAnimation(0, "animation", false);
      this.mMouseEffect.position.set(
        evt.data.global.x - this.mQuizPictureStage.width / 2,
        evt.data.global.y - this.mQuizPictureStage.height * 0.8
      );

      this.pictureCardSpeak();
    });

    // Util.lineGuide(this.mQuizPictureStage)

    // ------------------------------------------------------------------------------------------------

    this.mWordsTextStage = new PIXI.Container();
    this.addChild(this.mWordsTextStage);
    this.mWordsText = new PIXI.Text(
      this.mQuizList[WordsToKnow.Handle.currentStep],
      textSytle
    );
    this.mWordsText.anchor.set(0.5);
    this.mWordsTextStage.addChild(this.mWordsText);
    this.mWordsText.position.set(
      this.mQuizPictureStage.width / 2,
      this.mQuizPictureStage.height / 2
    );
    this.mWordsTextStage.position.set(
      this.mBook.width * 0.04,
      this.mBook.height * 0.1
    );

    const wordsMask = new PIXI.Graphics();
    wordsMask.beginFill(0x0000, 1);
    // wordsMask.lineStyle(2,0x0000,1)
    wordsMask.drawRoundedRect(
      0,
      0,
      this.mQuizPictureStage.width,
      this.mQuizPictureStage.height,
      50
    );
    wordsMask.endFill();
    this.mWordsTextStage.addChild(wordsMask);
    this.mWordsText.mask = wordsMask;

    this.mWordsTextStage.interactive = true;
    this.mWordsTextStage.buttonMode = true;
    this.mWordsTextStage.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.mQuizPictureStage.width,
      this.mQuizPictureStage.height
    );

    this.mWordsTextStage.on("pointertap", (evt: PIXI.InteractionEvent) => {
      this.addChild(this.mMouseEffect);
      this.mMouseEffect.state.setAnimation(0, "animation", false);
      this.mMouseEffect.position.set(
        evt.data.global.x - this.mQuizPictureStage.width / 2,
        evt.data.global.y - this.mQuizPictureStage.height * 0.8
      );

      this.wordsCardSpeak();
    });

    this.startSpeak();
  }

  async onNextCard(IDX: number) {
    this.mCurrentPicture = IDX;

    this.mQuizPicture.texture = ResourceManager.Handle.getProductResource(
      WordsToKnow.Handle.productName,
      `img_${this.mQuizList[IDX]}.png`
    ).texture;
    this.mWordsText.text = this.mQuizList[IDX];

    this.mPictureSound = ResourceManager.Handle.getProductResource(
      Home.Handle.productName,
      `kor/wd_${Home.Handle.productName.slice(1)}_${IDX + 1}.mp3`
    ).sound;
    this.mWordsSound = ResourceManager.Handle.getProductResource(
      Home.Handle.productName,
      `wd_${Home.Handle.productName.slice(1)}_${IDX + 1}.mp3`
    ).sound;

    this.mWordsTextStage.interactive = false;
    this.mQuizPictureStage.interactive = false;

    await this.wordsCardSpeak();
    await this.pictureCardSpeak();

    this.mWordsTextStage.interactive = true;
    this.mQuizPictureStage.interactive = true;
  }

  startSpeak() {
    // console.log(`센터북 현재 스텝 => ${WordsToKnow.Handle.currentStep}`)
  }

  async wordsCardSpeak(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.mWordsSound) {
        this.mWordsSound.stop();
        this.mWordsSound.play();
      }
      if (this.mScaleAni) {
        this.mScaleAni.clear();
      }
      /**글자 확대 */
      this.mScaleAni = gsap.timeline();
      this.mScaleAni
        .fromTo(
          this.mWordsText.scale,
          { x: 1.4, y: 1.4 },
          { x: 1, y: 1, duration: 1, ease: "bounce" }
        )
        .yoyo(true)
        .eventCallback("onComplete", () => {
          resolve();
        });
    });
  }

  async pictureCardSpeak(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.mPictureSound) {
        this.mPictureSound.stop();
        this.mPictureSound.play();
      }
      /**글자 확대 */
      gsap
        .fromTo(
          this.mQuizPicture.scale,
          { x: 1.4, y: 1.4 },
          { x: 1, y: 1, duration: 1, ease: "bounce" }
        )
        .yoyo(true)
        .eventCallback("onComplete", () => {
          resolve();
        });
    });
  }
}
