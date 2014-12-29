/**
 * Created by Administrator on 2014/12/18.
 */
define(['Base', 'TypeCheck'], function(Base, TypeCheck){

    var TypeCheckExtender = new ((function(){
        this.isObjectReference = function(ref){
            return typeof ref === "object";
        };
        this.isNumber = function(num){
            return num === +num && isFinite(num);
        };
        this.likeNumber = function(num){
            return num == +num;
        };
        this.likeArray = function(list){
            return this.isNumber(list.length);
        };
        this.isEmptyArray = function(array){
            return this.isArray(array) && !array;
        };
        this.isEmptyObject = function(obj){
            return this.isObject(obj) && !obj;
        };
    }).inherits(TypeCheck));

//    TypeCheckExtender.isPrimitive = function(variables){
//        return typeof variables !== "object" && typeof variables !== "function";
//    };

//    TypeCheckExtender.isObjectReference = function(ref){
//        return typeof ref === "object";
//    };
//
//    TypeCheckExtender.isNumber = function(num){
//        return num === +num && isFinite(num);
//    };
//
//    TypeCheckExtender.likeNumber = function(num){
//        return num == +num;
//    };
//
//    TypeCheckExtender.likeArray = function(list){
//        return this.isNumber(list.length);
//    };
//
//    TypeCheckExtender.isEmptyArray = function(array){
//        return this.isArray(array) && !array;
//    };
//
//    TypeCheckExtender.isEmptyObject = function(obj){
//        return this.isObject(obj) && !obj;
//    };

    return TypeCheckExtender;

});