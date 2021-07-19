import { ResourceManager } from '@/Mew/Core/ResourceManager'

export class Star extends PIXI.Sprite{

    private mNormal: PIXI.Texture;
    private mComplete: PIXI.Texture;

    constructor(){
        super();
        
        this.mNormal = ResourceManager.Handle.getCommonResource(`common_progress_icon_off.png`).texture;
        this.mComplete = ResourceManager.Handle.getCommonResource(`common_progress_icon_on.png`).texture;
        
        this.texture = this.mNormal;
    }
    changeStar(){
        this.texture = this.mComplete;
    }
}
export class Progress extends PIXI.Container{
    private mBG: PIXI.NineSlicePlane;
    private mStarBox: PIXI.Container
    private mStarArray: Array<Star>
    private mTotalStep: number;
    private mCurrentStep: number;

    constructor(totalStep: number){
        super()
        
        this.mBG = new PIXI.NineSlicePlane( 
            ResourceManager.Handle.getCommonResource(`common_progress_bg.png`).texture ,
            50,10,50,10
            )
        this.addChild(this.mBG)

        this.mStarArray =[];
        this.mTotalStep = totalStep
        this.mCurrentStep = -1
        
        this.mStarBox = new PIXI.Container();
        this.createStar();
        this.mBG.addChild(this.mStarBox)

        this.mBG.width = this.mStarBox.width *1.1;
        this.mBG.height = this.mStarBox.height *1.1;

        this.mStarBox.pivot.set(this.mStarBox.width/2,this.mStarBox.height/2)
        this.mStarBox.position.set(this.mBG.width/2,this.mBG.height/2)
        
        this.pivot.set(this.mBG.width/2 , this.mBG.height/2 )

    }
    createStar(){
        let offSetX =0;
        for(let i=0; i<this.mTotalStep ; i++){
            const star = new Star();
            star.position.set(offSetX , 0)
            this.mStarBox.addChild(star)
            this.mStarArray.push(star)
            offSetX = offSetX+ star.width
        }
        
    }
    nextStar(){
        if(this.mCurrentStep < this.mTotalStep ){
            this.mCurrentStep += 1;
            this.mStarArray[this.mCurrentStep].changeStar(); 
        }else{
            this.mCurrentStep = this.mTotalStep
        }
        
    }

}