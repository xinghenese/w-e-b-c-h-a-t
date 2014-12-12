/**
 * Created by Administrator on 2014/12/4.
 */
define(function(){
    var _cssFont = "font-family:Times New Roman;";
    return {
        enable: true,
        log: function(msg){
            this.write("%cINFO: ", "color:green; font-weight:bold;", msg);
        },
        write: function(tag, style, msg){
            if(this.enable){
                setTimeout(function(){
                    console.log(tag, style, msg);
                }, 0);
            }
        },
        info: function(type, msg){
            if(this.enable){
                setTimeout(function(){
                    console.info("%c[" + type + "]: ", "font-weight:bold;", msg);
                }, 0);
            }
        },
        warn: function(type, msg){
            if(this.enable){
                setTimeout(function(){
                    console.warn("%c[" + type + "]: ", "font-weight:bold;", msg);
                }, 0);
            }
        },
        error: function(type, msg){
            if(this.enable){
                setTimeout(function(){
                    console.error("%c[" + type + "]: ", "font-weight:bold;", msg);
                }, 0);
            }
        },
        timer: function(name, fn, args){
            if(!this.enable){
                return;
            }
            if(!name || typeof name != "string"){
                this.warn("Arguments Invalid", "the name of the timer is invalid");
                return;
            }
            setTimeout(function(){
                console.time(name);
                console.log(name + ": \t" + fn(args));
                console.timeEnd(name);
            }, 0);
        },
        group: function(name, queue){
            if(this.enable){
                setTimeout(function(){
                    console.group();
                    queue();
                    console.groupEnd();
                }, 0);
            }
        }
    }
});