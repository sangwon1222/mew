import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { Button } from "../Common/Button";
import { WordsGame } from "@/Mew/scenes/WordsGame";
import gsap from "gsap";

export class WordsBG extends PIXI.Sprite {
  private mBoxBG: PIXI.Texture;
  private mEmptyBG: PIXI.Texture;
  private mText: PIXI.Text;

  constructor(
    box: PIXI.Texture,
    empty: PIXI.Texture,
    id: number,
    text: PIXI.Text
  ) {
    super();
    box = ResourceManager.Handle.getViewerResource(`word_box.png`).texture;
    empty = ResourceManager.Handle.getViewerResource(`word_box_empty.png`)
      .texture;
    this.mBoxBG = box;
    this.mEmptyBG = empty;
    this.texture = box;

    this.mText = text;
    this.mText.anchor.set(0.5);
    this.mText.position.set(this.width / 2, 0);
    this.addChild(this.mText);
  }

  changeBox(flag: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (flag) {
        gsap
          .to(this, { alpha: 0, duration: 0.5 })
          .eventCallback("onComplete", () => {
            this.texture = this.mBoxBG;
            gsap.to(this.mText, { alpha: 1, duration: 0.5 });
            gsap
              .to(this, { alpha: 1, duration: 0.5 })
              .eventCallback("onComplete", () => {
                resolve();
              });
          });
      } else {
        this.texture = this.mEmptyBG;
        this.mText.alpha = 0;
        resolve();
      }
    });
  }
}

export class QuizBoard extends PIXI.Container {
  private mBG: PIXI.NineSlicePlane;
  private mWordGroup: PIXI.Container;
  private mSoundButton: Button;

  private mWordsBGArray: Array<WordsBG>;

  constructor() {
    super();
    this.mWordsBGArray = [];

    this.interactive = true;

    this.mBG = new PIXI.NineSlicePlane(
      ResourceManager.Handle.getViewerResource(`word_box_bg.png`).texture,
      50,
      50,
      50,
      50
    );
    this.addChild(this.mBG);

    this.mWordGroup = new PIXI.Container();
    this.createQuizBoard();

    this.mSoundButton = new Button(
      ResourceManager.Handle.getCommonResource(
        `common_btn_speaker_normal.png`
      ).texture,
      ResourceManager.Handle.getCommonResource(
        `common_btn_speaker_down.png`
      ).texture,
      ResourceManager.Handle.getCommonResource(
        `common_btn_speaker_over.png`
      ).texture
    );
    this.mSoundButton.onClick = () => {
      this.onSound();
    };
    this.addChild(this.mSoundButton);

    this.mSoundButton.position.set(
      this.mBG.width + this.mSoundButton.width / 2,
      this.mBG.height / 2
    );
  }

  onSound(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let sndNum = 1;
      const productNum = (this.parent as WordsGame).productName;
      if (productNum == "b1") sndNum = 2;
      if (productNum == "b2") sndNum = 5;
      if (productNum == "b3") sndNum = 3;
      if (productNum == "b4") sndNum = 1;
      if (productNum == "b5") sndNum = 4;
      if (productNum == "b6") sndNum = 6;
      if (productNum == "b7") sndNum = 7;
      if (productNum == "b8") sndNum = 8;
      if (productNum == "b9") sndNum = 9;
      if (productNum == "b10") sndNum = 10;
      const sound = ResourceManager.Handle.getProductResource(
        WordsGame.Handle.productName,
        `wd_${sndNum}_${WordsGame.Handle.correctID + 1}.mp3`
      ).sound;
      sound.play();
      this.mSoundButton.wrongMotion(
        ResourceManager.Handle.getCommonResource(`common_btn_speaker_down.png`)
          .texture
      );
      gsap.delayedCall(sound.duration + 0.5, () => {
        this.mSoundButton.correctMotion(
          ResourceManager.Handle.getCommonResource(
            `common_btn_speaker_normal.png`
          ).texture
        );
        resolve();
      });
    });
  }

  createQuizBoard() {
    let offSetX = 0;
    for (let i = 0; i < WordsGame.Handle.quizData.length; i++) {
      const wordsBG = new WordsBG(
        ResourceManager.Handle.getViewerResource(`word_box.png`).texture,
        ResourceManager.Handle.getViewerResource(`word_box_empty.png`).texture,
        i,
        new PIXI.Text(WordsGame.Handle.quizData[i], WordsGame.Handle.textStyle)
      );
      wordsBG.anchor.set(0, 0.5);
      wordsBG.position.set(offSetX, wordsBG.height / 2);
      offSetX += wordsBG.width * 1.2;
      this.mWordGroup.addChild(wordsBG);

      if (i == WordsGame.Handle.ballGroup.correctIDX) {
        wordsBG.changeBox(false);
      }
      this.mWordsBGArray.push(wordsBG);
    }
    this.mWordGroup.pivot.set(
      this.mWordGroup.width / 2,
      this.mWordGroup.height / 2
    );
    this.addChild(this.mWordGroup);
    this.mBG.width = this.width * 1.1;
    this.mWordGroup.position.set(this.mBG.width / 2, this.mBG.height / 2);
  }

  async correct() {
    console.log(`퀴즈보드 정답`);
    await this.mWordsBGArray[WordsGame.Handle.ballGroup.correctIDX].changeBox(
      true
    );
    await this.onSound();
  }
}
