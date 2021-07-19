// -------------------------------------------------------
export const API = {
    complete:{
        list:{
            req:'completeList'
        }
    },
    pigment:{
        recieved: {
            req:'screenshot'
        },
        screenShot:{
            req:'/learning/Pigment/screenshot'
        }
    }
}
// -------------------------------------------------------
// 완료정보받기
export namespace completeBookID{
    export interface LockAndunLock{
        isLocked: boolean; //도장 여부
    }
    export interface FinishBookID{
        [bookID: string]: LockAndunLock;  //권수 ex) 'b1',b2'...
    }
    // 액티비티 완료 정보
    export interface EndActivity{
        [activity: string]: LockAndunLock; //액티비티 ex) 'Song',ReadTheLyrics'...
    }
}
// -------------------------------------------------------
// pigment
export namespace PigMent {
    export interface ScreenShotData{
        screenShot: Blob;
    }
}
// -------------------------------------------------------