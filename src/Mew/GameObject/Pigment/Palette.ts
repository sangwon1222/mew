import {ResourceManager} from '../../Core/ResourceManager';
import {Button} from '../../GameObject/Common/Button'

const artsuppliesData = [{
    normal: 'white_normal.png',
    check: 'white_check.png',
    color: '0xFFFFFF'
},
{
    normal: 'gray_normal.png',
    check: 'gray_check.png',
    color: '0x9d9d9d'
},
{
    normal: 'red_normal.png',
    check: 'red_check.png',
    color: '0xc9152d'
},
{
    normal: 'cherryred_normal.png',
    check: 'cherryred_check.png',
    color: '0xea5656'
},
{
    normal: 'orange_normal.png',
    check: 'orange_check.png',
    color: '0xff8c1a'
},
{
    normal: 'incarnadine_normal.png',
    check: 'incarnadine_check.png',
    color: '0xf4bd80'
},
{
    normal: 'pink_normal.png',
    check: 'pink_check.png',
    color: '0xff99cf'
},
{
    normal: 'yello_normal.png',
    check: 'yello_check.png',
    color: '0xefe038'
},
{
    normal: 'yellowishgreen_normal.png',
    check: 'yellowishgreen_check.png',
    color: '0x7bb634'
},
{
    normal: 'emerald_normal.png',
    check: 'emerald_check.png',
    color: '0x2ea082'
},
{
    normal: 'green_normal.png',
    check: 'green_check.png',
    color: '0x146a36'
},
{
    normal: 'skyblue_normal.png',
    check: 'skyblue_check.png',
    color: '0x2099cb'
},
{
    normal: 'blue_normal.png',
    check: 'blue_check.png',
    color: '0x274c92'
},
{
    normal: 'navy_normal.png',
    check: 'navy_check.png',
    color: '0x1b2853'
},
{
    normal: 'cobaltvioletlight_normal.png',
    check: 'cobaltvioletlight_check.png',
    color: '0x7c6dff'
},
{
    normal: 'purple_normal.png',
    check: 'purple_check.png',
    color: '0x684296'
},
{
    normal: 'brown_normal.png',
    check: 'brown_check.png',
    color: '0xb55733'
},
{
    normal: 'oldcopper_normal.png',
    check: 'oldcopper_check.png',
    color: '0x79553d'
},
{
    normal: 'darkgray_normal.png',
    check: 'darkgray_check.png',
    color: '0x515760'
},
{
    normal: 'black_normal.png',
    check: 'black_check.png',
    color: '0x000000'
},
{
    //좌측 지우개
    normal: 'eraser_normal.png',
    check: 'eraser_check.png',
    color: '0xffffff'
},
{
    //우측 전체 지우기
    normal: 'all_eraser_normal.png',
    check: 'all_eraser_check.png',
}
]

class Artsupplies extends  PIXI.Sprite{

    private mId: number;
    private mSelected: boolean;

    private mTextureNormal: PIXI.Texture;
    private mTextureSelected: PIXI.Texture;
    
    constructor( normal: string, selected: string ) {

        super();

        this.mTextureNormal = ResourceManager.Handle.getViewerResource( normal ).texture;
        this.mTextureSelected = ResourceManager.Handle.getViewerResource( selected ).texture;
        this.selected = false;
    }

    set id(pId: number) { this.mId = pId; }
    get id(): number { return this.mId; }

    set selected( pBool: boolean) { 
        this.mSelected = pBool 
        if(this.mSelected) {
            this.texture = this.mTextureSelected;
        } else {
            this.texture = this.mTextureNormal;
        }
    }
}

export class Palette extends PIXI.Sprite {

    private mPaletteIndex: number;
    private mArtsuppliesAry: Array< Artsupplies >;

    constructor() {

        super();

        this.mPaletteIndex = 19;
        this.mArtsuppliesAry = [];

        // 팔레트 배경
        const paletteBg = new PIXI.Sprite(ResourceManager.Handle.getViewerResource('tool_bg.png').texture);
        this.addChild(paletteBg);

        // 좌측 미술 용품 버튼을 생성 
        this.drawArtsupplies();

        // 선택된 미술용품 셀렉트화. mPaletteIndex 초기값을 19로 잡았기 때문에 디폴트 색상은 검정이 된다.
        this.selectedArtSupplies(); 

    }
    
    private drawArtsupplies() {
        
        // artsuppliesData 의 총수는 22개이지만  색연필과 우측 지우개는 라디오 버튼의 그룹핑 성격을 가지고 있다.
        // 21까지만 동일한 로직을 적용하고 마지막 22번의 전체 지우기는 별도의 버튼으로 생성한다.
        const totalColor = 21; 
        let stPosX = 10;
        let stPosY = 106;

        for (let i = 0; i < totalColor; i++) {
            
            const artSupplies = new Artsupplies( artsuppliesData[i].normal, artsuppliesData[i].check);

            artSupplies.id = i;
            artSupplies.position.set(stPosX, stPosY);
            artSupplies.buttonMode = true;
            artSupplies.interactive = true;
            artSupplies.on("pointerdown",(evt)=>{
                this.mPaletteIndex = evt.target.id;
                const snd = ResourceManager.Handle.getViewerResource('snd_select_btn.mp3').sound
                snd.play();
                this.selectedArtSupplies();
                this.onPaletteDown();
            });

            this.mArtsuppliesAry.push(artSupplies);

            this.addChild(artSupplies);

            if (i < 19) { // 색연필 좌표
                stPosX += 90;

                if ((i + 1) % 2 == 0) {
                    stPosX = 10;
                    stPosY += 54;
                }
            } else { // 지우개 좌표.
                stPosX = 0;
                stPosY = 700;
            }  
        }

        // 전체 지우기 버튼
        const removerBtn = new Button( 
            ResourceManager.Handle.getViewerResource( artsuppliesData[21].normal).texture,
            ResourceManager.Handle.getViewerResource( artsuppliesData[21].normal).texture,
            ResourceManager.Handle.getViewerResource( artsuppliesData[21].check ).texture
            );
        removerBtn.x = 160;
        removerBtn.y = 724;
        removerBtn.onClick = ()=>{ this.onAllRemoverDown(); };
        this.addChild(removerBtn);
    }


    private selectedArtSupplies() {

        const len = this.mArtsuppliesAry.length;

        for( let i = 0; i < len; i++ ) {
            const as = this.mArtsuppliesAry[i];

            if(as.id === this.mPaletteIndex) {
                as.selected = true;
            } else {
                as.selected = false;
            }
        }
    } 

    get paletteColor(): string { return artsuppliesData[ this.mPaletteIndex ].color; }

    onPaletteDown() {
        //overrride
    }

    onAllRemoverDown() {
        //overrride
    }
}