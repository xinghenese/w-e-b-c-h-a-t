/**
 * Created by Administrator on 2014/12/18.
 */
define(['Base', 'TypeCheck'], function(Base, TypeCheck){

    var TypeCheckExtender = new ((function(){

    }).inherits(TypeCheck));

    TypeCheckExtender.isNumber = function(num){
        return num === +num && isFinite(num);
    };

    TypeCheckExtender.likeNumber = function(num){
        return num == +num;
    };

    TypeCheckExtender.likeArray = function(list){
        return this.isNumber(list.length);
    };

    TypeCheckExtender.isEmptyArray = function(array){
        return this.isArray(array) && !array;
    };

    TypeCheckExtender.isEmptyObject = function(obj){
        return this.isObject(obj) && !obj;
    };

    return TypeCheckExtender;

});