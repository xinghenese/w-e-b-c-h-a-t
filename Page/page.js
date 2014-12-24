/**
 * Created by Administrator on 2014/12/15.
 */
require(['DocumentFactory', 'TreeType'], function(DocumentFactory, TreeType){
    var dialog;
    function showDialog(msg){
        if(!dialog){
            dialog = createMsgBox();
        }
    }

    function createBox(){
        var _doc = DocumentFactory.parseTree({
            div: {
                id: "container",
                div: {
                    id: "title"
                },
                div: {
                    id: "content"
                },
                div: {
                    id: "btnSend"
                }
            }
        }, TreeType.HTMLDocument);
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

    function createMsgBox(){
        var _doc = document;
        var msgbox = _doc.createElement("div");
        msgbox.style.cssText = "width: 466px; height: 245px; position: absolute; background-color: #FFFFFF;";
        setCenter(msgbox);
        var title = _doc.createElement("div");
        title.style.cssText = "width: 100%; height: 50px; background-color: #F8F8F4";
        var content = _doc.createElement("div");
        content.style.cssText = "width: 422px; height: 125px; margin: 22px; margin-bottom: 0;background-color: #F8F8F7";
//        var btnClose = _doc.createElement("div");
//        var btnConfirm = _doc.createElement("div");
//        var btnCancel = _doc.createElement("div");
        var btnSend = _doc.createElement("div");
        btnSend.style.cssText = "width: 82px; height: 30px; margin-top: 10px; background-color: #42D9C7";


        msgbox.appendChild(title);
        msgbox.appendChild(content);
        msgbox.appendChild(btnSend);

        setVerticalAlign([content, btnSend], "right");

        _doc.body.appendChild(msgbox);
        return msgbox;
    }

    function createConatiner(){

    }

    function setStyle(cssText){

    }

    function isArray(array){
        return Object.prototype.toString.call(array) == "[object Array]";
    }

    function findMax(array, prop, elementOrValue){
        var _max = 0, _i_max = 0, len = array.length, _value;
        for(var i = 0; i < len; i++){
            if((_value = prop && prop(i) || array[i]) >= _max){
                _i_max = i;
                _max = _value;
            }
        }
        return elementOrValue ? _max : _i_max;
    }

    function setVerticalAlign(arrElement, direction){
        if(arrElement && isArray(arrElement)){
            direction = direction != "right";
            var len = arrElement.length,
                max = findMax(arrElement, function(i){
                    return parseInt(arrElement[i].style.marginLeft) + (direction ? 0 : parseInt(arrElement[i].style.width));
                }, true);
            for(var i = 0; i < len; i++){
                arrElement[i].style.marginLeft = max - (direction ? 0 : parseInt(arrElement[i].style.width)) + "px";
            }
        }
    }

    function setCenter(element){
        var _style = element.style;
        if(_style){
            if(_style.position == "static"){
                var _parent = element.parentNode || element.parentElement();
                _style.margin = "auto";
                _style.marginTop = (parseInt(_parent.style.height) - parseInt(_style.height))/2 + "px";
            }
            else{
                var _width = parseInt(_style.width);
                var _height = parseInt(_style.height);
                _style.left = "50%";
                _style.top = "50%";
                _style.marginLeft = -_width/2 + "px";
                _style.marginTop = -_height/2 + "px";
            }
        }
    }



    function bindEventHandler(){

    }

    showDialog();

    createBox();
});