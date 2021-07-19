export default {
  app: {
    // width: 1920,
    // height: 1200,
    background: 0x0000,
    width: 1280,
    height: 800,
    videoScale: 0.67,
  },

  debugLine(target: any) {
    const debug = new PIXI.Graphics();
    debug.lineStyle(2, 0xff0000, 1);
    debug.drawRect(0, 0, target.width, target.height);
    debug.endFill();
    target.addChild(debug);
  },
};
