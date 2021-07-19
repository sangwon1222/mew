import Config from "@/Mew/Config";
import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { Button } from "../Common/Button";
import { ToggleButton } from "../Common/ToggleButton";
import { Book, PlayMode } from "./Book";

export class Controller extends PIXI.Sprite {
  private mBook: Book;
  private mPrevButton: Button;
  private mPlayButton: Button;
  private mPauseButton: Button;
  private mNextButton: Button;
  private mWandOnButton: Button;
  private mWandOffButton: Button;

  private mButtonClickSnd: PIXI.sound.Sound;
  private mWandClickSnd: PIXI.sound.Sound;

  constructor(book: Book) {
    super(ResourceManager.Handle.getViewerResource("underbar.png").texture);
    this.anchor.set(0, 1);

    this.mBook = book;
    this.mBook.on("change-page", () => {
      this.updateButtonState();
    });
    this.mBook.on("play", () => this.updateButtonState());
    this.mBook.on("pause", () => this.updateButtonState());
    this.mBook.on("stop", () => this.updateButtonState());
    this.mBook.on("change-mode", () => this.updateButtonState());

    this.mButtonClickSnd =
      ResourceManager.Handle.getCommonResource("common_snd_btn.mp3").sound;
    this.mWandClickSnd =
      ResourceManager.Handle.getViewerResource("snd_magic.mp3").sound;

    const buttonAnchor = new PIXI.Container();
    buttonAnchor.position.set(this.width / 2, -40);
    this.addChild(buttonAnchor);

    this.mPrevButton = new Button(
      ResourceManager.Handle.getViewerResource("before_btn_normal.png").texture,
      ResourceManager.Handle.getViewerResource("before_btn_down.png").texture,
      ResourceManager.Handle.getViewerResource("before_btn_over.png").texture
    );
    buttonAnchor.addChild(this.mPrevButton);
    this.mPrevButton.position.set(-80, 0);

    this.mNextButton = new Button(
      ResourceManager.Handle.getViewerResource("next_btn_normal.png").texture,
      ResourceManager.Handle.getViewerResource("next_btn_down.png").texture,
      ResourceManager.Handle.getViewerResource("next_btn_over.png").texture
    );
    buttonAnchor.addChild(this.mNextButton);
    this.mNextButton.position.set(80, 0);

    this.mPlayButton = new Button(
      ResourceManager.Handle.getViewerResource("play_btn_normal.png").texture,
      ResourceManager.Handle.getViewerResource("play_btn_down.png").texture,
      ResourceManager.Handle.getViewerResource("play_btn_over.png").texture
    );
    buttonAnchor.addChild(this.mPlayButton);
    this.mPlayButton.position.set(0, 0);

    this.mPauseButton = new Button(
      ResourceManager.Handle.getViewerResource("stop_btn_normal.png").texture,
      ResourceManager.Handle.getViewerResource("stop_btn_down.png").texture,
      ResourceManager.Handle.getViewerResource("stop_btn_over.png").texture
    );
    buttonAnchor.addChild(this.mPauseButton);
    this.mPauseButton.position.set(0, 0);

    this.mWandOnButton = new Button(
      ResourceManager.Handle.getViewerResource(
        "magicstick_btn_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "magicstick_btn_down.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "magicstick_btn_over.png"
      ).texture
    );
    buttonAnchor.addChild(this.mWandOnButton);
    this.mWandOnButton.position.set(Config.app.width / 2 - 50, 0);

    this.mWandOffButton = new Button(
      ResourceManager.Handle.getViewerResource(
        "magicstick_btn_down.png"
      ).texture
    );
    buttonAnchor.addChild(this.mWandOffButton);
    this.mWandOffButton.position.set(Config.app.width / 2 - 50, 0);

    this.mPrevButton.onClick = () => {
      this.mButtonClickSnd.play();
      this.mBook.prev();
    };
    this.mNextButton.onClick = () => {
      this.mButtonClickSnd.play();
      this.mBook.next();
    };
    this.mPlayButton.onClick = () => {
      this.mButtonClickSnd.play();
      this.mBook.startPlay();
    };
    this.mPauseButton.onClick = () => {
      this.mButtonClickSnd.play();
      this.mBook.pausePlay();
    };

    this.mWandOnButton.onClick = () => {
      this.mWandClickSnd.play();
      this.mBook.pausePlay();
      this.mBook.setPlayMode(PlayMode.INTERACTION);
    };

    this.mWandOffButton.onClick = () => {
      this.mWandClickSnd.play();
      this.mBook.startPlay();
      this.mBook.setPlayMode(PlayMode.AUTOPLAY);
    };
    this.updateButtonState();
  }

  // 책의 상태를 체크하여 버튼의 상태를 설정
  updateButtonState() {
    this.mPrevButton.visible = !(this.mBook.currentPageIDX == 0);
    this.mNextButton.visible = !this.mBook.isLastPage;
    //현재 모드에 따라서 플레이 버튼 상태 변경
    this.mPlayButton.visible = !this.mBook.currentPage.isPlaying;
    this.mPauseButton.visible = this.mBook.currentPage.isPlaying;

    //현재 모드에 따라서 Wand 버튼 상태 변경
    this.mWandOnButton.visible = this.mBook.mode == PlayMode.AUTOPLAY;
    this.mWandOffButton.visible = !this.mWandOnButton.visible;

    // this.mWandButton.changeState( ) = !(this.mBook.isLastPage )
  }
}
