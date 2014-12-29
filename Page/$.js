/**
 * Created by Administrator on 2014/12/15.
 */
define(['TypeCheckExtender', 'DocumentFactory', 'TreeType', 'CSSUtil', 'Layout'], function(TypeCheck, DocumentFactory, TreeType, CSSUtil, Layout){
    var slice = [].slice, concat = [].concat;

    var $ = function(selector, context, count){
        context = context && context.nodeType == 1 && context || document;
        var nodeList = context.querySelectorAll(selector);
        if(nodeList.length > 1){
            return nodeList;
        }
        else if(nodeList.length == 1){
            return nodeList[0];
        }
        return null;
    };

    $.each = function(obj, fn, args){
//        if(TypeCheck.likeArray(obj)){
//            for(var i  = 0, len = obj.length; i < len; i++){
//                fn.apply(obj[i], args);
//            }
//        }
//        return obj;
        return  obj.each(fn, args);
    };

    $.createPanel = function(obj, mapConversion){
        if(TypeCheck.isObject(obj)){
            return DocumentFactory.parseTree(obj, TreeType.HTMLDocument, mapConversion);
        }
    };

    $.createXMLDocument = function(obj, mapConversion){
        if(TypeCheck.isObject(obj)){
            return DocumentFactory.parseTree(obj, TreeType.XMLDocument, mapConversion);
        }
    };

    $.parseXMLToString = function(xml){
        if(TypeCheck.isXMLDocument(xml)){
            return DocumentFactory.parseXMLToString(xml);
        }
    };

    $.merge = function(){
        for(var i = 0, len = arguments.length, arr = []; i < len; i++){
            if(TypeCheck.likeArray(arguments[i])) {
                concat.call(arr, slice.call(arguments[i]));
            }
        }
        return arr;
    };

    return $;
});