<template>
  <div
    id="app"
    ref="app"
  >
  <button
      id="closeBtn"
      class="fullBtn"
      v-if="this.fullFlag && this.mobilecolume"
      @click="_closeFullScreen"
    />
    <button
      id="goFullBtn"
      class="fullBtn"
      v-if="!this.fullFlag && this.mobilecolume"
      @click="_goFullScreen"
    />
    <canvas
      id="canvas"
      ref="canvas"
    />

  <div id="guideRotate" v-if="this.mobilecolume">
      <p id="guideText">
        가로모드에 최적화 되어 있습니다.
      </p>
      <img
        src="@/assets/phone.png"
        id="phone"
        alt="세로모드일때, 가로유도 폰이미지"
      />
    </div>

  </div>
</template>

<script lang="ts">
// import "./assets/global.scss";
import WebFont from "webfontloader";
import { Component, Vue } from "vue-property-decorator";
import { MewApp } from "./Mew/MewApp";
import gsap from "gsap";
// import * as Util from '@/Mew/Core/Util'
import Util from "@/Util";
import { defaultVertex } from "pixi.js";

function isMobilePlatform() {
  const filter = "win16|win32|win64|mac";

  if (navigator.platform) {
    if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
      //alert("Mobile");
      return true;
    } else {
      //alert("PC");
      return false;
    }
  }
}
let app = null;

@Component({
  components: {},
})
export default class App extends Vue {
  private fullFlag = false;
  private mobilecolume = false;

  async mounted() {
    await this._fontLoading();
    if (Util.Platform.isIOS()) {
      // this.screenFlag = false;
    } else {
      // this.screenFlag = true;
    }
    app = new MewApp(this.$refs.canvas as HTMLCanvasElement);

    window.addEventListener("resize", () => {
      this.reclacScreen(this.$refs.canvas as HTMLCanvasElement);
    });
    this.reclacScreen(this.$refs.canvas as HTMLCanvasElement);
  }
  reclacScreen(app: HTMLCanvasElement) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w > h * 1.6) {
      document.body
        .getElementsByTagName("canvas")[0]
        .setAttribute("style", `width: calc(1.6 * ${h}px ); height:100%; transform: translate(-50%,-50%); top:50%; left:50%;`);
    } else {
      document.body
        .getElementsByTagName("canvas")[0]
        .setAttribute("style", `width:100%;height:calc( ${w}px / 1.6 );  transform: translate(-50%,-50%); top:50%; left:50%;`);
    }

    if (w > h) {
      // 가로로 볼때,
      this.mobilecolume = false;
    } else if (h > w) {
      this.mobilecolume = true;
    }
  }

  private _fontLoading(): Promise<void> {
    return new Promise<void>((resolve) => {
      WebFont.load({
        custom: {
          families: [
            "BPreplay",
            "BPreplayBold",
            "NotoSansKR",
            "NotoSansKR-Bold",
          ],
          // families: ["BPreplay:", "BPreplay:i8", "NotoSansKR"],
          // urls: ["fonts/fonts.css"],
          urls: ["http://imestudy.smartdoodle.net:1222/rsc/font/fonts.css"],
        },

        fontloading: (fontname) => {
          // console.log("fontLoading", fontname);
        },
        active: () => {
          // console.log(" font loaded");
          resolve();
        },
      });
    });
  }

  async _goFullScreen() {
    if (!document.fullscreenElement) {
      if (this.$el.requestFullscreen) {
        this.$el.requestFullscreen(); // W3C spec
      } else if ((this.$el as any).mozRequestFullScreen) {
        (this.$el as any).mozRequestFullScreen(); // Firefox
      } else if ((this.$el as any).webkitRequestFullscreen) {
        (this.$el as any).webkitRequestFullscreen(); // Safari
      } else if ((this.$el as any).msRequestFullscreen) {
        (this.$el as any).msRequestFullscreen(); // IE/Edge
      }
      this.fullFlag = true;
    }
  }
  async _closeFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
    this.fullFlag = false;
  }
}
</script>

<style lang="scss" scoped>
#app {
  /**ios에서 확대 터치 막기 */
  touch-action: pan-y;
  /**ios에서 확대 터치 막기 */
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #333;
}

 .fullBtn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 50px;
    height: 50px;
    border: 4px #fff solid;
    border-radius: 50px;
  }
  #goFullBtn {
    background: #333;
    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      transform: translate(-50%, -50%);
    }

    &::before {
      border: 2px #fff solid;
      animation: goFullMotion forwards 0.5s 0.5s;
    }
    &::after {
      background: #333;
      animation: goFullMotion forwards 0.5s 1s;
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    @keyframes goFullMotion {
      to {
        width: 20px;
        height: 20px;
      }
    }
  }
  #closeBtn {
    background: #333;
    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 0;
      transform: translate(-50%, -50%);
      background: #fff;
    }
    &::before {
      animation: closebtnMotion1 forwards 0.5s 0.5s;
    }
    &::after {
      animation: closebtnMotion2 forwards 0.5s 0.5s;
    }
    @keyframes closebtnMotion1 {
      50% {
        height: 20px;
      }
      100% {
        height: 20px;
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }
    @keyframes closebtnMotion2 {
      50% {
        height: 20px;
      }
      100% {
        height: 20px;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }

#canvas {
  position: fixed;
  width: 100%;
  height: auto;
}

  #guideRotate {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    padding-bottom:10px;
    top: 90%;
    left: 50%;
    width: 248px;
    transform: translate(-50%, -50%);
      box-sizing: border-box;
    #guideText {
      display: block;
      color: #fff;
      width: 100%;
      font-size:10%;
      text-align: center;
    }
    #phone {
      margin-top: 0;
      width: 10%;
      transform-origin: center bottom;
      animation: rotateMotion 1.5s infinite;
    }
    @keyframes rotateMotion {
      0% {
        transform-origin: center bottom;
        transform: rotate(0deg);
      }
      100% {
        transform-origin: center bottom;
        transform: rotate(90deg);
      }
    }
  }

/* #fullScreenPop {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;

  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 58px;
} */
</style>
