import {ResourceManager} from '../../Core/ResourceManager'
import gsap from 'gsap';


export class Slider extends PIXI.Container{

    private mSliderMask: PIXI.Container;
    private mMask: PIXI.Graphics;
    
    private mSlider: PIXI.Sprite;
    private mCursor: PIXI.Sprite;

    private mSliderImg: string;
    private mCursorImg: string;

    private mMaxValue: number;  // 100

    private mCurrentSlider: PIXI.Sprite;
    private mCurrentValue: number; // 10

    private mCursorFlag: boolean;

    get flag(): boolean { return this.mCursorFlag}
    
    constructor( sliderBar: string, currentBar: string , current?: number ){
        super()
        
        if( current ) this.mCurrentValue = current;
        else{ this.mCurrentValue = 0 }

        this.mCursorFlag = false;
        this.mSliderImg = sliderBar
        this.mCursorImg = `scroll_btn.png`;

        /**전체 슬라이더 */
        this.mSlider = new PIXI.Sprite( ResourceManager.Handle.getCommonResource( sliderBar ).texture )
        this.addChild(this.mSlider)

        /**마스크 슬라이더 */
        this.mSliderMask = new PIXI.Container();
        this.addChild(this.mSliderMask)

        /**커서 */
        this.mCursor = new PIXI.Sprite( ResourceManager.Handle.getCommonResource(`scroll_btn.png`).texture )
        this.addChild(this.mCursor)
        this.mCursor.anchor.set(0.5)
        this.mCursor.position.set(current*this.mSlider.width, this.mSlider.height*0.3)
        gsap.fromTo(this.mCursor, {angle:-15 },{angle:15,duration:1} ).yoyo(true).repeat(-1)

        /**현재 커서 위치 */
        this.mCurrentSlider = new PIXI.Sprite( ResourceManager.Handle.getCommonResource( currentBar ).texture )
        this.mSliderMask.addChild(this.mCurrentSlider)

        /**마스크 */
        this.mMask = new PIXI.Graphics();
        this.mMask.beginFill(0x0000,1)
        this.mMask.drawRect(0,0, this.mCursor.x ,this.mSlider.height)
        this.mMask.endFill();
        this.mSliderMask.addChild(this.mMask)
        this.mCurrentSlider.mask = this.mMask;

        /**마우스 이벤트 */
        this.interactive = true;
        this.buttonMode = true;

        this.on("pointerdown",(evt)=>{
            this.mCursorFlag = true;
            this.mCursor.x = evt.data.global.x - this.x;
            this.mMask.width = this.mCursor.x;
        })
        .on("pointermove",(evt)=>{
            if( this.mCursorFlag ){
                this.mCursor.x = evt.data.global.x - this.x;
                this.mMask.width = this.mCursor.x;
                if( this.mCursor.x > this.mSlider.width-10 ){ this.mCursor.x = this.mSlider.width }
                if( this.mCursor.x < 10 ){ this.mCursor.x = 0 }
            }
        })
        .on("pointerup",()=>{
            this.mCurrentValue = this.mCursor.x / this.mSlider.width;
            this.mCursorFlag = false;
            this.setCurrentGauge();
            this.onChangeValue(this.mCurrentValue);
        })
        .on("pointerupoutside",()=>{
            this.mCurrentValue = this.mCursor.x / this.mSlider.width;
            this.mCursorFlag = false;
            this.setCurrentGauge();
            this.onChangeValue(this.mCurrentValue);
        })
    }
    setCurrentGauge(){
        /**마스크 */
        this.mSliderMask.removeChildren()
        this.mMask = new PIXI.Graphics();
        this.mMask.beginFill(0x0000,1)
        this.mMask.drawRect(0,0, this.mCursor.x ,this.mSlider.height)
        this.mMask.endFill();
        this.mSliderMask.addChild(this.mMask , this.mCurrentSlider)
        this.mCurrentSlider.mask = this.mMask;
    }

    getPercent(): number{
        this.mCurrentValue = this.mCursor.x ;
        return this.mCurrentValue/ this.mSlider.width;
    }

    onChangeValue( v: number ){
//
    }

    setValue( v: number ){
        
        this.mCursor.x = this.mSlider.width * v;
        this.mSliderMask.removeChildren()
        this.setCurrentGauge()
        
    }

    setOffMode(flag: boolean , offS?: string, offC?: string){
        if(flag){
            this.mCursor.x = 0;
            this.setCurrentGauge()
            this.mSlider.texture = ResourceManager.Handle.getCommonResource(offS).texture
            this.mCursor.texture = ResourceManager.Handle.getCommonResource(offC).texture
        }else{
            this.mSlider.texture = ResourceManager.Handle.getCommonResource( this.mSliderImg ).texture 
            this.mCursor.texture = ResourceManager.Handle.getCommonResource( this.mCursorImg ).texture
        }   
        
    }
}