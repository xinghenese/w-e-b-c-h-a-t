/**
 * Created by Administrator on 2014/12/15.
 */
define(function(){
    var toString = {}.toString;
    var test = function(type, suffix){
        suffix = suffix && ("\\w*" + suffix);
        return function(variable){
            return toString.call(variable).search(new RegExp("\\[object\\s\\w*" + type + suffix +  "\\w*\\]$")) == 0;
        }
    };

    var arrType = ["Undefined", "Number", "String", "Object", "Function", "Array", "XMLDocument", "Element", "HTMLDocument", "HTML-Element", "NodeList"];

    var TypeCheck = {};

    for(var i = 0, len = arrType.length; i < len; i++){
        var _type = arrType[i].split('-'), tmp = _type[1] || "";
        TypeCheck["is" + _type[0] + tmp] = test(_type[0], tmp);
    }

    return TypeCheck;

});