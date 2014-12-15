/**
 * Created by Administrator on 2014/12/15.
 */
define(['../TypeCheck', 'DocumentFactory', 'TreeType'], function(TypeCheck, DocumentFactory, TreeType){
    var $ = function(selector, context){
        context = context.nodeType == 1 && context || document;

        return context.querySelectorAll(selector);
    };
    $.createPanel = function(obj, mapConversion){
        if(TypeCheck.isObject(obj)){
            var p = DocumentFactory.parseTree(obj, TreeType.HTMLDocument, mapConversion);
            console.log("root: " + Object.prototype.toString.call(p.getRoot()));
            console.log(p.getRoot());
            return p.getRoot();
        }
    };
    return $;
});