// import { MorphSVGPlugin } from "gsap/all";

// export class Test extends PIXI.Container{
//     constructor(){
//         super()

//         const path =
//         "M19,168C77.72,93.9,142.72,35.54,198,49c56.66,13.8,57.77,92,118,107,71.86,17.86,116.12-82.07,216-96,46.41-6.47,118.35,3.74,218,95";

//         const pathData = MorphSVGPlugin.pathDataToBezier(path);
//         const container = new PIXI.Container();
//         const graphics = new PIXI.Graphics();

//         graphics.moveTo(pathData[0].x, pathData[0].y);
//         container.addChild(graphics);
//         this.addChild(container);

//         function onUpdate() {
//         graphics.lineStyle(4, 0xffffff);
//         graphics.lineTo(this.target.x, this.target.y);
//         }

//         TweenMax.to({ x: 0, y: 0 }, 4, {
//         bezier: { type: "cubic", values: pathData },
//         onUpdate: onUpdate,
//         ease: Linear.easeNone
//         });
//     }
// }

