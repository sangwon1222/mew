import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { API, PigMent as PigmentData } from "./Define"
import store from '@/store'
import Axios from 'axios'
import Alert from 'sweetalert2';
import Util from '@/Util'

@Module({
    namespaced:true,
    name:"pigment",
    dynamic:true,
    store,
})

class Pigment extends VuexModule{


    @Action async setPigmentScreenShot (payload: PigmentData.ScreenShotData ){
        try {
            const response = await Axios.post(`${Util.Config.restAPI}${API.pigment.screenShot.req}`, payload )
            if(response.data.ok === true ){
                //
            }else{
                Alert.fire({
                    icon:'error',
                    title:'setPigmentScreenShot ERROR',
                    text:response.data.err,
                })
            }
        }catch(e){
            console.log(`%c ${e}`,"color:red; font-weight:bold;")
        }
    }

    @Action async setRecieved(){
        try{
            const response = await Axios.post(`${Util.Config.restAPI}${API.pigment.recieved.req}`,{})
            if(response.data.ok===true){
                console.error(response.data);
            }else{
                Alert.fire({
                    icon:'error',
                    title:'setRecieved ERROR',
                    text:response.data.err,
                })
            }
        }catch(e){
            console.log(`%c ${e}`,"color:red; font-weight:bold;")
        }
    }
}

export const PigmentModule = getModule(Pigment)