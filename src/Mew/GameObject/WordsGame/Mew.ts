import { ResourceManager } from "@/Mew/Core/ResourceManager";
import Config from "../../Config";
import * as Util from "../../Core/Util";
import gsap from "gsap";
import { WordsGame } from "@/Mew/scenes/WordsGame";
import { Ball } from "./Ball";

export class Bomb extends PIXI.Sprite {
  private mTicker: PIXI.Ticker;

  get moveLock(): boolean {
    return this.mTicker != null;
  }
  constructor() {
    super();

    this.mTicker = null;
    const randomBomb = [];
    randomBomb.push(
      ResourceManager.Handle.getViewerResource(`bomb.png`).texture,
      ResourceManager.Handle.getViewerResource(`bomb_1.png`).texture,
      ResourceManager.Handle.getViewerResource(`bomb_2.png`).texture
    );
    Util.shuffleArray(randomBomb);
    this.texture = randomBomb[0];
    this.anchor.set(0.5);
  }

  startMove() {
    //
    if (this.mTicker) {
      this.mTicker.destroy();
      this.mTicker = null;
    }

    this.mTicker = new PIXI.Ticker();
    this.mTicker.add((deltaT) => {
      this.moveProc(deltaT);
    });
    this.mTicker.start();
  }

  finishMove() {
    if (this.mTicker) {
      this.mTicker.destroy();
      this.mTicker = null;
    }
    this.parent.removeChild(this);
    this.emit("finishMove");
    WordsGame.Handle.BGinteractive = true;
  }

  async moveProc(deltaT: number) {
    const speed = 10;
    const deltaX = Math.sin(this.rotation) * speed * deltaT;
    const deltaY = -Math.cos(this.rotation) * speed * deltaT;

    this.x = this.x + deltaX;
    this.y = this.y + deltaY;

    if (this.x > 1280) {
      this.rotation = -this.rotation;
    } else if (this.x < 0) {
      this.rotation = -this.rotation;
    }
    // 화면밖
    if (this.y < -50) {
      this.finishMove();
    }

    for (const dobj of WordsGame.Handle.ballGroup.children) {
      const ball = dobj as Ball;
      const ballpos = ball.toGlobal(new PIXI.Point(0, 0));
      const x = ballpos.x - this.x;
      const y = ballpos.y - this.y;
      const length = Math.pow(x, 2) + Math.pow(y, 2);
      // console.log(x,y,length)

      if (length < Math.pow(ball.width / 2, 2)) {
        this.finishMove();
        if (ball.ballText == WordsGame.Handle.correct) {
          WordsGame.Handle.BGinteractive = false;
          const hitSound = ResourceManager.Handle.getViewerResource(
            `snd_hit.mp3`
          ).sound;
          hitSound.play();
          await ball.correct();
          await WordsGame.Handle.quizBoard.correct();
          WordsGame.Handle.NextStep();
        } else {
          // console.log(`오답 명중 / 맞춘 알파벳[${ball.ballText}] / 정답[${WordsGame.Handle.correct}]`)
          const wrongSound = ResourceManager.Handle.getViewerResource(
            `snd_laugh.mp3`
          ).sound;
          wrongSound.play();
          await ball.wrong();
        }
      }
    }
  }
}

export class Mew extends PIXI.Container {
  private mMew: PIXI.spine.Spine;
  private mUpBody: PIXI.Container;
  private mBomb: Bomb;
  private mBombFired: Bomb;

  private mLine1: PIXI.Sprite;
  private mLine2: PIXI.Sprite;

  private mAimFlag: boolean;

  constructor() {
    super();

    const leg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`meu_leg.png`).texture
    );
    this.addChild(leg);
    leg.anchor.set(0.5);

    this.mUpBody = new PIXI.Container();
    this.addChild(this.mUpBody);

    this.mMew = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource(`common_meu.json`).spineData
    );
    this.mMew.state.setAnimation(0, `in`, false); /**push // shot */
    this.mMew.scale.set(Config.app.videoScale);
    this.mUpBody.addChild(this.mMew);

    this.mBomb = new Bomb();
    this.mBomb.y = -90;
    this.mUpBody.addChild(this.mBomb);

    this.mBombFired = new Bomb();

    this.mAimFlag = false;

    this.mLine1 = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`line.png`).texture
    );
    this.mLine1.anchor.set(0.5, 1);
    this.mLine1.position.set(0, -this.height / 2);
    this.mUpBody.addChild(this.mLine1);
    this.mLine1.visible = false;

    this.mLine2 = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`line.png`).texture
    );
    this.mLine2.anchor.set(0.5, 1);
    this.addChild(this.mLine2);
    this.mLine2.visible = false;
  }
  startAim() {
    if (this.mAimFlag == false) {
      this.mLine1.visible = true;
      this.mLine2.visible = true;
      this.mMew.state.setAnimation(0, `push`, false); /**push // shot */
      gsap.to(this.mBomb, { y: -80, duration: 0.5 });
    }
    this.mAimFlag = true;
  }

  fire() {
    if (this.mAimFlag) {
      WordsGame.Handle.BGinteractive = false;
      const shotSound = ResourceManager.Handle.getViewerResource(
        `snd_shooting.mp3`
      ).sound;
      shotSound.play();
      this.mLine1.visible = false;
      this.mLine2.visible = false;
      this.mMew.state.setAnimation(0, `shot`, false); /**push // shot */
      if (this.mBombFired.moveLock == false) {
        this.parent.addChild(this.mBombFired);
        this.mBombFired.position = this.mBomb.toGlobal(new PIXI.Point(0, 0));
        this.mBombFired.rotation = this.mUpBody.rotation;
        this.mBombFired.startMove();
        this.mBombFired.once("finishMove", () => {
          this.mBomb.visible = true;
          this.mMew.state.setAnimation(0, `in`, false); /**push // shot */
        });
        this.mBomb.visible = false;
        gsap.delayedCall(0.5, () => {
          gsap.to(this.mUpBody, { rotation: 0, duration: 0.5 });
        });
      }
    }
    this.mAimFlag = false;
  }

  calcBodyDirection(gMousePos: PIXI.Point) {
    if (this.mAimFlag) {
      const deltaPos = this.toLocal(gMousePos);
      this.mUpBody.rotation =
        Math.atan2(deltaPos.y, deltaPos.x) + (Math.PI / 180) * 90;

      if (this.mUpBody.rotation < -1.5) this.mUpBody.rotation = -1.5;
      if (this.mUpBody.rotation > 1.5) this.mUpBody.rotation = 1.5;

      const lineY =
        (Math.tan(this.mUpBody.rotation + (Math.PI / 180) * 90) *
          Config.app.width) /
        2;
      if (this.mUpBody.rotation > 0) {
        this.mLine2.position.set(Config.app.width / 2, lineY);
      } else {
        this.mLine2.position.set(-Config.app.width / 2, -lineY);
      }
      this.mLine2.rotation = -this.mUpBody.rotation; /*+ (Math.PI/180)*/
    }
  }
}
