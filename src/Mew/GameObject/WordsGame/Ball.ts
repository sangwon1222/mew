import { ResourceManager } from "@/Mew/Core/ResourceManager";
import Config from "@/Mew/Config";
import gsap from "gsap";
import * as Util from "../../Core/Util";
import { WordsGame } from "../../scenes/WordsGame";

const style = new PIXI.TextStyle({
  fontFamily: "Bpreplay",
  fontSize: 52,
  // fontStyle: 'italic',
  fontWeight: "bold",
  fill: "0x0000",
  dropShadow: true,
});

const aaa = [
  `a`,
  `b`,
  `c`,
  `d`,
  `e`,
  `f`,
  `g`,
  `h`,
  `i`,
  `j`,
  `k`,
  `l`,
  `m`,
  `n`,
  `o`,
  `p`,
  `q`,
  `r`,
  `s`,
  `t`,
  `u`,
  `v`,
  `w`,
  `x`,
  `y`,
  `z`,
];
const alphabet = Util.shuffleArray(aaa);

export class Ball extends PIXI.Container {
  private mSpine: PIXI.spine.Spine;
  private mText: string;
  private mPIXIText: PIXI.Text;

  get ballText(): string {
    return this.mText;
  }

  constructor(id: string) {
    super();

    this.mSpine = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource(`common_ball.json`).spineData
    );

    this.mSpine.scale.set(Config.app.videoScale);
    this.mSpine.state.setAnimation(0, `in`, false); /**fail // in // success */
    this.addChild(this.mSpine);
    this.mSpine.y = 20;

    this.mText = id;
    this.mPIXIText = new PIXI.Text(id, style);
    this.mPIXIText.position.set(
      -this.mPIXIText.width / 2,
      -this.mPIXIText.height / 2 - 10
    );
    this.addChild(this.mPIXIText);
    // console.log(id)
  }

  correct(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.mSpine.state.setAnimation(0, `success`, false);
      gsap.delayedCall(
        this.mSpine.state.data.skeletonData.findAnimation(`success`).duration,
        () => {
          this.removeChild(this.mSpine);
          resolve();
          gsap
            .to(this.mPIXIText, { y: Config.app.height, duration: 2 })
            .eventCallback("onComplete", () => {
              this.removeChildren();
            });
        }
      );
    });
  }

  wrong(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.mSpine.state.setAnimation(0, `fail`, false);
      gsap.delayedCall(
        this.mSpine.state.data.skeletonData.findAnimation(`fail`).duration,
        () => {
          gsap
            .to(this.mPIXIText.scale, { x: 1.2, y: 1.2, duration: 2 })
            .yoyo(true)
            .repeat(2)
            .eventCallback("onComplete", () => {
              resolve();
            });
        }
      );
    });
  }
}

export class BallGroup extends PIXI.Container {
  private mBallArray: Array<Ball>;
  private mCorrect: string;
  private mCorrectIDX: number;
  private mWrongArray: Array<string>;

  get correct(): string {
    return this.mCorrect;
  }
  get correctIDX(): number {
    return this.mCorrectIDX;
  }

  constructor() {
    super();

    this.shuffleText();

    this.pivot.set(this.width / 2, this.height / 2);
  }

  shuffleText() {
    this.mBallArray = [];
    this.mCorrect = "";
    this.mWrongArray = [];

    const aaa = [];
    for (let i = 0; i < WordsGame.Handle.quizData.length; i++) {
      aaa.push(i);
    }
    Util.shuffleArray(aaa);

    this.mCorrect = WordsGame.Handle.quizData[aaa[0]];
    this.mCorrectIDX = aaa[0];

    // console.warn(
    //   `정답 알파벳=>`,
    //   this.mCorrect,
    //   `알파벳 인덱스=>`,
    //   this.mCorrectIDX
    // );

    for (let i = 0; i < alphabet.length; i++) {
      if (alphabet[i] !== this.mCorrect) {
        this.mWrongArray.push(alphabet[i]);
        if (this.mWrongArray.length == 5) {
          break;
        }
      }
    }

    const a = [0, 1, 2, 3, 4];
    Util.shuffleArray(a);
    const random = a[0];
    let offSetX = 0;
    for (let i = 0; i < 5; i++) {
      if (i == random) {
        // console.log(`${i}번째 풍선이 정답`);
        const ball = new Ball(this.mCorrect);
        ball.position.set(offSetX, Config.app.height * 0.3);
        offSetX += ball.width * 2;
        this.mBallArray.push(ball);
        this.addChild(ball);
        gsap
          .to(ball, { y: ball.y + 150, duration: 1 + i * 0.1 })
          .yoyo(true)
          .repeat(-1);
      } else {
        const ball = new Ball(this.mWrongArray[i]);
        ball.position.set(offSetX, Config.app.height * 0.3);
        offSetX += ball.width * 2;
        this.mBallArray.push(ball);
        this.addChild(ball);
        gsap
          .to(ball, { y: ball.y + 150, duration: 1 + i * 0.1 })
          .yoyo(true)
          .repeat(-1);
      }
    }
  }
}
