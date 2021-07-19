import { SceneBase } from "../Core/SceneBase";
import { App } from "../Core/App";
import { HowTo } from "../GameObject/Common/HowTo";
import { Outro } from "../GameObject/Common/Outro";
import { Header } from "../GameObject/Common/Header";
import { ResourceManager } from "../Core/ResourceManager";
import { Button } from "../GameObject/Common/Button";
import { ScreenShotButton } from "../GameObject/Common/ScreenShotButton";
import { MyOwnStageViewerData } from "../Resource/ViewerResource/MyOwnStage";
import * as MyOwnStageProductData from "../Resource/ProductResource/MyOwnStage";
import Config from "../Config";
import gsap from "gsap";
import { PlayGround } from "../GameObject/MyOwnStage/PlayGround";
import PIXISound from "pixi-sound";
import { Home } from "./Home";

export class SavePopup extends PIXI.Sprite {
  private mPopup: PIXI.Sprite;

  private dafaultTxt: string;
  private successTxt: string;
  private failTxt: string;

  private popUpTxt: PIXI.Text;
  private txtStyle: PIXI.TextStyle;

  constructor() {
    super();
    this.dafaultTxt = "Saving...";
    this.successTxt = "Save complete.";
    this.failTxt = "Fail to store.";

    this.txtStyle = new PIXI.TextStyle({
      align: "center",
      fill: "#FFFFFF",
      fontFamily: "BPreplay",
      fontWeight: "800",
      fontSize: 40,
      padding: 10,
    });

    this.popUpTxt = new PIXI.Text(this.dafaultTxt, this.txtStyle);

    this.mPopup = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource("common_save_popup.mp3").texture
    );
    this.mPopup.anchor.set(0.5, 0.5);
    this.mPopup.position.set(Config.app.width / 2, Config.app.height / 2);
    this.mPopup.renderable = false;

    this.mPopup.addChild(this.popUpTxt);
    this.addChild(this.mPopup);
  }

  doSave() {
    //
  }
}

export class MyOwnStage extends SceneBase {
  private mHeader: Header;

  private preBtn: Button;
  private nextBtn: Button;
  private upDownBtn: Button;

  private screenShotBtn: ScreenShotButton;

  private isClick: boolean;

  private mMask: PIXI.Graphics;

  private uiContainer: PIXI.Container;
  private sliderContainer: PIXI.Container;
  private stickerContainer: PIXI.Container;
  private thumbnailImgWrapContainer: PIXI.Container;
  private thumbnailImgContainer: PIXI.Container;

  private productAry: Array<string>;

  private currentScroll: number;
  private maxScroll: number;

  private listXposAry: Array<number>;

  private openYPos: number;
  private closeYpos: number;
  private isOpen: boolean;

  private mPlayGround: PlayGround;

  constructor() {
    super(`MyOwnStage`);
  }

  async onInit() {
    // this.productName = "b1"
    this.productName = Home.Handle.productName;
    PIXISound.stopAll();

    // const responseViewer = await this.getViewerJSON();
    await this.loadViewerResource(MyOwnStageViewerData);

    // const responseProduct = await this.getProductJSON();
    await this.loadProductResource(MyOwnStageProductData[this.productName]);

    //const responseCommon = await ResourceManager.Handle.getCommonJSON("common");
    //await this.loadCommonResource(responseCommon.data);

    this.productAry = [];
    this.listXposAry = [];

    this.currentScroll = 0;
    this.maxScroll = 0;

    this.isClick = true;
    this.isOpen = false;
    // this.productAry = responseProduct.data.images;
    this.productAry = MyOwnStageProductData[this.productName].images;
  }

  async onStart() {
    this.mHeader = new Header();
    this.uiContainer = new PIXI.Container();
    this.sliderContainer = new PIXI.Container();
    this.thumbnailImgContainer = new PIXI.Container();
    this.thumbnailImgWrapContainer = new PIXI.Container();
    this.stickerContainer = new PIXI.Container();

    this.mMask = new PIXI.Graphics();
    this.mMask.beginFill(0xff0000);
    this.mMask.drawRect(100, 100, 1080, 150);
    this.mMask.endFill();

    this.drawUI();
    this.drawSticker();

    this.mPlayGround = new PlayGround(this.productName);
    this.stickerContainer.addChild(this.mPlayGround);

    this.addChild(this.stickerContainer);
    this.addChild(this.uiContainer);

    this.uiContainer.addChild(this.sliderContainer);
    this.sliderContainer.addChild(this.thumbnailImgContainer);
    this.addChild(this.mHeader);

    this.setButtonState();
    this.sliderContainer.addChild(this.mMask);
    this.thumbnailImgContainer.mask = this.mMask;

    /**HOWTO */
    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    this.removeChild(howTo);

    const bgSnd = ResourceManager.Handle.getViewerResource("snd_bgm.mp3").sound;
    bgSnd.play({ loop: true });

    //root
    // mHeader
    // uiContainer
    // -->sliderContainer
    //    -->thumbnailImgContainer
    //       -->thumbnailImgWrapContainer
    // stickerContainer
  }

  async onEnd() {
    PIXISound.stopAll();
    /**OUTRO */
    const outro = new Outro();
    this.addChild(outro);
    await outro.outro();
  }

  drawUI() {
    // title img
    const titleImg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource("myownstage_text.png").texture
    );
    titleImg.y = 20;
    this.uiContainer.addChild(titleImg);

    // slider bg
    const sliderBg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource("sticker_bg.png").texture
    );
    this.sliderContainer.addChild(sliderBg);
    sliderBg.position.set(Config.app.width / 2 - sliderBg.width / 2, 0);

    this.openYPos = Config.app.height - this.sliderContainer.height;
    this.closeYpos = this.openYPos + 170;

    this.sliderContainer.position.set(0, this.closeYpos);

    // make UI
    this.preBtn = new Button(
      ResourceManager.Handle.getViewerResource("btn_pre.png").texture,
      ResourceManager.Handle.getViewerResource("btn_pre_down.png").texture,
      ResourceManager.Handle.getViewerResource("btn_pre_over.png").texture,
      ResourceManager.Handle.getViewerResource("btn_pre_disabled.png").texture
    );
    this.nextBtn = new Button(
      ResourceManager.Handle.getViewerResource("btn_next.png").texture,
      ResourceManager.Handle.getViewerResource("btn_next_down.png").texture,
      ResourceManager.Handle.getViewerResource("btn_next_over.png").texture,
      ResourceManager.Handle.getViewerResource("btn_next_disabled.png").texture
    );
    this.upDownBtn = new Button(
      ResourceManager.Handle.getViewerResource("btn_up_normal.png").texture,
      ResourceManager.Handle.getViewerResource("btn_up_down.png").texture,
      ResourceManager.Handle.getViewerResource("btn_up_over.png").texture
    );
    this.upDownBtn.hitArea = new PIXI.Circle(0, 0, 40);

    this.screenShotBtn = new ScreenShotButton(Config.app.width / 2, 70);
    this.uiContainer.addChild(this.screenShotBtn);

    // add Button Event
    this.prevButton();
    this.nextButton();
    this.upDownButton();
    this.screenShotButton();

    this.preBtn.position.set(54, 168);
    this.nextBtn.position.set(1226, 168);
    this.upDownBtn.position.set(Config.app.width / 2, 56);

    this.sliderContainer.addChild(this.preBtn);
    this.sliderContainer.addChild(this.nextBtn);
    this.sliderContainer.addChild(this.upDownBtn);
  }

  drawSticker() {
    const length = this.productAry.length;
    let xpos = 0;
    const space = 26;

    for (let i = 0; i < length; i++) {
      const imgName: string = this.productAry[i];
      if (imgName != "bg.png") {
        const spr = new PIXI.Sprite(
          ResourceManager.Handle.getProductResource(
            this.productName,
            imgName
          ).texture
        );
        spr.anchor.y = 0.5;
        spr.x = xpos;
        spr.y = 122;
        this.listXposAry.push(xpos);
        spr.name = imgName;
        spr.buttonMode = true;
        spr.interactive = true;
        spr.on("pointertap", (evt: PIXI.InteractionEvent) => {
          // console.log(spr.name);
          if (!this.isClick) return;
          //SoundController.Handle.play(`snd_sticker_click.mp3`);
          const snd = ResourceManager.Handle.getViewerResource(
            "snd_sticker_click.mp3"
          ).sound;
          snd.play();

          const mpoint: PIXI.Point = this.toLocal(evt.data.global);
          this.playGround.createAsset(spr.name, mpoint);
        });

        if (spr.height > spr.width) {
          spr.height = 138;
          spr.scale.x = spr.scale.y;
        } else {
          spr.width = 138;
          spr.scale.y = spr.scale.x;
        }
        xpos += Math.floor(spr.width + space);
        this.thumbnailImgWrapContainer.addChild(spr);
      }
    }

    // maxScroll 구하기.
    for (let j = 0; j < this.listXposAry.length; j++) {
      const compWidth =
        -this.listXposAry[j] + this.thumbnailImgWrapContainer.width;
      // console.log(-this.listXposAry[j] + this.thumbnailImgWrapContainer.width);
      if (compWidth > this.mMask.width) {
        this.maxScroll++;
      } else {
        break;
      }
    }
    this.thumbnailImgContainer.addChild(this.thumbnailImgWrapContainer);
    this.thumbnailImgContainer.position.set(100, 50);
  }

  setButtonState() {
    if (this.currentScroll == 0) {
      this.preBtn.disable = true;
    } else {
      this.preBtn.disable = false;
    }

    // if (this.thumbnailImgWrapContainer.x + this.thumbnailImgWrapContainer.width < this.mMask.width) {
    if (this.currentScroll == this.maxScroll) {
      this.nextBtn.disable = true;
    } else {
      this.nextBtn.disable = false;
    }
  }

  prevButton() {
    this.preBtn.onClick = () => {
      // console.log("prevButton Click");
      if (!this.isClick) return;
      this.isClick = false;
      this.playGround.unselectAll();
      this.currentScroll--;
      this.moveThumbnailImg();
    };
  }

  nextButton() {
    this.nextBtn.onClick = () => {
      // console.log("nextButton Click");
      if (!this.isClick) return;
      this.isClick = false;
      this.playGround.unselectAll();
      this.currentScroll++;
      this.moveThumbnailImg();
    };
  }

  moveThumbnailImg() {
    const moveX = this.listXposAry[this.currentScroll];
    gsap
      .to(this.thumbnailImgWrapContainer, {
        x: -moveX,
        duration: 0.4,
      })
      .eventCallback("onComplete", () => {
        this.setButtonState();
        this.isClick = true;
        // console.log(-this.listXposAry[this.currentScroll] + this.thumbnailImgWrapContainer.width);
        // console.log(this.thumbnailImgWrapContainer.x + this.thumbnailImgWrapContainer.width);
      });
  }

  upDownButton() {
    this.upDownBtn.onClick = () => {
      // console.log("upDownButton Click");
      if (!this.isClick) return;
      this.isClick = false;
      this.playGround.unselectAll();

      const moveY = this.isOpen ? this.closeYpos : this.openYPos;
      const rotV = this.isOpen ? 0 : 180;

      this.isOpen = !this.isOpen;

      gsap
        .to(this.sliderContainer, {
          y: moveY,
          duration: 0.5,
        })
        .eventCallback("onComplete", () => {
          this.isClick = true;
        });

      gsap.to(this.upDownBtn, {
        angle: rotV,
        duration: 0.5,
      });
    };
  }

  // 모든 UI 요소 사용 금지
  lock(flag: boolean) {
    flag = !flag;
    //명시적으로 알기 쉽게 true면 잠금 상태.
    this.isClick = flag;
    this.preBtn.interactive = flag;
    this.nextBtn.interactive = flag;
    this.upDownBtn.interactive = flag;
    this.screenShotBtn.interactive = flag;
    this.playGround.interactive = flag;
    this.playGround.setChildInteractive(flag);
  }

  screenShotButton() {
    this.screenShotBtn.onScreenShot = () => {
      this.playGround.unselectAll();
      this.lock(true);

      const renderTexture = PIXI.RenderTexture.create({
        width: 1280,
        height: 800,
      });
      App.Handle.renderer.render(this.stickerContainer, renderTexture);

      const canvas = App.Handle.renderer.extract.canvas(renderTexture);
      canvas.toBlob((b) => {
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(b, "Mew_MyOwnStage.png");
        } else {
          navigator;
          const link = document.createElement("a");
          link.download = "Mew_MyOwnStage.png";
          link.href = canvas.toDataURL("image/png");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, "image/png");
      //SoundController.Handle.play(`snd_save.mp3`);
      const snd = ResourceManager.Handle.getViewerResource("snd_save.mp3")
        .sound;
      snd.play();
      gsap.delayedCall(snd.duration, () => {
        this.onEnd();
      });
    };
  }

  get playGround(): PlayGround {
    return this.mPlayGround;
  }
}
