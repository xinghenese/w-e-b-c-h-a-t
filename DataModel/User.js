/**
 * Created by Administrator on 2014/12/3.
 */
define(['Proxy'], function(Proxy){
    var UserProxy = Proxy.createProxyFromTemplate({
        _constructor:       ConstructorMap.User,
        intUserId:          CommonUtils.INT_NOT_SET,
        strUserName:        CommonUtils.STRING_NOT_SET,
        strNickName:        CommonUtils.STRING_NOT_SET,
        strGender:          CommonUtils.STRING_NOT_SET,
        intBirthday:        CommonUtils.INT_NOT_SET,
        strSign:            CommonUtils.STRING_NOT_SET,
        strOccupation:      CommonUtils.STRING_NOT_SET,
        intMobile:          CommonUtils.INT_NOT_SET,
        flDistance:         CommonUtils.FLOAT_NOT_SET,  // unit km
        intLevel:           CommonUtils.INT_NOT_SET,
        bUserVisibility:    CommonUtils.BOOLEAN_NOT_SET,
        strAvatar:          CommonUtils.STRING_NOT_SET,
        intJoinRoomCount:   CommonUtils.INT_NOT_SET,

        groupFavourite:     CommonUtils.GROUP_NOT_SET
    });
    return UserProxy;
});