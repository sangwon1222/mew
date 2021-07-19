import Config from "@/Mew/Config";
import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { ReadTheLyrics } from "../../scenes/ReadTheLyrics";
import * as PageInfoData from "./PageInfo";
import { gsap, Sine } from "gsap";
import * as Util from "@/Mew/Core/Util";

//-----------------------------------------
// interface

export interface PageTrack {
  // wordsNum:number;
  text: string;
  lineEnd: boolean;
  startTime: number;
  endTime: number;
}
export interface PageLyricsLine {
  // text:string;
  tracks: Array<PageTrack>;
}
export interface PageLyrics {
  position: PIXI.Point;
  lines: Array<PageLyricsLine>;
}

export interface PagePictureObject {
  normal: string;
  active: string;
  position: PIXI.Point;
}
export interface PagePicture {
  bg: string;
  cover: string;
  objects: Array<PagePictureObject>;
}

export interface PageInfo {
  sound: string;
  picture: PagePicture;
  lyrics: PageLyrics;
}

//-----------------------------------------
export const FONT_HEIGHT = 48;
export const LINE_SPACE = 27;

export enum PlayMode {
  AUTOPLAY,
  INTERACTION,
}

export class TrackText extends PIXI.Container {
  private _normalStyle: PIXI.TextStyle;
  private _shadowStyle: PIXI.TextStyle;
  private _maskStyle: PIXI.TextStyle;
  private _activeStyle: PIXI.TextStyle;

  private _textShadowObj: PIXI.Text;

  private _textMaskGraphics: PIXI.Graphics;
  private _textObj: PIXI.Text;

  private _trackingMaskGraphics: PIXI.Graphics;
  private _trackingTextObj: PIXI.Text;

  private _text: string;
  private _startTime: number;
  private _endTime: number;
  private _totalTime: number;
  private _currentPercent: number;

  private _maskWidth: number;
  private _maskHeight: number;

  private _isPlaying: boolean;
  private _mode: PlayMode;

  constructor(str: string, startTime: number, endTime: number) {
    super();

    this._isPlaying = false;
    this._text = str;
    this._startTime = startTime;
    this._endTime = endTime;
    this._totalTime = this._endTime - this._startTime;
    this._currentPercent = 0;
    this._mode = PlayMode.AUTOPLAY;

    this._normalStyle = new PIXI.TextStyle({
      align: "left",
      fill: "#302F2F",
      fontFamily: "NotoSansKR",
      fontWeight: "700",
      fontSize: 48,
      padding: 10,
      // stroke:"#FFFFFF",
      // strokeThickness:1
    });

    this._shadowStyle = new PIXI.TextStyle({
      align: "left",
      fill: "#6E6E6E",
      fontFamily: "NotoSansKR",
      fontWeight: "700",
      fontSize: 48,
      padding: 10,
    });

    this._maskStyle = new PIXI.TextStyle({
      align: "left",
      fill: "#3197ED",
      fontFamily: "NotoSansKR",
      fontWeight: "700",
      fontSize: 48,
      padding: 10,
      // stroke:"#3197ED",
      // strokeThickness:2
    });

    this._activeStyle = new PIXI.TextStyle({
      align: "left",
      fill: "#302F2F",
      fontFamily: "NotoSansKR-Bold",
      fontWeight: "700",
      fontSize: 48,
      // stroke:"#FFFFFF",
      // strokeThickness:1,
      padding: 10,
      // dropShadow: true,
      // dropShadowColor: '#6E6E6E',
      // dropShadowBlur: 0,
      // dropShadowAngle: Math.PI*2/3,
      // dropShadowDistance: 2,
    });

    this._textShadowObj = new PIXI.Text(this._text);
    this._textShadowObj.alpha = 0.5;
    this._textShadowObj.style = this._shadowStyle;
    this._textShadowObj.position.set(2, 2);
    this._textShadowObj.visible = false;
    this.addChild(this._textShadowObj);

    this._textMaskGraphics = new PIXI.Graphics();
    this.addChild(this._textMaskGraphics);

    // console.log("TrackText text::::", this._text);
    this._textObj = new PIXI.Text(this._text);
    this._textObj.style = this._normalStyle;
    this._textObj.mask = this._textMaskGraphics;
    this.addChild(this._textObj);
    // console.log("this._textObj.height:", this._textObj.height);

    this._trackingMaskGraphics = new PIXI.Graphics();
    this.addChild(this._trackingMaskGraphics);

    this._trackingTextObj = new PIXI.Text(this._text);
    this._trackingTextObj.style = this._maskStyle;
    this._trackingTextObj.mask = this._trackingMaskGraphics;
    this.addChild(this._trackingTextObj);

    this._maskWidth = this._trackingTextObj.width + 4;
    this._maskHeight = this._trackingTextObj.height + 4;

    this.hitArea = new PIXI.Rectangle(
      -2,
      -2,
      this._maskWidth,
      this._maskHeight
    );

    this._textMaskGraphics.beginFill(0xff0000);
    this._textMaskGraphics.drawRect(-2, -2, this._maskWidth, this._maskHeight);
    this._textMaskGraphics.endFill();

    this._trackingMaskGraphics.beginFill(0x00ff00);
    this._trackingMaskGraphics.drawRect(
      -2,
      -2,
      this._maskWidth,
      this._maskHeight
    );
    this._trackingMaskGraphics.endFill();

    this._trackingMaskGraphics.width = 0;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public get startTime(): number {
    return this._startTime;
  }

  public get endTime(): number {
    return this._endTime;
  }

  public get textWidth(): number {
    return this._textObj.width;
  }

  public autoplay() {
    this._mode = PlayMode.AUTOPLAY;

    this.interactive = false;
    this.buttonMode = false;

    this._textShadowObj.visible = false;
    this.updateMask(this._currentPercent);
  }

  public interaction() {
    this._mode = PlayMode.INTERACTION;

    this.interactive = true;
    this.buttonMode = true;

    this._textShadowObj.visible = true;
    this.updateMask(0);
  }

  public onTrackingStart() {
    this._isPlaying = true;
    this._trackingMaskGraphics.width = 0;
    this._textMaskGraphics.width = this._maskWidth;
  }

  public onTrackingComplete() {
    this._isPlaying = false;
    this._trackingMaskGraphics.width = this._maskWidth;
    this._textMaskGraphics.width = 0;
  }

  public reset() {
    if (this._mode == PlayMode.AUTOPLAY) {
      this._currentPercent = 0;
      this.updateMask(this._currentPercent);
      this._textShadowObj.visible = false;
    } else if (this._mode == PlayMode.INTERACTION) {
      this._textShadowObj.visible = true;
      this.updateMask(0);
    }
  }

  public updateMask(percent: number) {
    const trackingMaskWidth: number = Math.round(
      this._maskWidth * (percent / 100)
    );
    this._trackingMaskGraphics.width = Math.round(trackingMaskWidth);

    const textMaskWidth: number = Math.round(
      this._maskWidth - this._trackingMaskGraphics.width
    );
    this._textMaskGraphics.width = Math.round(textMaskWidth);

    this._textMaskGraphics.position.set(
      this._trackingMaskGraphics.width - 2,
      0
    );

    // console.log("this._maskWidth:", this._maskWidth);
    // console.log("this._maskTrackingGraphics.width:", this._maskTrackingGraphics.width);
    // console.log("this._textMaskGraphics.width:", this._textMaskGraphics.width);
    // console.log("this._textMaskGraphics.posX:", this._textMaskGraphics.position.x);
  }

  public onUpdate(current: number) {
    if (this._isPlaying) {
      if (current < this._startTime || current > this._endTime) return;

      const progressT: number = (current - this._startTime) * 100;
      const percent: number = Math.round(progressT / this._totalTime);
      this.updateMask(percent);

      if (this._mode == PlayMode.AUTOPLAY) {
        this._currentPercent = percent;
      }
    }
  }
}

export class LyricsLine extends PIXI.Container {
  // private _textStr:string;
  // private _arrWords:Array<string>;
  private _arrTrackText: Array<TrackText>;

  private _startTime: number;
  private _endTime: number;

  private _mode: PlayMode;
  private _isPlaying: boolean;
  private _autoplayComplete: boolean;

  constructor(data: PageLyricsLine) {
    super();

    this._mode = PlayMode.AUTOPLAY;
    this._isPlaying = false;
    this._autoplayComplete = false;

    // this._arrWords = new Array<string>();
    this._arrTrackText = new Array<TrackText>();

    // this._textStr = data.text;

    // let words:string[] = this._textStr.split(" ");
    // for(let i:number = 0; i<words.length; i++){
    //     this._arrWords.push(words[i]);
    // }

    if (data.tracks.length == 1) {
      const text: string = data.tracks[0].text;

      this._startTime = data.tracks[0].startTime;
      this._endTime = data.tracks[0].endTime;
      const trackText: TrackText = new TrackText(
        text,
        data.tracks[0].startTime,
        data.tracks[0].endTime
      );
      this.addChild(trackText);
      this._arrTrackText.push(trackText);
    } else {
      // let wordCount:number = 0;

      let posX = 0;
      let posY = 0;
      for (let i = 0; i < data.tracks.length; i++) {
        const track: PageTrack = data.tracks[i];
        if (i == 0) this._startTime = track.startTime;
        if (i == data.tracks.length - 1) this._endTime = track.endTime;

        const text: string = track.text;

        // let ch:string = "";
        // let endWord:number = wordCount+track.wordsNum;
        // for(let j:number = wordCount; j<endWord; j++){
        //     ch += this._arrWords[j];
        //     wordCount++;

        //     if(wordCount == track.wordsNum){
        const trackText: TrackText = new TrackText(
          text,
          track.startTime,
          track.endTime
        );
        trackText.position.set(posX, posY);
        this.addChild(trackText);
        this._arrTrackText.push(trackText);

        if (track.lineEnd) {
          posX = 0;
          posY += LINE_SPACE + FONT_HEIGHT;
        } else {
          posX += trackText.textWidth;
        }
        //     } else {
        //         ch += " ";
        //     }
        // }
      }
    }
  }

  public get startTime(): number {
    return this._startTime;
  }

  public get endTime(): number {
    return this._endTime;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public getTrackTexts(): Array<TrackText> {
    return this._arrTrackText;
  }

  public interaction() {
    this._mode = PlayMode.INTERACTION;
    // this.interactive = true;
    // this.buttonMode = true;

    this.hitArea = new PIXI.Rectangle(-2, -2, this.width, this.height);
    for (const trackText of this._arrTrackText) {
      trackText.interaction();
    }
  }

  public autoplay() {
    this._mode = PlayMode.AUTOPLAY;
    this.interactive = false;
    this.buttonMode = false;

    for (const trackText of this._arrTrackText) {
      trackText.autoplay();
    }
  }

  public onTrackingStart() {
    this._isPlaying = true;
  }

  public onTrackingComplete() {
    this._isPlaying = false;

    for (const trackText of this._arrTrackText) {
      trackText.updateMask(100);
    }
  }

  public autoplayComplete() {
    this._autoplayComplete = true;
  }

  public reset() {
    for (let i = 0; i < this._arrTrackText.length; i++) {
      const trackText: TrackText = this._arrTrackText[i];
      trackText.reset();
    }
  }

  public onUpdate(current: number) {
    if (this._isPlaying) {
      for (let i = 0; i < this._arrTrackText.length; i++) {
        const trackText: TrackText = this._arrTrackText[i];
        if (!trackText.isPlaying && current >= trackText.startTime) {
          // console.log("track text start");
          trackText.onTrackingStart();
        }

        if (trackText.isPlaying && current >= trackText.endTime) {
          trackText.onTrackingComplete();

          if (this._mode == PlayMode.AUTOPLAY) {
            this.autoplayComplete();
          }
        }

        trackText.onUpdate(current);
      }
    }
  }
}

export class Lyrics extends PIXI.Container {
  private mPage: Page;
  private mMode: PlayMode;

  private mTouchLine: LyricsLine;
  private mArrLines: Array<LyricsLine>;

  constructor(page: Page, data: PageLyrics) {
    super();
    this.mPage = page;
    this.mMode = PlayMode.AUTOPLAY;

    this.mTouchLine = null;
    this.mArrLines = new Array<LyricsLine>();

    let posY = 0;
    for (let i = 0; i < data.lines.length; i++) {
      const lyricsLine: LyricsLine = new LyricsLine(data.lines[i]);
      lyricsLine.zIndex = i;
      lyricsLine.position.set(0, posY);
      this.addChild(lyricsLine);

      posY += LINE_SPACE + lyricsLine.height;
      this.mArrLines.push(lyricsLine);

      const arrtrackTexts: Array<TrackText> = lyricsLine.getTrackTexts();

      for (const trackText of arrtrackTexts) {
        trackText.on("pointerup", (evt: PIXI.InteractionEvent) => {
          // this.mPage.stopSound();
          if (this.mTouchLine) {
            this.mTouchLine.reset();
          }

          this.mTouchLine = lyricsLine;
          this.mPage.playLyricSound({
            start: lyricsLine.startTime,
            end: lyricsLine.endTime,
          });
          // this._page.playSound({
          //     start: lyricsLine.startTime,
          //     end: lyricsLine.endTime,
          //     complete:()=>{
          //         lyricsLine.reset();
          //         this._page.stop();
          //     }
          // })
        });
      }
    }
  }

  public setMode(mode: PlayMode) {
    this.mMode = mode;

    if (this.mMode == PlayMode.AUTOPLAY) {
      for (const line of this.mArrLines) {
        line.autoplay();
      }
    } else if (this.mMode == PlayMode.INTERACTION) {
      for (const line of this.mArrLines) {
        line.interaction();
      }
    }
  }

  public reset() {
    for (let i = 0; i < this.mArrLines.length; i++) {
      const line: LyricsLine = this.mArrLines[i];
      line.reset();
    }
  }

  public onUpdate(current: number) {
    // console.log("current:", current);
    // if(this._mode == PlayMode.AUTOPLAY){
    for (let i = 0; i < this.mArrLines.length; i++) {
      const line: LyricsLine = this.mArrLines[i];

      if (this.mMode == PlayMode.AUTOPLAY) {
        if (!line.isPlaying) {
          if (current >= line.startTime && current <= line.endTime) {
            // console.log("line tracking start");
            line.onTrackingStart();
          }
        }

        if (line.isPlaying && current >= line.endTime) {
          // console.log("line tracking complete");
          line.onTrackingComplete();
        }

        if (line.isPlaying) {
          line.onUpdate(current);
        }
      } else if (this.mMode == PlayMode.INTERACTION) {
        if (this.mTouchLine == line) {
          if (!line.isPlaying) {
            if (current >= line.startTime && current <= line.endTime) {
              // console.log("line tracking start");
              line.onTrackingStart();
            }
          }

          if (line.isPlaying && current >= line.endTime) {
            // console.log("line tracking complete");
            line.onTrackingComplete();
          }

          if (line.isPlaying) {
            line.onUpdate(current);
          }
        }
      }
    }
    // }else if(this._mode == PlayMode.INTERACTION) {

    // }
  }
}

export class PictureObject extends PIXI.Sprite {
  private mTexNormal: PIXI.Texture;
  private mTexActive: PIXI.Texture;

  constructor(normal: PIXI.Texture, active: PIXI.Texture) {
    super();
    this.mTexNormal = normal;
    this.mTexActive = active;

    this.on("pointerdown", (evt: PIXI.InteractionEvent) => {
      if (Util.hitTestObject(this, evt.data.global)) {
        // evt.stopPropagation();
        this.touchAction();
      }
    });
    this.autoplay();
  }

  public interaction() {
    this.texture = this.mTexActive;
    this.interactive = true;
    this.buttonMode = true;
  }

  public autoplay() {
    this.texture = this.mTexNormal;
    this.interactive = false;
    this.buttonMode = false;
  }

  public touchAction() {
    const snd: PIXI.sound.Sound = ResourceManager.Handle.getViewerResource(
      "snd_selectobj.mp3"
    ).sound;
    snd.play();

    // TweenMax.killTweensOf(this);
    this.scale.set(1, 1);

    gsap.to(this.scale, {
      duration: 0.15,
      ease: Sine.easeOut,
      x: 1.1,
      y: 1.1,
      yoyo: true,
      repeat: 1,
    });
  }
}
export class Picture extends PIXI.Container {
  private mPage: Page;
  private mMode: PlayMode;

  private _bg: PIXI.Sprite;
  private _cover: PIXI.Sprite;

  private _arrObjects: Array<PictureObject>;

  constructor(page: Page, data: PagePicture) {
    super();
    this.mPage = page;

    this._arrObjects = new Array<PictureObject>();
    this._bg = new PIXI.Sprite(
      ResourceManager.Handle.getProductResource(
        ReadTheLyrics.Handle.productName,
        data.bg
      ).texture
    );
    this._bg.zIndex = 0;
    this.addChild(this._bg);

    if (data.cover != "") {
      this._cover = new PIXI.Sprite(
        ResourceManager.Handle.getProductResource(
          ReadTheLyrics.Handle.productName,
          data.cover
        ).texture
      );
      this._cover.zIndex = 100;
      this.addChild(this._cover);
    }

    for (let i = 0; i < data.objects.length; i++) {
      let normalTexture: PIXI.Texture = null;
      let activeTexture: PIXI.Texture = null;

      if (data.objects[i].normal != "") {
        normalTexture = ResourceManager.Handle.getProductResource(
          ReadTheLyrics.Handle.productName,
          data.objects[i].normal
        ).texture;
      }

      if (data.objects[i].active != "") {
        activeTexture = ResourceManager.Handle.getProductResource(
          ReadTheLyrics.Handle.productName,
          data.objects[i].active
        ).texture;
      }

      const object: PictureObject = new PictureObject(
        normalTexture,
        activeTexture
      );
      object.zIndex = i + 10;
      object.anchor.set(0.5, 0.5);
      object.position.set(
        data.objects[i].position.x * Config.app.videoScale,
        data.objects[i].position.y * Config.app.videoScale
      );
      this.addChild(object);

      if (activeTexture != null) {
        this._arrObjects.push(object);
      }
    }
  }

  public setMode(mode: PlayMode) {
    this.mMode = mode;

    if (this.mMode == PlayMode.AUTOPLAY) {
      this.interactive = false;
      for (const object of this._arrObjects) {
        object.autoplay();
      }
    } else if (this.mMode == PlayMode.INTERACTION) {
      this.interactive = true;
      for (const object of this._arrObjects) {
        object.interaction();
      }

      this.on("pointertap", (evt: PIXI.InteractionEvent) => {
        for (let i = this._arrObjects.length - 1; i >= 0; i--) {
          // if( ObjectUtils.hitTestObject(this._arrObjects[i], evt.data.global)){
          //     console.log("click:",this.zIndex);
          //     this._arrObjects[i].touchAction();
          //     break;
          // }
        }
      });
    }
  }
}

export class Page extends PIXI.Container {
  private mSound: PIXI.sound.Sound;
  private mMediaInstance: PIXI.sound.IMediaInstance;
  private mMaskGraphics: PIXI.Graphics;
  private mLyrics: Lyrics;
  private mPicture: Picture;
  private mMode: PlayMode;
  private mPlayLastTime: number;

  get mode(): PlayMode {
    return this.mMode;
  }
  get isPlaying(): boolean {
    return this.mSound.isPlaying;
  }

  constructor(info: PageInfo) {
    super();

    // this.mSound.play();
    this.mMode = PlayMode.AUTOPLAY;
    this.mSound = ResourceManager.Handle.getProductResource(
      ReadTheLyrics.Handle.productName,
      info.sound
    ).sound;
    this.mPlayLastTime = 0;

    this.mPicture = new Picture(this, info.picture);
    this.mPicture.position.set(0, 0);
    this.addChild(this.mPicture);

    this.mLyrics = new Lyrics(this, info.lyrics);
    this.mLyrics.scale.set(Config.app.videoScale);
    this.mLyrics.position.set(
      info.lyrics.position.x * Config.app.videoScale,
      info.lyrics.position.y * Config.app.videoScale
    );
    this.addChild(this.mLyrics);

    this._createmaskGraphic();
  }

  _createmaskGraphic() {
    this.mMaskGraphics = new PIXI.Graphics();
    this.addChild(this.mMaskGraphics);
    this.mMaskGraphics.beginFill(0xffffff);
    this.mMaskGraphics.drawRect(0, 0, Config.app.width, Config.app.height);
    this.mMaskGraphics.endFill();
    this.mask = this.mMaskGraphics;
  }

  startWithTransitionLeftToRight(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.visible = true;
      this.mMaskGraphics.width = 0;
      this.mMaskGraphics.position.set(0, 0);
      // this.mMaskGraphics.width = 300;
      gsap
        .to(this.mMaskGraphics, {
          duration: 0.8,
          ease: Sine.easeIn,
          x: 0,
          width: Config.app.width,
        })
        .eventCallback("onComplete", () => {
          resolve();
          //this.autoplayStart();
        });
    });
  }

  startWithTransitionRightToLeft(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.visible = true;
      this.mMaskGraphics.width = 0;
      this.mMaskGraphics.position.set(Config.app.width, 0);
      gsap
        .to(this.mMaskGraphics, {
          duration: 0.8,
          ease: Sine.easeIn,
          x: 0,
          width: Config.app.width,
        })
        .eventCallback("onComplete", () => {
          resolve();
          // this.autoplayStart();
        });
    });
  }

  reset() {
    if (this.mLyrics) {
      this.mLyrics.reset();
    }
  }
  setMode(mode: PlayMode) {
    this.mMode = mode;
    this.mLyrics.setMode(mode);
    this.mPicture.setMode(mode);
  }
  async startPlay() {
    this.mSound.stop();
    // if( this.mSound.paused ) {
    //     this.mSound.resume();
    // } else {
    this.mMediaInstance = await this.mSound.play({
      start: this.mPlayLastTime,
    });
    this.mMediaInstance.on("end", () => this.emit("page-end"));
    // }
  }
  pausePlay() {
    this.mPlayLastTime = this.mMediaInstance.progress * this.mSound.duration;
    this.mSound.pause();
  }
  stopPlay() {
    //
    this.reset();
    this.mSound.stop();
    this.mPlayLastTime = 0;
    this.mMediaInstance = null;
  }

  async playLyricSound(options: PIXI.sound.PlayOptions) {
    this.mSound.stop();
    this.mMediaInstance = await this.mSound.play(options);
  }
  update(dt: number) {
    //
    if (this.mSound.isPlaying) {
      if (this.mLyrics && this.mMediaInstance) {
        const currT = this.mMediaInstance.progress * this.mSound.duration;
        this.mLyrics.onUpdate(Math.round(currT * 100) / 100);
      }
    }
  }
}

export class Book extends PIXI.Container {
  private mPages: Array<Page>;
  private mCurrentPageIDX: number;
  private mTicker: PIXI.Ticker;

  get isLastPage(): boolean {
    return this.mPages.length <= this.mCurrentPageIDX + 1;
  }
  get currentPageIDX(): number {
    return this.mCurrentPageIDX;
  }
  get currentPage(): Page {
    return this.mPages[this.mCurrentPageIDX];
  }
  get mode(): PlayMode {
    // console.log( this.currentPage);
    return this.currentPage.mode;
  }
  constructor() {
    super();

    this.sortableChildren = true;

    //Resources[]
    const pagesData = PageInfoData[ReadTheLyrics.Handle.productName];
    this.mPages = [];
    this.mCurrentPageIDX = 0;

    for (let i = 0; i < pagesData.length; i++) {
      const pageData = pagesData[i];
      const lyricsData = pageData["lyrics"];
      const pictureData = pageData["picture"];
      // set lyrics
      const arrLyricsLines: Array<PageLyricsLine> = [];

      // let wordCount = 0;
      for (let j = 0; j < lyricsData["lines"].length; j++) {
        const lineData = lyricsData["lines"][j];
        const arrTracks: Array<PageTrack> = [];
        for (const trackData of lineData["tracks"]) {
          let text = trackData["text"];
          let isLineEnd = false;
          if (text.indexOf("\n") != -1) {
            //find
            isLineEnd = true;
            text = text.replace(/\n/g, "");
            if (text.indexOf("\n") != -1) {
              //
            } else {
              //
            }
          } else {
            // not found
          }
          const track: PageTrack = {
            // wordsNum:trackWordsNum,
            text: text,
            lineEnd: isLineEnd,
            startTime: trackData["track-start"],
            endTime: trackData["track-end"],
          };
          arrTracks.push(track);
        }

        const lyricLine: PageLyricsLine = {
          // text:lineData['text'],
          tracks: arrTracks,
        };
        arrLyricsLines.push(lyricLine);
      }

      //set picture
      const arrPicObjects: Array<PagePictureObject> = [];
      for (let k = 0; k < pictureData["objects"].length; k++) {
        const objectData: PagePictureObject = {
          normal: pictureData["objects"][k]["normal"],
          active: pictureData["objects"][k]["active"],
          position: new PIXI.Point(
            pictureData["objects"][k]["position"]["x"],
            pictureData["objects"][k]["position"]["y"]
          ),
        };
        arrPicObjects.push(objectData);
      }

      //set page
      const pageinfo: PageInfo = {
        sound: pageData["sound"],
        picture: {
          bg: pictureData["bg"],
          cover: pictureData["cover"],
          objects: arrPicObjects,
        },
        lyrics: {
          position: new PIXI.Point(
            pageData["lyrics"]["position"]["x"],
            pageData["lyrics"]["position"]["y"]
          ),
          lines: arrLyricsLines,
        },
      };

      const page = new Page(pageinfo);
      page.visible = false;
      page.position.set(0, 0);
      this.mPages.push(page);
      this.addChild(page);
      page.on("page-end", () => this.next());
    }
    this.currentPage.visible = true;
  }

  async prev() {
    const old = this.currentPage;
    if (this.mCurrentPageIDX > 0) {
      this.mCurrentPageIDX--;

      old.zIndex = 0;
      old.stopPlay();

      // this.reset();
      this.setPlayMode(PlayMode.AUTOPLAY);

      this.currentPage.zIndex = 10;
      await this.currentPage.startWithTransitionLeftToRight();
      old.reset();
      old.visible = false;
      this.currentPage.reset();
      await this.currentPage.startPlay();
      this.emit("change-page");
    }
  }

  async next() {
    if (this.mCurrentPageIDX == this.mPages.length - 1) {
      // todo : 책 읽기 끝
      // this.complete();
      return;
    }

    const old = this.currentPage;
    if (this.mCurrentPageIDX < this.mPages.length - 1) {
      this.mCurrentPageIDX++;

      old.zIndex = 0;
      old.stopPlay();

      //this.reset();
      this.setPlayMode(PlayMode.AUTOPLAY);

      this.currentPage.zIndex = 10;
      await this.currentPage.startWithTransitionRightToLeft();
      old.reset();
      old.visible = false;
      this.currentPage.reset();
      await this.currentPage.startPlay();
      this.emit("change-page");
    }
  }

  async startPlay() {
    //
    // this.currentPage.reset();
    await this.currentPage.startPlay();
    this.emit("play");

    this.setPlayMode(PlayMode.AUTOPLAY);
  }
  pausePlay() {
    this.currentPage.pausePlay();
    this.emit("pause");
  }
  stopPlay() {
    this.currentPage.stopPlay();
    this.emit("stop");
  }
  setPlayMode(mode: PlayMode) {
    this.currentPage.setMode(mode);
    this.emit("change-mode", { mode: mode });
  }
  //-----------------------------------

  update(dt: number) {
    if (this.currentPage) {
      this.currentPage.update(dt);
    }
  }

  init() {
    if (this.mTicker == null) {
      this.mTicker = new PIXI.Ticker();
      this.mTicker.add((dt) => {
        this.update(dt);
      });
      this.mTicker.start();
    }
  }

  destroy() {
    if (this.mTicker) {
      this.mTicker.stop();
      this.mTicker = null;
    }
  }
}
