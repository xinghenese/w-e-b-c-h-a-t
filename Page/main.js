/**
 * Created by Administrator on 2014/12/24.
 */
require(['$'], function($){
    var dialog, userlist;
    function showDialog(msg){
        if(!dialog){
            dialog = createBox();
        }
        if(!userlist){
            userlist = createUserList();
        }
    }

    function createBox(){
        var box = $.createPanel({
            id: "msgBox",
            style: {
                width: "464px",
                height: "243px",
                position: "absolute",
                color: "#1d1d1d",
                backgroundColor: "#FFFFFF"
            },
            div: [{
                id: "box_title",
                text: "意见反馈",
                style: {
                    width: "100%",
                    height: "52px",
                    backgroundColor: "#F8F8F4",
                    font: "14px 宋体"
                }
            },{
                id: "box_content",
                style: {
                    width: "422px",
                    height: "125px",
                    margin: "16px 20px 0",
                    backgroundColor: "#F8F8F7"
                }
            },{
                id: "btnSend",
                text: "发送",
                style: {
                    width: "82px",
                    height: "30px",
                    marginTop: "10px",
                    backgroundColor: "#21b69d",
                    color: "#FFFFFF",
                    font: "14px 宋体",
                    cursor: "pointer"
                }
            }, {
                id: "btnClose",
                text: "\u00D7",
                style: {
                    width: "52px",
                    height: "52px",
                    position: "absolute",
                    top: "0",
                    right: "0",
                    color: "#181818",
                    font: "40px 宋体",
                    cursor: "pointer"
                }
            }]
        });

        box.setCenter();
        $('#box_title, #btnClose', box).setTextCenter();
        $('#box_content, #btnSend', box).setVerticalAlign('right').setTextCenter();

        return box;

//        var _xml = DocumentFactory.parseTree({
//            div: {
//                id: "msgBox",
//                div: [
//                    {
//                        id: "title"
//                    },
//                    {
//                        id: "content"
//                    },
//                    {
//                        id: "btnSend",
//                        style: {
//                            width: "200px",
//                            height: "80px",
//                            backgroundColor: "#DDDDDD"
//                        }
//                    }
//                ]
//            }
//        }, TreeType.XMLDocument);
//        console.log(DocumentFactory.parseXMLToString(_xml));
    }

    function createUserList(){
        var view = $.createPanel({
            id: "userlist",
            style: {
                width: "280px",
                height: "800px",
                position: "absolute",
                top: "100px",
                left: "200px",
                backgroundColor: "#e9eee3"
            },
            div: [{
                id: "list_title",
                style: {
                    width: "100%",
                    height: "52px",
                    backgroundColor: "#2fd5d9"
                }
            }, {
                id: "myAvatar",
                style: {
                    width: "58px",
                    height: "58px",
                    position: "absolute",
                    top: "11px",
                    left: "14px",
                    borderRadius: "29px",
                    backgroundColor: "#FFFFFF"
                }
            }, {
                id: "myName",
                text: "佳宁",
                style: {
                    width: "80px",
                    height: "14px",
                    position: "absolute",
                    left: "91px",
                    top: "22px",
                    color: "#0d6359",
                    font: "14px 宋体",
                    lineHeight: "14px"
                }
            }, {
                id: "select",
                text: "\u2714",
                style: {
                    width: "16px",
                    height: "14px",
                    position: "absolute",
                    top: "62px",
                    right: "36px",
                    border: "1px #d0d5ca solid",
                    borderRadius: "4px",
                    backgroundColor: "#FFFFFF",
                    color: "#2fd5b9"
                }
            },{
                id: "search_bar",
                style: {
                    width: "auto",
                    height: "33px",
                    margin: "42px 13px 7px 9px",
                    border: "1px #d0d5ca solid",
                    backgroundColor: "#d0d5ca"
                },
                input: {
                    type: "text",
                    id: "search",
                    value: "请输入呢称\\聊聊号",
                    style: {
                        width:"159px",
                        height: "100%",
                        display: "inline-block",
                        marginRight: "4px",
                        border: "1px #d0d5ca solid",
                        padding: "6px 10px",
                        font: "14px 宋体",
                        color: "#bfc4b9"
                    }
                },
                div: [//{
//                    id: "search",
//                    text: "请输入呢称\\聊聊号",
//                    style: {
//                        width:"159px",
//                        height: "100%",
//                        backgroundColor: "#FFFFFF",
//                        marginRight: "1px",
//                        padding: "6px 10px",
//                        font: "14px 宋体",
//                        color: "#bfc4b9"
//                    }
//                },
                    {
                        id: "search_button",
                        text: "s",
                        style: {
                            width: "39px",
                            height: "100%",
//                        position: "relative",
//                        top: "-100%",
//                        left: "219px",
                            marginRight: "1px",
                            backgroundColor: "#FAFFF4",
                            color: "#bfc4b9"
                        }
                    }, {
                        id: "search_button2",
                        text: "sa",
                        style: {
                            width: "39px",
                            height: "100%",
                            marginRight: "1px",
                            backgroundColor: "#FAFFF4",
                            color: "#bfc4b9"
                        }
                    }]
            }]
        });

        $('#search, #search_button, #search_button2', view).float().borderBox().setTextCenter();
//        $('#search, #search_button, #search_button2', view).borderBox().setTextCenter();
        $('#select', view).setTextCenter();

    }


    /*
     UI Component
     1. create container and expose its id or class: id for single instance, class for otherwise
     2. create subElements, arrange their affiliation and append to container
     3. set style including:
     layout: size(width, height, border) and location(position, margin, padding...)
     appearance: background
     text: arrangement(line-height, text-align) and font...
     4. set behavior
     bind event handler
     5. append container to document and expose its id or class
     */







    showDialog();

//    createBox();
});