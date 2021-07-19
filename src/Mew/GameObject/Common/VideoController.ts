import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { Button } from "./Button";
import { ToggleButton } from "./ToggleButton";
import { Slider } from "./Slider";
import { Song } from "@/Mew/scenes/Song";
import { SceneBase } from "@/Mew/Core/SceneBase";

class TimeDisplay extends PIXI.Text {
  private mVideo: HTMLVideoElement;

  private mMaxValue: number; // 100
  private mCurrentValue: number; // 10

  private mTotalText: PIXI.Text;
  private mCurrentText: PIXI.Text;

  constructor(video: HTMLVideoElement, max: number, current?: number) {
    super("");

    this.mVideo = video;

    const style = new PIXI.TextStyle({
      fontSize: 16,
    });

    this.mTotalText = new PIXI.Text(``, style);
    this.mCurrentText = new PIXI.Text(``, style);

    this.mMaxValue = max;
    if (current) this.mCurrentValue = current;
    else {
      this.mCurrentValue = 0;
    }
  }
  setTime() {
    const total = new Date(this.mVideo.duration * 1000);
    const tm = ("0" + total.getMinutes()).slice(-2);
    const ts = ("0" + total.getSeconds()).slice(-2);

    const current = new Date(this.mVideo.currentTime * 1000);
    const m = ("0" + current.getMinutes()).slice(-2);
    const s = ("0" + current.getSeconds()).slice(-2);

    this.mCurrentText.text = `${m}:${s}`;
    this.mTotalText.text = ` / ${tm}:${ts}`;

    this.addChild(this.mTotalText, this.mCurrentText);
    this.mTotalText.x = this.mCurrentText.width;
  }
  setValue(v: number) {
    this.mCurrentValue = v;
  }
}

export class VideoController extends PIXI.Container {
  private mVideo: HTMLVideoElement;

  private mStopButton: Button;
  private mPlayPauseButton: ToggleButton;
  private mMuteButton: ToggleButton;

  private mVideoSlider: Slider;
  private mSoundSlider: Slider;
  private mVideoTimeDisplay: TimeDisplay;

  constructor(video: HTMLVideoElement) {
    super();

    this.mVideo = video;
    this.mVideo.volume = 0.5;
    const BG = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource("player_bar.png").texture
    );
    this.addChild(BG);

    /**PLAY BUTTON */

    this.mPlayPauseButton = new ToggleButton(
      ResourceManager.Handle.getCommonResource(`pause_on.png`).texture,
      ResourceManager.Handle.getCommonResource(`play_on.png`).texture,
      ResourceManager.Handle.getCommonResource(`pause_down.png`).texture,
      ResourceManager.Handle.getCommonResource(`play_down.png`).texture
    );
    this.mPlayPauseButton.position.set(this.width * 0.05, this.height * 0.6);

    this.mPlayPauseButton.onChangeState = (flag: boolean) => {
      if (flag) {
        this.mVideo.pause();
      } else {
        this.mVideo.play();
      }
    };
    this.addChild(this.mPlayPauseButton);

    /**STOP BUTTON */

    this.mStopButton = new Button(
      ResourceManager.Handle.getCommonResource(`stop_on.png`).texture,
      ResourceManager.Handle.getCommonResource(`stop_down.png`).texture
    );
    this.addChild(this.mStopButton);
    this.mStopButton.position.set(
      this.mPlayPauseButton.x + this.mStopButton.width * 1.2,
      this.height * 0.6
    );
    this.mStopButton.onClick = () => {
      this.mVideo.currentTime = 0;
      this.mVideo.pause();
      // console.log(this.parent)
      if (this.onStop) this.onStop();
      // Song.Handle.dimmed();
    };
    /**VIDEO SLIDER */

    this.mVideoSlider = new Slider(
      `playbar_bg.png`,
      `playbar_up.png`,
      this.mVideo.currentTime
    );
    this.mVideoSlider.onChangeValue = (v: number) => {
      this.mVideo.currentTime =
        this.mVideoSlider.getPercent() * this.mVideo.duration;
      // console.log(`this.mVideo.currentTime,${this.mVideo.currentTime}`)
    };
    this.addChild(this.mVideoSlider);
    this.mVideoSlider.position.set(
      this.mStopButton.x + this.mStopButton.width,
      this.height * 0.45
    );

    /**MUTE BUTTON */

    this.mMuteButton = new ToggleButton(
      ResourceManager.Handle.getCommonResource(`sound_on_normal.png`).texture,
      ResourceManager.Handle.getCommonResource(`sound_off_normal.png`).texture,
      ResourceManager.Handle.getCommonResource(`sound_on_down.png`).texture,
      ResourceManager.Handle.getCommonResource(`sound_off_down.png`).texture
    );
    this.mMuteButton.onChangeState = (flag: boolean) => {
      // console.log(flag)
      if (flag) {
        this.mVideo.muted = true;
      } else {
        this.mVideo.muted = false;
      }
    };

    this.addChild(this.mMuteButton);
    this.mMuteButton.position.set(
      this.mVideoSlider.x + this.mVideoSlider.width * 1.3,
      this.height * 0.6
    );

    /**SOUND SLIDER */

    this.mSoundSlider = new Slider(`vol_bar_under.png`, `vol_bar_up.png`, 0.5);
    this.mSoundSlider.onChangeValue = (v: number) => {
      this.mVideo.volume = v;
    };
    this.addChild(this.mSoundSlider);
    this.mSoundSlider.position.set(
      this.mMuteButton.x + this.mMuteButton.width * 1.2,
      this.height * 0.45
    );

    this.mVideo.addEventListener("volumechange", (evt) => {
      this.mSoundSlider.setValue(this.mVideo.volume);
      this.mVideo.volume = this.mSoundSlider.getPercent();
      if (this.mVideo.muted == true) {
        this.mSoundSlider.setOffMode(
          this.mVideo.muted,
          `vol_bar_lock_up.png`,
          `scroll_lock_btn.png`
        );
        this.mSoundSlider.interactive = false;
      } else {
        this.mSoundSlider.setOffMode(false);
        this.mSoundSlider.interactive = true;
      }
    });

    /**비디오 타임 텍스트  */

    this.mVideoTimeDisplay = new TimeDisplay(this.mVideo, this.mVideo.duration);
    this.addChild(this.mVideoTimeDisplay);
    this.mVideoTimeDisplay.position.set(
      this.mVideoSlider.x + this.mVideoSlider.width,
      this.height * 0.55
    );

    this.addChild(this.mVideoSlider);

    this.mVideo.addEventListener("timeupdate", (evt) => {
      this.mVideoTimeDisplay.setTime();
      this.mVideoTimeDisplay.setValue(this.mVideo.currentTime);

      if (!this.mVideoSlider.flag) {
        this.mVideoSlider.setValue(
          this.mVideo.currentTime / this.mVideo.duration
        );
      }
    });
  }

  onStop() {
    //
  }
  // this.mSoundSlider.setOffMode(this.mVideo.muted ,`vol_bar_lock_up.png`, `scroll_lock_btn.png`)
}
