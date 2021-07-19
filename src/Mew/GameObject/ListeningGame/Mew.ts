import { Splash } from '../Common/Splash'
import { ResourceManager } from '../../Core/ResourceManager';
import Config from '@/Mew/Config';
import gsap from 'gsap';
import { StoneGroup } from './StoneGroup';
import { ListeningGame } from '@/Mew/scenes/ListeningGame';

export enum MewState{
    normal,
    jump,
    fail,
    in,
    success
}

export class Mew extends PIXI.spine.Spine{

    private mMewState: MewState

    get mewState(): MewState { return this.mMewState}
    set mewState(v: MewState) { 
        this.mMewState = v
        this._updateMewState();
    }

    constructor(){
        super(ResourceManager.Handle.getViewerResource(`common_meo.json`).spineData)

        this.position.set(Config.app.width/2 , Config.app.height*0.35)
        this.scale.set(Config.app.videoScale)
        this.mMewState = MewState.in;
        this._updateMewState();
        
    }

    _updateMewState(){
        switch(this.mMewState){
            case MewState.normal:{
                this.state.setAnimation(0,`defalt`,true)
            }break;
            case MewState.jump:{
                this.state.setAnimation(0,`jump`,false)
            }break;
            case MewState.fail:{
                this.state.setAnimation(0,`fail`,false)
            }break;
            case MewState.in:{
                this.position.set(Config.app.width/2 , Config.app.height*0.35)
                this.state.setAnimation(0,`in`,false)
                gsap.delayedCall(this.state.data.skeletonData.findAnimation(`in`).duration,()=>{
                    this.mMewState = MewState.normal;
                    this._updateMewState();
                })
            }break;
            case MewState.success:{
                this.state.setAnimation(0,`success`,true)
            }break;
        }
    }

    jumpMew(pos: PIXI.IPoint , width: number): Promise<void>{
        return new Promise((resolve,reject)=>{
            this.mewState = MewState.jump;
            gsap.to(this, {x: pos.x +width/2 , y:Config.app.height*0.6 , duration: 0.5})
            .eventCallback("onComplete",()=>{
                resolve();
            })
        })
    }

    Pass(): Promise<void>{
        return new Promise((resolve,reject)=>{
            this.mewState = MewState.jump;
            gsap.to(this, {x: Config.app.width/2 , y:Config.app.height*0.85 , duration: 0.5})
            .eventCallback("onComplete",()=>{
                resolve();
            })
        })
    }

    resetMew(){
        this.mewState = MewState.in;
    }
}