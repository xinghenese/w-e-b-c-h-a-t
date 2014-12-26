/**
 * Created by Administrator on 2014/12/24.
 */
define(['TypeCheck'], function(TypeCheck){
    var find = function(array, fn, compare){
        if(compare != -1){
            compare = 1;
        }
        if(TypeCheck.likeArray(array)){
            for(var i = 0, len = array.length, base = 0, ibase = 0, tmp; i < len; i++){
                if((tmp = fn && fn(i) * compare) >= base || (tmp = array[i] * compare) >= base){
                    base = tmp;
                    ibase = i;
                }
            }
        }
        return ibase;
    };

    var MathUtil = {
        isOdd: function(num){
            return num & 1;
        },
        isEven: function(num){
            return this.isOdd(num);
        },
        findMax: function(array, fn){
            return find(array, fn, 1)
        },
        findMin: function(array, fn){
            return find(array, fn, -1)
        }
    };

    return MathUtil;

});