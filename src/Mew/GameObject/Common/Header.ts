import { App } from "../../Core/App";
import { ResourceManager } from "../../Core/ResourceManager";
import { Button } from "./Button";
import gsap from "gsap";
import { Rectangle } from "pixi.js";
import Config from "@/Mew/Config";

const gameList = [
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

export class Header extends PIXI.Container {
  private mHeader: PIXI.Sprite;
  private mHomeButton: Button;
  private mSlideDownButton: Button;
  private mPreButton: Button;

  private mClickFlag: boolean;
  private mMoveFlag: boolean;

  constructor() {
    super();

    this.mMoveFlag = true;
    this.mClickFlag = true;

    /**백그라운드 */
    this.mHeader = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`common_navi_bg.png`).texture
    );
    this.addChild(this.mHeader);

    /**홈버튼 */
    this.mHomeButton = new Button(
      ResourceManager.Handle.getCommonResource(
        "common_navi_btn_home_normal.png"
      ).texture,
      ResourceManager.Handle.getCommonResource(
        "common_navi_btn_home_down.png"
      ).texture
    );

    /**슬라이드 다운 버튼 */
    this.mSlideDownButton = new Button(
      ResourceManager.Handle.getCommonResource(`common_navi_arrow.png`).texture
    );

    /**이전 게임 버튼 */
    this.mPreButton = new Button(
      ResourceManager.Handle.getCommonResource(
        `common_navi_btn_back_normal.png`
      ).texture,
      ResourceManager.Handle.getCommonResource(
        `common_navi_btn_back_down.png`
      ).texture
    );

    this.mHeader.addChild(this.mHomeButton, this.mSlideDownButton);

    if (App.Handle.currentSceneIDX != 1) {
      this.mHeader.addChild(this.mPreButton);
    }

    /**포지션 설정 */
    this.mHomeButton.position.set(
      this.mHeader.width * 0.95,
      this.mHeader.height * 0.35
    );
    this.mPreButton.position.set(
      this.mHeader.width * 0.95 - this.mHomeButton.width,
      this.mHeader.height * 0.35
    );
    this.mSlideDownButton.position.set(
      this.mHeader.width * 0.922,
      this.mHeader.height * 0.85
    );

    /**클릭영역 설정 */
    this.mSlideDownButton.hitArea = new Rectangle(
      -this.mSlideDownButton.width * 1.5,
      -this.mSlideDownButton.height / 2,
      this.mSlideDownButton.width * 3,
      this.mSlideDownButton.height * 2
    );

    /**클릭 이벤트 */
    this.mHomeButton.onClick = () => {
      App.Handle.goScene("Home");
    };
    this.mPreButton.onClick = () => {
      App.Handle.goScene(gameList[App.Handle.currentSceneIDX - 1]);
      // console.log(`,${App.Handle.currentSceneIDX},`)
    };
    this.mSlideDownButton.onClick = () => {
      if (this.mClickFlag) {
        this.mClickFlag = false;

        if (this.mMoveFlag) {
          gsap.to(this.mSlideDownButton, { angle: 180, duration: 0.5 });
          gsap
            .to(this, {
              y: 0,
              duration: 0.5,
            })
            .eventCallback("onComplete", () => {
              this.mMoveFlag = false;
            });
        } else {
          gsap.to(this.mSlideDownButton, { angle: 0, duration: 0.5 });
          gsap
            .to(this, {
              y: -this.mHeader.height * 0.75,
              duration: 0.5,
            })
            .eventCallback("onComplete", () => {
              this.mMoveFlag = true;
            });
        }

        gsap.delayedCall(0.6, () => {
          this.mClickFlag = true;
        });
      }
    };

    this.position.set(
      Config.app.width / 2 - this.mHeader.width / 2,
      -this.mHeader.height * 0.75
    );
  }
}
