import { Clock, EventDispatcher } from "three";
interface Subs{
    [type: string]: EventListener[]
}
export class Time extends EventDispatcher<any>{
    public time: Clock | null
    private subs: Subs
    constructor(){
        super()
        this.time = new Clock();
        this.subs = {};
        this.update()
    }
    private update(){
        this.dispatchEvent( { type: 'tick', time: this.time} );
        requestAnimationFrame(this.update.bind(this))
    }
    on(type: string, listener: EventListener){
        if(!this.subs[type]){
            this.subs[type] = [listener]
        }else{
            this.subs[type].push(listener);
        }
        this.addEventListener(type, listener)
    }
    removeAll(type: string){
        if(this.subs[type]){
            this.subs[type].forEach(listener=>{
                this.remove(type, listener)
            });
        }
    }
    remove(type: string, listener: EventListener){
        if(this.subs[type]){
            this.subs[type].some(subListener=>{
                if(subListener === listener){
                    this.remove(type, listener);
                    return true;
                }
            });
        }
        this.removeEventListener(type, listener)
    }
    private clear(){
        Object.keys(this.subs).forEach(type => {
            this.removeAll(type)
        });
    }
    dispose(){
        this.clear();
        this.time = null
    }
}