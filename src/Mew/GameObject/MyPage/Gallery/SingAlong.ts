import Config from "@/Mew/Config";
import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { SingAlongModule } from "@/store/SingAlong";
import gsap from "gsap";
import { Button } from "../../Common/Button";

export class SingAlongGallery extends PIXI.Sprite {
  private mGallery: PIXI.Container;
  private mGalleryId = 1;
  private mPagination: PIXI.Text;

  constructor() {
    super();
    this.visible = false;
  }
  start() {
    this.visible = true;
    this.interactive = true;

    const BG = ResourceManager.Handle.getViewerResource(
      "popup_singalong_bg.png"
    ).texture;
    this.texture = BG;

    const close = new Button(
      ResourceManager.Handle.getViewerResource(
        "singalong_closebtn_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "singalong_closebtn_down.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "singalong_closebtn_over.png"
      ).texture
    );
    close.position.set(1280 - close.width, 40);
    this.addChild(close);
    close.onClick = () => {
      this.destroy();
    };

    this.mGallery = new PIXI.Container();
    this.addChild(this.mGallery);

    const left = new Button(
      ResourceManager.Handle.getViewerResource(
        "singalong_arrow_l_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "singalong_arrow_l_down.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "singalong_arrow_l_over.png"
      ).texture
    );
    left.position.set(left.width / 2, 800 / 2);
    this.addChild(left);
    left.onClick = () => {
      if (this.mGalleryId !== 1) {
        this.mGalleryId -= 1;
        this.changeList();
      }
    };

    const right = new Button(
      ResourceManager.Handle.getViewerResource(
        "singalong_arrow_r_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "singalong_arrow_r_down.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "singalong_arrow_r_over.png"
      ).texture
    );
    right.position.set(
      Config.app.width - right.width / 2,
      Config.app.height / 2
    );
    this.addChild(right);
    right.onClick = () => {
      if (this.mGalleryId !== 6) {
        this.mGalleryId += 1;
        this.changeList();
      }
    };

    this.createGalleryStage();

    this.changeList();
  }

  createGalleryStage() {
    const guide = new PIXI.Graphics();
    guide.lineStyle(5, 0x000000, 1);
    guide.drawRect(0, 0, Config.app.width, Config.app.height * 0.8);
    guide.endFill();
    // this.mGallery.addChild(guide);

    const style = new PIXI.TextStyle({
      fontFamily: "Bpreplay",
      fontSize: 48 * 0.67,
      fontWeight: "bold",
      fill: "0x0000",
      dropShadow: true,
    });

    this.mPagination = new PIXI.Text(`${this.mGalleryId}/6`, style);
    this.mPagination.position.set(
      this.width / 2 - this.mPagination.width / 2,
      100
    );
    this.addChild(this.mPagination);
  }

  changeList() {
    gsap.killTweensOf(this.mGallery);
    this.mPagination.text = `${this.mGalleryId}/6`;
    this.mGallery.removeChildren();
    let y = 0;
    for (let i = 1; i <= 6; i++) {
      const respo = new PIXI.Sprite();

      if (SingAlongModule.setRecieved.length !== 0) {
        respo.texture = ResourceManager.Handle.getViewerResource(
          SingAlongModule.setRecieved.arguments
        ).texture;
      } else {
        respo.texture = ResourceManager.Handle.getViewerResource(
          `no_cover.png`
        ).texture;
      }
      respo.position.set(0, y);
      this.mGallery.addChild(respo);
      y += respo.height;
    }

    this.mGallery.position.set(0, 800);
    gsap.to(this.mGallery, { y: Config.app.height * 0.2, duration: 0.25 });
  }

  destroy() {
    this.removeChildren();
    this.visible = false;
  }
}
