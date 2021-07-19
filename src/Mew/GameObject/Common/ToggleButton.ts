import {ResourceManager} from '../../Core/ResourceManager'
import { Button } from './Button';


export class ToggleButton extends Button{
    
    private mToggleFlag: boolean;
    private mTextueName: { normal: PIXI.Texture; normal2: PIXI.Texture; down?: PIXI.Texture; over?: PIXI.Texture; disable?: PIXI.Texture; down2?: PIXI.Texture; over2?: PIXI.Texture; disable2?: PIXI.Texture }
    
    constructor( 
        normal: PIXI.Texture, normal2: PIXI.Texture, 
        down?: PIXI.Texture ,down2?: PIXI.Texture,
        over?: PIXI.Texture, over2?: PIXI.Texture,
        disable?: PIXI.Texture, disable2?: PIXI.Texture
        ){
        super(normal , down, over, disable)
    
        this.mTextueName = { 
            normal: normal,
            normal2: normal2,
            down: down,
            over: over,
            disable: disable,
            down2: down2,
            over2: over2,
            disable2: disable2
        }
        this.anchor.set(0.5)
        this.mToggleFlag = false;

    }
    onClick(){
        this.mToggleFlag = !this.mToggleFlag;
        if( this.mToggleFlag ){
            this.changeTexture( this.mTextueName.normal2, this.mTextueName.down2, this.mTextueName.over2, this.mTextueName.disable2 );
        }else{
            this.changeTexture( this.mTextueName.normal, this.mTextueName.down, this.mTextueName.over, this.mTextueName.disable );
        }
        this.onChangeState( this.mToggleFlag );
    }

    // 강제적으로 스테이트를 변경한다.( 클릭에 의한 것이 아닌..)
    changeState( flag: boolean, excuteCallBack = false){
        if( this.mToggleFlag != flag ){
            this.mToggleFlag = flag;
            if( this.mToggleFlag ){
                this.changeTexture( this.mTextueName.normal2, this.mTextueName.down2, this.mTextueName.over2, this.mTextueName.disable2 );
            }else{
                this.changeTexture( this.mTextueName.normal, this.mTextueName.down, this.mTextueName.over, this.mTextueName.disable );
            }
            if( excuteCallBack ) this.onChangeState( this.mToggleFlag );
        }
    }

    // 토글상태 변경시 실행되는 콜백함수( for override )
    onChangeState( toggled: boolean){
        //
    }
    

}