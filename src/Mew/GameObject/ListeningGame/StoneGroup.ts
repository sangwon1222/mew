import { ResourceManager } from "../../Core/ResourceManager";
import Config from "../../Config";
import { ListeningGame } from "@/Mew/scenes/ListeningGame";
import gsap from "gsap";
import { MewState } from "./Mew";
import * as Util from "../../Core/Util";

const style = new PIXI.TextStyle({
  fontFamily: "Bpreplay",
  fontSize: 48,
  // fontStyle: 'italic',
  fontWeight: "bold",
  fill: "0x0000",
  dropShadow: true,
});

export enum StoneState {
  normal,
  click,
  fail,
  reset,
}

export class Stone extends PIXI.spine.Spine {
  private mStoneState: StoneState;
  private mText: PIXI.Text;
  private mAnswer: string;

  get StoneState(): StoneState {
    return this.mStoneState;
  }
  set StoneState(v: StoneState) {
    this.mStoneState = v;
    this._updateStoneState();
  }

  constructor(answer: any) {
    super(
      ResourceManager.Handle.getViewerResource(`common_word.json`).spineData
    );

    this.scale.set(Config.app.videoScale);

    this.mStoneState = StoneState.normal;
    this._updateStoneState();
    this.mAnswer = answer;
    if (answer) {
      this.mText = new PIXI.Text(answer, style);
      this.mText.position.set(-this.mText.width / 2, -this.mText.height / 2);
      this.mText.scale.x = -1;
      this.mText.angle = 180;
      this.slotContainers[this.skeleton.findSlotIndex("p_defalt")].addChild(
        this.mText
      );
      this.slotContainers[
        this.skeleton.findSlotIndex("p_defalt")
      ].updateTransform();
    }

    this.hitArea = new PIXI.Rectangle(
      -(this.width * 1.2) / 2,
      -this.height * 1.2,
      this.width * 1.2,
      this.height * 1.2
    );

    this.on("pointertap", async () => {
      ListeningGame.Handle.stone.stoneFlag(false);
      const pos = this.parent.parent.toLocal(this.position);
      const width = this.width + 10;

      await ListeningGame.Handle.mew.jumpMew(pos, width);
      this._updateStoneState();
      await this.CorrectOrWrong();
    });
  }

  async CorrectOrWrong() {
    // console.log(`클릭한 단어 [${this.mAnswer}] , 현재 정답 단어 [${ListeningGame.Handle.answer}]`)
    if (this.mAnswer == ListeningGame.Handle.answer) {
      /**정답 */
      this.StoneState = StoneState.click;
      await ListeningGame.Handle.onNextQuiz();
    } else {
      /**오답 */
      this.StoneState = StoneState.fail;
      ListeningGame.Handle.mew.mewState = MewState.fail;
      gsap.delayedCall(1.5, () => {
        ListeningGame.Handle.mew.mewState = MewState.in;
        gsap.delayedCall(1.5, () => {
          ListeningGame.Handle.stone.stoneFlag(true);
        });
      });
    }
  }

  _updateStoneState() {
    switch (this.mStoneState) {
      case StoneState.normal:
        {
          this.state.setAnimation(0, "defalt", true);
        }
        break;
      case StoneState.click:
        {
          this.state.setAnimation(0, "click", false);
          const jumpSound = ResourceManager.Handle.getViewerResource(
            `snd_jump.mp3`
          ).sound;
          jumpSound.play();
        }
        break;
      case StoneState.fail:
        {
          this.state.setAnimation(0, "fail", false);
          const failSound = ResourceManager.Handle.getViewerResource(
            `snd_water.mp3`
          ).sound;
          failSound.play();
          gsap.delayedCall(
            this.state.data.skeletonData.findAnimation(`fail`).duration,
            () => {
              this.mStoneState = StoneState.reset;
              this._updateStoneState();
            }
          );
        }
        break;
      case StoneState.reset:
        {
          this.state.setAnimation(0, "reset", false);
          gsap.delayedCall(
            this.state.data.skeletonData.findAnimation(`reset`).duration,
            () => {
              this.mStoneState = StoneState.normal;
              this._updateStoneState();
            }
          );
        }
        break;
    }
  }

  banClick(delay: number) {
    this.tint = 0xbcbcbc;
    gsap.delayedCall(delay, () => {
      this.tint = 0xffffff;
    });
  }
}

export class StoneGroup extends PIXI.Container {
  private mStoneArray: Array<Stone>;

  constructor() {
    super();
    this.mStoneArray = [];
    this.resetStone();
    this.pivot.x = this.width / 2;
  }

  resetStone() {
    this.mStoneArray = [];
    this.removeChildren();

    const sample = new Stone(ListeningGame.Handle.quizData[0].answer);
    let offSetX = sample.width / 2;

    /**스톤 만들기 */
    const exampleList = [];
    exampleList.push(ListeningGame.Handle.quizData[0].answer);
    exampleList.push(ListeningGame.Handle.quizData[0].wrong1);
    exampleList.push(ListeningGame.Handle.quizData[0].wrong2);

    /**스톤 섞기 */
    const random = [0, 1, 2];
    Util.shuffleArray(random);
    for (let i = 0; i < exampleList.length; i++) {
      const stone = new Stone(exampleList[random[i]]);
      stone.x = offSetX;
      offSetX += stone.width;
      this.mStoneArray.push(stone);
      this.addChild(stone);
    }
  }

  stoneFlag(flag: boolean) {
    if (!flag) {
      for (let i = 0; i < this.mStoneArray.length; i++) {
        this.mStoneArray[i].interactive = false;
        this.mStoneArray[i].buttonMode = false;
      }
    } else {
      for (let i = 0; i < this.mStoneArray.length; i++) {
        this.mStoneArray[i].interactive = true;
        this.mStoneArray[i].buttonMode = true;
      }
    }
  }

  banClickStone(delay: number) {
    for (let i = 0; i < this.mStoneArray.length; i++) {
      this.mStoneArray[i].banClick(delay);
    }
  }
}
