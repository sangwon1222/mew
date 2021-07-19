import {ResourceManager} from '../../Core/ResourceManager';
import * as Util from '../../Core/Util';
import {App} from '../../Core/App';
import MagicWand from "magic-wand-tool";


export class DrawCanvas extends PIXI.Sprite {

    private mMagicMask: any = null;
    public mSketch: PIXI.Sprite;
    private mLine: PIXI.Sprite;
    private mRenderedTexture: PIXI.RenderTexture;
    private mColor: string;

    private renderTexturSize: number;

    constructor( productName: string) {
        super();

        this.renderTexturSize = 2048;
        this.mSketch = new PIXI.Sprite(ResourceManager.Handle.getProductResource(productName, 'sketch_bg.png').texture);
        this.mRenderedTexture = PIXI.RenderTexture.create( 
            {width: this.renderTexturSize, 
            height: this.renderTexturSize, 
            scaleMode: PIXI.SCALE_MODES.LINEAR, resolution:1} 
            );
        
        this.texture = this.mRenderedTexture;
        this.mLine = new PIXI.Sprite(ResourceManager.Handle.getProductResource(productName, 'sketch_line.png').texture);

        this.addChild(this.mLine);

        this.buttonMode = true;
        this.interactive = true;
   
        this.on('pointerdown', (evt)=>{ this.pickDown(evt) } );

        App.Handle.renderer.backgroundColor = 0xFFFFFF;
        App.Handle.renderer.render(this.mLine, this.mRenderedTexture, false, null, false);
    }

    set color( pColor: string ) { this.mColor = pColor; }

    pickDown( evt: PIXI.InteractionEvent) {
        //
        const pickPoint: PIXI.Point = this.toLocal( evt.data.global);
        const pickColor = Util.getColorByPoint(this.mSketch, pickPoint);

        //찍은 곳이 흰색인 경우에만 페이트 칠 가능.
        if (pickColor.r === 255 && pickColor.g === 255 && pickColor.b === 255) {
            const px = Math.round(pickPoint.x);
            const py = Math.round(pickPoint.y);

            this.drawMask(px, py);
            this.paint(this.mColor, 1);
        }    
    }

    drawMask( x: number, y: number ) {

        const image = {
            data: Util.getImageData(this.mSketch.texture),
            width: this.mSketch.width,
            height: this.mSketch.height,
            bytes: 4
        };

        this.mMagicMask = MagicWand.floodFill(image, x, y, 10, null, true);
        this.mMagicMask = MagicWand.gaussBlurOnlyBorder(this.mMagicMask, 5); 
    }

    paint(color: string, alpha: number) {

        const rgba = this.hexToRgb(color, alpha);

        const data = this.mMagicMask.data;
        const bounds = this.mMagicMask.bounds;
        const maskW = this.mMagicMask.width;
        const w = this.mSketch.width;
        const h = this.mSketch.height;

        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        const imageData: ImageData = ctx.createImageData(w, h);

        const res = imageData.data;

        for (let y: number = bounds.minY; y <= bounds.maxY; y++) {
            for (let x: number = bounds.minX; x <= bounds.maxX; x++) {  
              if (data[y * maskW + x] == 0) continue;
  
              const k = (y * w + x) * 4; 
              res[k] = rgba[0];
              res[k + 1] = rgba[1];
              res[k + 2] = rgba[2];
              res[k + 3] = rgba[3];
            }
          }

        this.mMagicMask = null;

        ctx.putImageData(imageData, 0, 0);

        const temp = new PIXI.Sprite( PIXI.Texture.from(canvas) );
        
        App.Handle.renderer.render(temp, this.mRenderedTexture, false, null, false);    
    }

    // 전부 백지화.
    clearCanvas(){

        const tempGrp = new PIXI.Graphics();
        tempGrp.alpha = 1;
        tempGrp.clear();
        tempGrp.beginFill(0xffffff);
        tempGrp.drawRect(0, 0, this.renderTexturSize, this.renderTexturSize );
        tempGrp.endFill();
        App.Handle.renderer.render(tempGrp, this.mRenderedTexture, false, null, false);
    }


    hexToRgb(hex, alpha) {
        const int = parseInt(hex, 16);
        const r = (int >> 16) & 255;
        const g = (int >> 8) & 255;
        const b = int & 255;
      
        return [r,g,b, Math.round(alpha * 255)];
     }
}