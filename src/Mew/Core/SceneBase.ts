import * as PIXI from "pixi.js";
import { App } from './App';
import { ResourceManager, ResourceTable } from './ResourceManager';
import Axios, { AxiosResponse } from 'axios'
import Config from '../Config';
import PIXISound from 'pixi-sound'

export class SceneBase extends PIXI.Container{
    
    private mName: string
    private mProductName: string;
    private mVideoArray: Array<HTMLVideoElement>

    get gamename(): string{ return this.mName }

    get productName(): string{ return this.mProductName }
    set productName( v: string ){ this.mProductName = v }

    constructor(name: string){
        super();
        this.mName = name;
        this.mProductName = '';
    }

    async onInit(){
        //
    }
    async onStart(){
        //
    }
    async onEnd(){
        //
    }
    goScene(name: string){
        PIXISound.stopAll();
        App.Handle.goScene( name );
    }

    // async getCommonJSON() {
    //     return await ResourceManager.Handle.getCommonJSON( this.gamename.toLowerCase() );
    // }
    // async getViewerJSON() {
    //     return await ResourceManager.Handle.getViewerJSON( this.gamename.toLowerCase() );
    // }
    // async getProductJSON(){
    //     return await ResourceManager.Handle.getProductJSON( this.productName.toLowerCase(), this.gamename.toLowerCase() );
    // }
// ------------------------------------------------------------------------------        
    async loadCommonResource( rscList: ResourceTable ){
        await ResourceManager.Handle.loadCommonResource( rscList );
    }
    async loadViewerResource( rscList: ResourceTable ){
        await ResourceManager.Handle.loadViewerResource( rscList );
    }
    async loadProductResource( rscList: ResourceTable ){
        await ResourceManager.Handle.loadProductResource( this.productName, rscList );
    }
// ------------------------------------------------------------------------------    
    getCommonResource( fname: string): PIXI.LoaderResource{
        return ResourceManager.Handle.getCommonResource( fname );
    }
    getViewerResource( fname: string): PIXI.LoaderResource{
        return ResourceManager.Handle.getViewerResource( fname );
    }
    getProductResource( fname: string): PIXI.LoaderResource{
        if( this.mProductName == "" ){
            throw("SceneBase의 프로덕트 이름이 비어있습니다.");
            return null;
        }
        return ResourceManager.Handle.getProductResource( this.mProductName, fname );
    }
}
