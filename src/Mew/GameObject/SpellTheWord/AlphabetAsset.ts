import { ResourceManager } from "../../Core/ResourceManager";
import gsap from "gsap";

export class AlphabetAsset extends PIXI.Sprite {
  private regExp: RegExp;
  private alphabetStr: string;
  private alphabetTxt: PIXI.Text;
  private normalStyle: PIXI.TextStyle;
  private currentStyle: PIXI.TextStyle;
  private nextStyle: PIXI.TextStyle;

  private puzzleTexture: PIXI.Sprite;
  private puzzleNormal: PIXI.Texture;
  private puzzleCurrent: PIXI.Texture;
  private puzzleNext: PIXI.Texture;
  private puzzleAnswer: PIXI.Texture;

  private _alphabet: string;

  constructor($alphabet: string) {
    super();
    this.regExp = /^[a-zA-Z]*$/;

    this.puzzleNormal = ResourceManager.Handle.getViewerResource(
      "word_ex_btn.png"
    ).texture;
    this.puzzleCurrent = ResourceManager.Handle.getViewerResource(
      "word_ex_present_btn.png"
    ).texture;
    this.puzzleNext = ResourceManager.Handle.getViewerResource(
      "word_ex_next_btn.png"
    ).texture;
    this.puzzleAnswer = ResourceManager.Handle.getViewerResource(
      "word_answer_btn.png"
    ).texture;

    this.normalStyle = new PIXI.TextStyle({
      align: "center",
      fill: "#FFFFFF",
      fontFamily: "BPreplay",
      fontWeight: "bold",
      fontSize: 60,
      padding: 10,
      stroke: "#C45F52",
      strokeThickness: 8,
    });

    this.currentStyle = new PIXI.TextStyle({
      align: "center",
      fill: "#B54D3F",
      fontFamily: "BPreplay",
      fontWeight: "bold",
      fontSize: 60,
      padding: 10,
      stroke: "#FFFFFF",
      strokeThickness: 8,
    });

    this.nextStyle = new PIXI.TextStyle({
      align: "center",
      fill: "#B54D3F",
      fontFamily: "BPreplay",
      fontWeight: "bold",
      fontSize: 60,
      padding: 10,
      stroke: "#702F27",
      strokeThickness: 8,
    });

    if (this.regExp.test($alphabet) && $alphabet.length == 1) {
      //console.log("alphabet value is good")
      this.puzzleTexture = new PIXI.Sprite();
      this.puzzleTexture.anchor.set(0.5, 0.5);
      this.addChild(this.puzzleTexture);

      this.alphabetStr = $alphabet;
      this.alphabetStr.toLowerCase();
      this.alphabetTxt = new PIXI.Text(this.alphabetStr);
      this.alphabetTxt.anchor.set(0.5, 0.5);
      this.alphabetTxt.position.set(this.width / 2 - 2, this.height / 2);
      this.setNormalStyle();
      this.addChild(this.alphabetTxt);
    } else {
      // console.log("alphabet value is wrong")
    }
  }

  setNormalStyle() {
    this.alphabetTxt.style = this.normalStyle;
    this.puzzleTexture.texture = this.puzzleNormal;
  }

  setCurrentStyle() {
    this.alphabetTxt.style = this.currentStyle;
    this.puzzleTexture.texture = this.puzzleCurrent;
  }

  setNextStyle() {
    this.alphabetTxt.style = this.nextStyle;
    this.puzzleTexture.texture = this.puzzleNext;
  }

  setAnswerStyle() {
    this.alphabetTxt.style = this.normalStyle;
    this.puzzleTexture.texture = this.puzzleAnswer;
  }

  setAnimation() {
    gsap.to(this.alphabetTxt.scale, {
      x: 1.2,
      y: 1.2,
      repeat: 1,
      duration: 0.2,
      yoyo: true,
    });
  }

  set alphabet($alphabet: string) {
    this._alphabet = $alphabet;
  }

  get alphabet(): string {
    return this._alphabet;
  }
}
