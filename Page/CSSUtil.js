/**
 * Created by Administrator on 2014/12/15.
 */
define(['TypeCheck'], function(TypeCheck){
    return {
        cssFormat: function(input){
            return input.replace(/([A-Z])/g, function(){
                var _s1;
                if(_s1 = RegExp.$1){
                    return '-' + _s1.toLowerCase();
                }
            });
        },
        classify: function(obj){
            if(TypeCheck.isObject(obj)){

            }
        },
        toCSSText: function(obj){
            var result = "";
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    result += this.cssFormat(key) + ":" + obj[key] + ";";
                }
            }
            return result;
        }
    };
});