/**
 * Created by Administrator on 2014/12/4.
 */
define(['Logger'], function(Logger){
    return {
        enable: true,
        infoMsgIn: function(tag, msg){
            this.write("%c[" + tag + "]", "color:blue; font-weight:bold;",  "  =>  " + msg);
        },
        infoMsgOut: function(tag, msg){
            this.write("%c[" + tag + "]", "color:blue; font-weight:bold;",  "  <=  " + msg)
        },
        error: function(type, msg){
            if(this.enable){
                Logger.error(type, msg);
            }
        },
        write: function(tag, style, msg){
            if(this.enable){
                Logger.write(tag, style, msg);
            }
        }
    }
});