/**
 * Created by Administrator on 2014/12/15.
 */
define(function(){
    return {
        cssFormat: function(input){
            return input.replace(/([A-Z])/g, function(){
                var _s1;
                if(_s1 = RegExp.$1){
                    return '-' + _s1.toLowerCase();
                }
            });
        },
        toCSSText: function(obj){
            var result = "";
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    result += key + ":" + this.cssFormat(obj[key]) + ";";
                }
            }
        }
    };
});