/**
 * Created by Administrator on 2014/12/29.
 */
define(['../../Utils/CommonUtils'], function(CommonUtils){
    return {
        intCustomId:            CommonUtils.INT_NOT_SET,
        strGroupName:           CommonUtils.STRING_NOT_SET,
        strGroupLogo:           CommonUtils.STRING_NOT_SET,
        flDistance:             CommonUtils.FLOAT_NOT_SET,
        strDescription:         CommonUtils.STRING_NOT_SET,
        intCreateTime:          CommonUtils.INT_NOT_SET,
        intMaxMemberCount:      CommonUtils.INT_NOT_SET,
        intJoinMemberCount:     CommonUtils.INT_NOT_SET,
        intActiveMemberCount:   CommonUtils.INT_NOT_SET,
        intOnlineMemberCount:   CommonUtils.INT_NOT_SET,

        userOwner:              CommonUtils.USER_NOT_SET,
        userManager:            CommonUtils.USER_NOT_SET,
        userPresident:          CommonUtils.USER_NOT_SET,

        intOwnerId:             CommonUtils.INT_NOT_SET,
        strOwnerName:           CommonUtils.STRING_NOT_SET,
        strOwnerGender:         CommonUtils.STRING_NOT_SET
    };
});