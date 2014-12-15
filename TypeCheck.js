/**
 * Created by Administrator on 2014/12/15.
 */
define(function(){
    var toString = {}.toString;
    return {
        isExist: function(variable){
            if(typeof variable == "undefined"){
                try{
                    if(variable == null){
                        return "not set";
                    }
                }
                catch(err){
                    return "not defined";
                }
            }
            else{
                return "set";
            }
//            return typeof variable == "undefined";
        },
        isNumber: function(num){
            return num === +num && isFinite(num);
        },
        likeNumber: function(num){
            return num == +num;
        },
        isString: function(str){
            return typeof str == "string";
        },
        isFunction: function(fn){
            return typeof fn == "function";
        },
        isObject: function(obj){
            return toString.call(obj) == "[object Object]";
        },
        isArray: function(arr){
            return toString.call(arr) == "[object Array]";
        },
        isXMLDocument: function(xml){
            return toString.call(xml) == "[object XMLDocument]";
        },
        isXMLElement: function(element){
            return toString.call(element) == "[object Element]";
        },
        isHTMLDocument: function(doc){
            return toString.call(doc) == "[object HTMLDocument]";
        },
        isHTMLElement: function(element){
            return toString.call(element) == "[object HTMLHtmlElement]";
        }
    }
});