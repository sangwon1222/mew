import { App } from './App';
import Util from '../../Util'

export interface ResourceTable{
    images?: Array<string>;
    sounds?:  Array<string>;
    json?:   Array<string>;
    spine?:  Array<string>;
    video?:  Array<string>;
}

import Axios from 'axios'
import { utils } from 'pixi.js';

export class ResourceManager{
    //-----------------------------------
    // singleton
    private static _handle: ResourceManager;
    static get Handle(): ResourceManager { 
        if( ResourceManager._handle === undefined ){
            ResourceManager._handle = new ResourceManager();
        }
        return ResourceManager._handle 
    }
    //-----------------------------------

    // private mURLRoot = 'http://localhost:8080/rsc/';
    private mURLRoot = Util.Config.restAPI;
    // Noto sans
    // private mResource: { [name: string]: PIXI.LoaderResource };
    private mCommonResource: { [name: string]: PIXI.LoaderResource };
    private mViewerResource: { [name: string]: PIXI.LoaderResource };
    private mProductResource: { [name: string]: PIXI.LoaderResource };
    private mFontResource: { [name: string]: PIXI.LoaderResource };

    get urlRoot(): string{ return this.mURLRoot }

    constructor(){
        
        // this.mResource = {};
        this.mCommonResource = {};
        this.mViewerResource = {};
        this.mProductResource = {};
    }
// 미사용------------------------------------------------------------------------------
    // async getCommonJSON( name: string ){
    //     return await Axios.get(`${this.mURLRoot}resourceTable/common/${name}.json`);
    // }
    // async getViewerJSON( name: string ){
    //     return await Axios.get(`${this.mURLRoot}resourceTable/viewer/${name}.json`);
    // }
    // async getProductJSON( productName: string, name: string ){
    //     return await Axios.get(`${this.mURLRoot}resourceTable/product/${productName}_${name}.json`);
    // }   
// ------------------------------------------------------------------------------
    getCommonResource( fname: string): PIXI.LoaderResource{
        return this.mCommonResource[ `${fname}` ];
    }
    getViewerResource( fname: string): PIXI.LoaderResource{
        return this.mViewerResource[ `${App.Handle.currentScene.gamename.toLowerCase()}:${fname}` ];
    }
    getProductResource( productName: string, fname: string): PIXI.LoaderResource{
        return this.mProductResource[ `${App.Handle.currentScene.gamename.toLowerCase()}:${productName}:${fname}` ];
    }

    /**공용 리소스 */
    public async loadCommonResource( rscList: ResourceTable ): Promise<void>{
        // console.warn( rscList );
        return new Promise<void>( (resolve,reject)=>{
            
            const viewer = new PIXI.Loader();
            for( const[category, fnamelist] of Object.entries( rscList ) ){
                for( const fname of fnamelist ){
                    if( this.mCommonResource[`${fname}`] === undefined ){
                        viewer.add( 
                            `${fname}`, 
                            `${this.mURLRoot}common/${category.toLowerCase()}/${fname}`
                        );
                    }
                }  
            }
            viewer.load( (loader, resource)=>{
                for( const [key, value]  of Object.entries( resource )){
                    this.mCommonResource[ key ] = value;
                }
                resolve();
            })
        })
    }
    
    /**뷰어 리소스 */
    public async loadViewerResource( rscList: ResourceTable ): Promise<void>{
        return new Promise<void>( (resolve,reject)=>{
            
            const viewer = new PIXI.Loader();
            for( const[category, fnamelist] of Object.entries( rscList ) ){
                for( const fname of fnamelist ){
                    if( this.mViewerResource[`${App.Handle.currentScene.gamename.toLowerCase()}:${fname}`] === undefined ){
                        viewer.add( 
                            `${App.Handle.currentScene.gamename.toLowerCase()}:${fname}`, 
                            `${this.mURLRoot}viewer/${App.Handle.currentScene.gamename.toLowerCase()}/${category.toLowerCase()}/${fname}`
                        );
                    }
                }  
            }
            viewer.load( (loader, resource)=>{
                for( const [key, value]  of Object.entries( resource )){
                    this.mViewerResource[ key ] = value;
                }
                resolve();
            })
        })
    }

    /**프로덕트 리소스 */
    public async loadProductResource( productName: string, rscList: ResourceTable ): Promise<void>{
        return new Promise<void>( (resolve,reject)=>{
            const product = new PIXI.Loader();
            // console.warn(rscList)
            for( const[category, fnamelist] of Object.entries( rscList ) ){
                for( const fname of fnamelist ){
                    if( this.mProductResource[`${App.Handle.currentScene.gamename.toLowerCase()}:${productName}:${fname}`] == undefined){
                        product.add( 
                            `${App.Handle.currentScene.gamename.toLowerCase()}:${productName}:${fname}`, 
                            `${this.mURLRoot}product/${productName}/${App.Handle.currentScene.gamename.toLowerCase()}/${category.toLowerCase()}/${fname}`
                        );
                    }
                }
            }
            product.load( (loader, resource)=>{
                for( const [key, value]  of Object.entries( resource )){
                    this.mProductResource[ key ]= value;
                }
                resolve();
            })
        })
    }
}
