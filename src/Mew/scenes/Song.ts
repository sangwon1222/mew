import { SceneBase } from "../Core/SceneBase";
import { ResourceManager } from "../Core/ResourceManager";
import { Button } from "../GameObject/Common/Button";
import { Video } from "../GameObject/Common/Video";
import { Header } from "../GameObject/Common/Header";
import Config from "../Config";
import { VideoController } from "../GameObject/Common/VideoController";
import gsap from "gsap";
import { SongViewerData } from "../Resource/ViewerResource/Song";
import * as SongProductData from "../Resource/ProductResource/Song";
import { Home } from "./Home";
import PIXISound from "pixi-sound";

export class Song extends SceneBase {
  private mHeader: Header;
  private mVideo: Video;

  private mController: VideoController;
  private mDimmedScreen: PIXI.Container;
  private mPreview: PIXI.Sprite;
  private mPlayButton: Button;
  private mDimmed: PIXI.Graphics;

  private mCloseControl: TweenMax;
  private mControllerFlag: boolean;

  constructor() {
    super("Song");
    // this.productName = "b1";
  }
  async onInit() {
    this.productName = Home.Handle.productName;
    PIXISound.stopAll();

    await this.loadViewerResource(SongViewerData);
    await this.loadProductResource(SongProductData[this.productName]);
  }
  async onStart() {
    this.mControllerFlag = false;

    this.mHeader = new Header();

    /**비디오 생성 */
    this.mVideo = new Video(this.productName, `song.mp4`);
    this.addChild(this.mVideo);

    this.mDimmedScreen = new PIXI.Container();
    this.addChild(this.mDimmedScreen);

    this.mController = new VideoController(this.mVideo.videoElement);
    this.mController.interactive = true;
    let moveFlag = false;

    this.mController.onStop = () => {
      this.dimmed();
    };
    this.addChild(this.mController);

    this.dimmed();

    /**플레이어바 모션 */
    this.mCloseControl = gsap.delayedCall(3, () => {
      gsap.to(this.mController, { y: this.mVideo.height, duration: 0.5 });
      this.mControllerFlag = true;
    });

    /**비디오 이벤트 */
    this.mVideo.on("pointerup", () => {
      if (this.mControllerFlag) {
        gsap
          .to(this.mController, {
            y: this.mVideo.height - this.mController.height,
            duration: 0.5,
          })
          .eventCallback("onComplete", () => {
            this.mCloseControl = gsap.delayedCall(3, () => {
              gsap.to(this.mController, {
                y: this.mVideo.height,
                duration: 0.5,
              });
              this.mControllerFlag = true;
            });
          });
      } else {
        this.mCloseControl.kill();
        gsap.to(this.mController, { y: this.mVideo.height, duration: 0.5 });
      }
      this.mControllerFlag = !this.mControllerFlag;
    });

    /**컨트롤러 이벤트 */
    this.mController
      .on("pointerover", () => {
        // console.log(`플레이어바 숨기기 취소`)
        this.mCloseControl.kill();
        moveFlag = true;
      })
      .on("pointermove", () => {
        if (moveFlag) {
          this.mCloseControl.kill();
          this.mController.y = this.mVideo.height - this.mController.height;
        }
      })
      .on("pointerout", () => {
        moveFlag = false;
        // console.log(`3초뒤, 플레이어바 숨기기 가동.`)
        this.mCloseControl = gsap.delayedCall(3, () => {
          gsap.to(this.mController, { y: this.mVideo.height, duration: 0.5 });
          this.mControllerFlag = true;
        });
      });
  }

  async onEnd() {
    gsap.to(this.mController, { y: this.mVideo.height, duration: 0.5 });
    this.mControllerFlag = true;
  }

  dimmed() {
    this.mVideo.interactive = false;
    this.mVideo.buttonMode = false;
    this.mController.position.set(0, this.mVideo.height);
    this.mControllerFlag = true;

    this.mPreview = new PIXI.Sprite(
      ResourceManager.Handle.getProductResource(
        this.productName,
        `preview.jpg`
      ).texture
    );
    this.mDimmedScreen.addChild(this.mPreview);

    this.mDimmed = new PIXI.Graphics();
    this.mDimmed.beginFill(0x0000, 0.6);
    this.mDimmed.drawRect(0, 0, Config.app.width, Config.app.height);
    this.mDimmed.endFill();
    this.mPreview.addChild(this.mDimmed);

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`song_title.png`).texture
    );
    title.position.y = 10;
    this.mDimmedScreen.addChild(title);

    this.addChild(this.mHeader);

    this.mPlayButton = new Button(
      ResourceManager.Handle.getCommonResource("play_on.png").texture,
      ResourceManager.Handle.getCommonResource(`play_down.png`).texture
    );
    this.mPlayButton.position.set(Config.app.width / 2, Config.app.height / 2);
    this.mPlayButton.scale.set(2);
    this.mDimmed.addChild(this.mPlayButton);
    this.playButton();
  }

  playButton() {
    this.mPlayButton.onClick = () => {
      this.mVideo.interactive = true;
      this.mVideo.buttonMode = true;

      gsap
        .to(this.mController, {
          y: this.mVideo.height - this.mController.height,
          duraiton: 0.5,
        })
        .eventCallback("onComplete", () => {
          this.mCloseControl.play();
        });

      this.mDimmedScreen.removeChild(this.mPreview);
      this.mVideo.play();
      //   console.log(`딤드 재생 클릭`);
    };
  }
}
