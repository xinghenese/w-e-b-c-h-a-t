/**
 * Created by Administrator on 2014/12/3.
 */
define(function(){
    var CommonUtils = {
        INT_NOT_SET:            0,
        FLOAT_NOT_SET:          0.0,
        STRING_NOT_SET:         "",
        BOOLEAN_NOT_SET:        false,
        VALUE_INVALID:          "INVALID",
        ARRAY_NOT_SET:          [],
        OBJECT_NOT_SET:         {},

        CONNECT_TIMEOUT:        20 * 1000,
        ONE_YEAR:               12 * 30 * 24 * 60 * 60 * 1000,

        RESPONSE_ERROR_NETWORK: -1,

        USER_NOT_SET:           "CLASS_USER",
        MYSELF_NOT_SET:         "CLASS_MYSELF",
        GROUP_NOT_SET:          "CLASS_GROUP",
        MESSAGE_NOT_SET:        "CLASS_MESSAGE",
        GROUP_MESSAGE_NOT_SET:  "CLASS_GROUP_MESSAGE",
        checkArgument:          function(para){
            if(!para){
                throw new TypeError("[TypeError]: Argument Illegally");
            }
        }
    };
    return CommonUtils;
});