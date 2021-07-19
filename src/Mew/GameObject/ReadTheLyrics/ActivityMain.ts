import Config from '@/Mew/Config';
import { ResourceManager } from '@/Mew/Core/ResourceManager';
import { Controller } from './Controller';
import { Book } from './Book';


export class ActivityMain extends PIXI.Container{
    private mController: Controller;
    private mBook: Book;

    constructor(){
        super()
        
        const title = new PIXI.Sprite(
            ResourceManager.Handle.getViewerResource(`readtolyrics_title.png`).texture
        )
        title.y =10;
        
        this.mBook = new Book();
        
        this.mController = new Controller( this.mBook );
        this.mController.position.set(0, Config.app.height);
        
        this.addChild( this.mBook );
        this.addChild(this.mController);
        this.addChild(title)
        
        // this.mController.on("play", ()=>{
        //     console.log( "play book")
        // })
        // this.mController.on("pause", ()=>{
        //     console.log( "pause book")
        // })

    }

    start(){
        this.mBook.init();
        this.mBook.startPlay();
    }

    stop(){
        this.mBook.destroy();
    }
}