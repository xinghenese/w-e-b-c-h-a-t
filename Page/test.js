/**
 * Created by Administrator on 2014/12/24.
 */
define('TypeCheck',[],function(){
    var toString = {}.toString;
    return {
        isExist: function(variable){
            if(typeof variable == "undefined"){
                try{
                    if(variable == null){
                        return "not set";
                    }
                }
                catch(err){
                    return "not defined";
                }
            }
            else{
                return "set";
            }
// return typeof variable == "undefined";
        },
        isNumber: function(num){
            return num === +num && isFinite(num);
        },
        likeNumber: function(num){
            return num == +num;
        },
        isString: function(str){
            return typeof str == "string";
        },
        isFunction: function(fn){
            return typeof fn == "function";
        },
        isObject: function(obj){
            return toString.call(obj) == "[object Object]";
        },
        isArray: function(arr){
            return toString.call(arr) == "[object Array]";
        },
        likeArray: function(list){
            return typeof list.length == "number";
        },
        isXMLDocument: function(xml){
            return toString.call(xml) == "[object XMLDocument]";
        },
        isXMLElement: function(element){
            return toString.call(element) == "[object Element]";
        },
        isHTMLDocument: function(doc){
            return toString.call(doc) == "[object HTMLDocument]";
        },
        isHTMLElement: function(element){
            return toString.call(element).search(/^\[object HTML.*Element\]$/) != -1;
        },
        isNodeList: function(nodeList){
            return toString.call(nodeList) == "[object NodeList]";
        }
    }
});
/**
 * Created by Administrator on 2014/12/15.
 */
define('TreeType',[],function(){
    return{
        Object: 1,
        Wrapper: 2,
        XMLDocument: 3,
        HTMLDocument: 4
    };
});
/**
 * Created by Administrator on 2014/12/15.
 */
define('CSSUtil',['TypeCheck'], function(TypeCheck){
    return {
        cssFormat: function(input){
            return input.replace(/([A-Z])/g, function(){
                var _s1;
                if(_s1 = RegExp.$1){
                    return '-' + _s1.toLowerCase();
                }
            });
        },
        classify: function(obj){
            if(TypeCheck.isObject(obj)){

            }
        },
        toCSSText: function(obj){
            var result = "";
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    result += this.cssFormat(key) + ":" + obj[key] + ";";
                }
            }
            console.info("result: " + result);
            return result;
        }
    };
});
/**
 * Created by Administrator on 2014/12/3.
 */
define('Base',['TreeType', 'TypeCheck', 'CSSUtil'], function(TreeType, TypeCheck, CSSUtil){

    Object.prototype.basicClone = function () {
        var _copy = new this.constructor;
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if(!TypeCheck.isFunction(this[prop])){
                    _copy[prop] = this[prop];
                }
            }
        }
        return  _copy;
    };

    Object.prototype.addProperty = function (key, value) {
        if (typeof(this[key]) == "undefined") {
            this[key] = value;
        }
        return this;
    };

    Object.prototype.addPropFromTemplate = function (objTemplate) {
        for (var prop in objTemplate) {
            if (objTemplate.hasOwnProperty(prop)) {
                this[prop] = objTemplate[prop];
            }
        }
        return this;
    };

    Object.prototype.clearProperties = function () {
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if(TypeCheck.isFunction(this[prop])) {
                    this[prop] = null;
                }
                else if(!TypeCheck.isObject(this[prop])) {
                    delete prop;
                }
                else{
                    this[prop].clearProperties();
                }
            }
        }
    };

    Object.prototype.superMethod = function(name, args){
        var func = (this.constructor.getAdapter())[name] || (this.constructor.prototype)[name];
        if(TypeCheck.isFunction(func)){
            func.apply(this, args);
        }
        return this;
    };

    Object.prototype.each = function(fn, args){
        if(TypeCheck.likeArray(this)){
            for(var i  = 0, len = this.length; i < len; i++){
                fn.apply(this[i], args);
            }
        }
        return this;
    };

    Function.prototype.method = function (type, func) {
        if (!this.prototype[type]) {
            this.prototype[type] = func;
        }
        return this;
    };

    Function.prototype.superMethod = function(name){
        return (this.getAdapter() || this.prototype)[name];
    };

    Function.prototype.implementMethods = function (funcObj) {
        for (var key in funcObj) {
            if (funcObj.hasOwnProperty(key) && TypeCheck.isFunction(funcObj[key])) {
                this.prototype[key] = funcObj[key];
            }
        }
    };

    Function.prototype.inherits = function (protoObj, fConstructor) {
        if(TypeCheck.isObject(protoObj)){
            this.prototype = protoObj;
            this.prototype.constructor = fConstructor || this;
        }
        else if(TypeCheck.isFunction(protoObj)){
            this.prototype = new protoObj();
            this.prototype.constructor = fConstructor || protoObj || this;
        }
        return this;
    };

    Function.prototype.staticMethod = function (type, func) {
        if (!this[type]) {
            this[type] = func;
        }
        return this;
    };

    /*
         Interface Tree{
             getTreeType();
             getRoot();
         }
         Interface Node{
             checkSubNodes();
             getSubNodeByKey(key);
             parseAttributes(targetNode, mapConversion);
             copyAttributes(key, value);
             createAndAppendChild(tag, tree, mapConversion);
         }
     */

    Object.implementMethods({
        getTreeType: function(){
            return TreeType.Object;
        },
        getRoot: function(){
            return this;
        }
    });

    Object.implementMethods({
        checkSubNodes: function(){
            var _self = this;
            var _hasChild = false;
            var _subNodeKeys = [_self];
            for(var key in _self){
                if(_self.hasOwnProperty(key)){
                    if(_self[key]){
                        if(TypeCheck.isArray(_self[key])){
                            var _len = _self[key].length;
                            for(var i = 0; i < _len; i++){
                                _subNodeKeys.push(key + "-" + i);
                            }
                            _hasChild = true;
                        }
                        else if(TypeCheck.isObject(_self[key])){
                            if(key == "style"){
                                console.info("style: ");
                                _self[key] = CSSUtil.toCSSText(_self[key]);
                                console.info(_self[key]);
                            }
                            else{
                                _subNodeKeys.push(key);
                                _hasChild = true;
                            }
                        }
                        else if(key == "text"){
                            _subNodeKeys.push(key + '-' + _self[key]);
                            _hasChild = true;
                        }
                    }
                }
            }
            return _hasChild ? _subNodeKeys : null;
        },
        getSubNodeByKey: function(key){
            //key = (mapConversion && mapConversion[key]) || key;
            var _info = key.split('-'),
                _key = _info[0],
                _index = _info[1];
            if(TypeCheck.likeNumber(_index)){
                return this[_key][_index];
            }
            return this[_key];
        },
        parseAttributes: function(targetNode, mapConversion){
            var _self = this;
            for(var key in _self){
                if(_self.hasOwnProperty(key)){
                    var _value = _self[key];
                    if(!TypeCheck.isFunction(_value) && !TypeCheck.isObject(_value) && !TypeCheck.isArray(_value)){
                        key = (mapConversion && mapConversion[key]) || key;
                        targetNode.copyAttributes(key, _value);
                    }
                }
            }
        },
        copyAttributes: function(key, value){
            this[key] = value;
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var _self = this;
            tag = (mapConversion && mapConversion[tag]) || tag;
            _self[tag] = {};
            return _self[tag];
        }
    });

    Document.implementMethods({
        getTreeType: function(){
            return TreeType.XMLDocument;
        },
        getRoot: function(){
            return this.documentElement;
        }
    });

    HTMLDocument.implementMethods({
        getTreeType: function(){
            return TreeType.HTMLDocument;
        },
        getRoot: function(){
            return document.createElement("div");
        }
    });

    Element.implementMethods({
        checkSubNodes: function(){
            var _self = this;
            var _subNodeKeys = [_self];
            if(_self.hasChildNodes()){
                var _len = _self.childNodes.length;
                for(var i = 0; i < _len; i++){
                    _subNodeKeys.push(i);
                }
                return _subNodeKeys;
            }
            return null;
        },
        getSubNodeByKey: function(key){
            return this.childNodes[key];
        },
        parseAttributes: function(targetNode, toType, mapConversion){
            if(this.hasAttributes()){
                var _attrs = this.attributes, i = 0;
                do{
                    var _key = (mapConversion && mapConversion[_attrs[i].name]) || _attrs[i].name;
                    targetNode.copyAttributes(_key, _attrs[i].value);
                }while(typeof(_attrs[++i]) != "undefined");
            }
        },
        copyAttributes: function(key, value){
            if(key !== "text"){
                this.setAttribute(key, value);
            }
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            return this.appendChild(tree.createElement(tag));
        }
    });

    HTMLElement.implementMethods({
        getSubNodeByKey: function(key){
            //key = (mapConversion && mapConversion[key]) || key;
            console.info("subRoot_id: " + this.id);
            if(key != "text"){
                var _info = key.split('-'),
                    _key = _info[0],
                    _index = _info[1];
                console.info("_key: " + _key);
                console.info("_index: " + _index);
                if(!_key && typeof _index !== "undefined"){
                    console.info("(key, value):  (" + key + ", " + this[_key][_index] + ")");
                    return this[_key][_index];
                }
            }
            return this[_key];
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            if(tag == "text"){
                return this.appendChild(tree.createTextNode(arr[1] || ""));
            }
            return this.appendChild(tree.createElement(tag));
        }
    });

    Document.prototype.simpleParse = function(){
        return this.documentElement.parseAttributes();
    };

});
/**
 * Created by Administrator on 2014/12/3.
 */
define('DocumentFactory',['Base', 'TreeType'], function(Base, TreeType){
    var DocumentFactory = {
        createDocument: function(root){
            if (window.ActiveXObject){
                var _versions = ["MSXML2.HTMLDocument.6.0", "MSXML2.HTMLDocument.3.0", "MSXML2.HTMLDocument"];
                var _versionString;
                var _len = _versions.length;
                for(var i = 0; i < _len; i++){
                    try{
                        new ActiveXObject(_versions[i]);
                        _versionString = _versions[i];
                    }
                    catch(e){}
                }
                this.createDocument = function(root){
                    var _doc = new ActiveXObject(_versionString);
                    _doc.loadXML("<" + root + "/>");
                    return _doc;
                };
//                xmlObject.async = "false";
//                xmlObject.loadXML(xmlstring);
            }
            else{
                this.createDocument = function(root){
                    return document.implementation.createDocument("", root, null);
                };
            }
            return this.createDocument(root);
        },
        parseFromString: function(strXml, objDoc){
            if (window.ActiveXObject){
                this.parseFromString = function(strXml, objDoc){
                    var _doc = objDoc || this.createDocument();
                    _doc.loadXML(strXml);
                    return _doc;
                };
            }
            else{
                this.parseFromString = function(strXml, objDoc){
                    var _doc = objDoc || this.createDocument();
                    _doc = (new DOMParser()).parseFromString(strXml, "text/xml");
                    return _doc;
                };
            }
            return this.parseFromString(strXml, objDoc);
        },
        parseXMLToString: function(xmlDoc){
            if(window.ActiveXObject){
                this.parseXMLToString = function(xmlDoc){
                    return xmlDoc.xml;
                }
            }
            else{
                this.parseXMLToString = function(xmlDoc){
                    return (new XMLSerializer()).serializeToString(xmlDoc);
                }
            }
            return this.parseXMLToString(xmlDoc);
        },

        parseTree: function(sourceTree, toType, mapConversion){    //initRoot: get the rootNode of the document
            var _sourceNode, _sourceRoot, _sourceRootsInfo = [], _length = 0;
            var _targetNode, _targetRoot, _targetRootsInfo = [], _resultTree;
            //check
            if(!sourceTree.getTreeType || !sourceTree.getTreeType() || sourceTree.getTreeType() == toType){
                console.log("check");
                return sourceTree;
            }
            while(_length > 0 || _initializing()){
                var _rootInfo = _sourceRootsInfo[_length - 1];
                var _sourceNodeKey = _rootInfo[1];
                if(typeof(_sourceNodeKey) != "undefined"){
                    _sourceNode = _rootInfo[0].getSubNodeByKey(_sourceNodeKey); //key is used to search a node
                    var _targetNodeName = _sourceNode.tagName || _sourceNodeKey;    //name is used to create a node
                    _targetNode = _targetRootsInfo[_length - 1].createAndAppendChild(_targetNodeName, _resultTree, mapConversion);
                    var _sourceNodeInfo = _sourceNode.checkSubNodes();  //check whether the sourceNode is a subRoot.
                    _sourceNode.parseAttributes(_targetNode, mapConversion);
                    if(_sourceNodeInfo){
                        _sourceRootsInfo.push(_sourceNodeInfo);
                        _targetRootsInfo.push(_targetNode);
                        _length ++;
                        _targetNode = _targetNode.getSubNodeByKey(_targetNodeName);//getSubObjectByNodeName(_targetNode, _sourceNode.getName());
                    }
                    else{
                        _rootInfo.splice(1, 1);//_rootInfo: [_slef, key1, key2, key3...]
                    }
                }
                else{
                    _sourceRootsInfo.pop();
                    _targetRootsInfo.pop();
                    _length --;
                    if(_length > 0){
                        _rootInfo = _sourceRootsInfo[_length - 1];
                        _rootInfo.splice(1, 1);
                        _targetNode = _targetRootsInfo[_length - 1];
                    }
                }
            }
            if(_resultTree.getTreeType() == TreeType.HTMLDocument){
                if(_targetRoot){
                    return document.body.appendChild(_targetRoot);
                }
            }
            return _resultTree;

            function _initializing(){
                _sourceRoot = sourceTree.getRoot();
                _sourceNode = _sourceRoot;

                _resultTree = _createEmptyTree(_sourceRoot, toType, mapConversion);
                _targetRoot = _resultTree.getRoot();
                _targetNode = _targetRoot;

                var _sourceNodeInfo = _sourceNode.checkSubNodes();

                _sourceNode.parseAttributes(_targetNode, mapConversion);

                if(_sourceNodeInfo){
                    _sourceRootsInfo.push(_sourceNodeInfo);
                    _targetRootsInfo.push(_targetNode);
                    _length ++;
                    _initializing = function(){return false;};
                    return true;
                }
                return false;
            }
            function _createEmptyTree(sourceRoot, toType, mapConversion){
                var _name = sourceRoot.tagName || (sourceRoot.getName && sourceRoot.getName()) || "ROOT";
                _name = (mapConversion && mapConversion[_name]) || _name;
//                console.log("_name: " + _name);
//                console.log("ClassMap[_name]: " + ClassMap[_name]);
                switch(toType){
                    case TreeType.XMLDocument:
                        return DocumentFactory.createDocument(_name);
                    case TreeType.HTMLDocument:
                        return document;
//                    case TypeMap.Wrapper:
//                        return (ClassMap[_name] && ClassMap[_name].createInstance()) || {};
                    case TreeType.Object:
                        return {};
                }
            }
        }
    };
    return DocumentFactory;
});
/**
 * Created by Administrator on 2014/12/15.
 */
define('$',['TypeCheck', 'DocumentFactory', 'TreeType', 'CSSUtil'], function(TypeCheck, DocumentFactory, TreeType, CSSUtil){
    var slice = [].slice, concat = [].concat;

    Object.prototype.each = function(fn, args){
        if(TypeCheck.likeArray(this)){
            for(var i  = 0, len = this.length; i < len; i++){
                fn.apply(this[i], args);
            }
        }
        return this;
    };

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

    $.isOdd = function(num){
        return num & 1;
    };

    $.each = function(obj, fn, args){
        obj.each(fn, args);
        return obj;
    };

    $.createPanel = function(obj, mapConversion){
        if(TypeCheck.isObject(obj)){
            return DocumentFactory.parseTree(obj, TreeType.HTMLDocument, mapConversion);
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

    $.findMax = function(array, fn){
        return find(array, fn, 1)
    };

    $.findMin = function(array, fn){
        return find(array, fn, -1)
    };

    HTMLElement.implementMethods({
        getParent: function(){
            return this.parentNode || this.parentElement();
        },
        getStyle: function(type){
            if(window.getComputedStyle){
                HTMLElement.prototype.getStyle = function(type){
//                    console.info("ComputedStyle: " + type);
                    return window.getComputedStyle(this, null).getPropertyValue(CSSUtil.cssFormat(type));
                };
            }
            else if(this.currentStyle){
                HTMLElement.prototype.getStyle = function(type){
//                    console.info("CurrentStyle: " + type);
                    return this.currentStyle[type];
                };
            }
            else {
                HTMLElement.prototype.getStyle = function(type){
//                    console.info("Style: " + type);
                    return this.style[type];
                }
            }
            return this.getStyle(type);
        },
        getMessures: function(type){
            if(type = this.getStyle(type)){
                var arr = type.match(/(\d+)\.*\d*(\D*)$/);
                return {
                    digit: arr[1],
                    unit: arr[2]
                }
            }
        },
        getMessureDigits: function(type){
            if(type = this.getStyle(type)){
                return parseInt(type);
            }
            return 0;
        },
        show: function(){
            this.style.display = "block";
        },
        hide: function(){
            this.style.display = "none";
        },
        borderBox: function(){
            var direction = ["Top", "Right", "Bottom", "Left"],
                messures = ["margin", "border", "padding"],
                _size = [this.getMessureDigits("height"), this.getMessureDigits("width")];
            console.info("origin_width: " + _size[1]);
            console.info("origin_height: " + _size[0]);
            for(var i = 0, ilen = direction.length; i < ilen; i++){
                for(var j = 0, tmp = _size[$.isOdd(i)], jlen = messures.length; j < jlen; j++){
                    tmp -= this.getMessureDigits(messures[j] + direction[i]);
                    console.log(messures[j] + direction[i] + ": " + this.getMessureDigits(messures[j] + direction[i]));
                    console.log("tmp: " + tmp);
                }
                _size[$.isOdd(i)] = tmp;
            }
            console.info("_height: " + _size[0]);
            console.info("_width: " + _size[1]);
            this.style.height = _size[0] + "px";
            this.style.width = _size[1] + "px";
        },
        modifyStyle: function(fn, args){
            if(TypeCheck.isFunction(fn)){
                this.hide();
//                this[fn]();
                fn(args);
                this.show();
            }
        },
        setCenter: function(){
            var _style = this.style, _parent = this.getParent();
            if(_style.position == "static"){
                _style.margin = "auto";
                _style.marginTop = (_parent.getMessureDigits("width") - _parent.getMessureDigits("height"))/2 + "px";
            }
            else{
                _style.left = _parent.getMessureDigits("width")/2 + "px";
                _style.top = _parent.getMessureDigits("height")/2 + "px";
                _style.marginLeft = -parseInt(this.getMessureDigits("width"))/2 + "px";
                _style.marginTop = -parseInt(this.getMessureDigits("height"))/2 + "px";
            }
            return this;
        },
        setVerticalAlign: function(baseElement, direction){
            if(TypeCheck.isHTMLElement(baseElement)){
                direction = direction != "right";
                if(direction){
                    var margin = baseElement.getMessureDigits("marginLeft");
                }
                else{
                    margin = baseElement.getMessureDigits("marginLeft") + baseElement.getMessureDigits("width") -
                        (margin = this.getMessures("width")).digit + margin.unit;
                }
                this.style.marginLeft = margin;
            }
            return this;
        },
        setTextCenter: function(){
            this.style.textAlign = "center";
            this.style.lineHeight = this.getMessureDigits("height") + "px";
            return this;
        }
    });

    NodeList.implementMethods({
        show: function(){
            return this.each(function(){
                this.show();
            })
        },
        hide: function(){
            return this.each(function(){
                this.hide();
            })
        },
        setVerticalAlign: function(baseElement, direction){
            console.info("NodeList.setVerticalAlign");
            var _self = this, len = _self.length;
            if(TypeCheck.isString(baseElement)){
                direction = baseElement;
                if (direction != "right") {
//                    console.info("direction: " + direction);
                    var ibase = $.findMin(_self, function (i) {
//                        console.info("marginLeft: " + _self[i].getMessureDigits("marginLeft"));
                        return _self[i].getMessureDigits("marginLeft");
                    });
                    console.info("ibase: " + ibase);
                }
                else {
                    ibase = $.findMax(_self, function (i) {
                        return _self[i].getMessureDigits("marginLeft") + _self[i].getMessureDigits("width");
                    });
                }
                baseElement = _self[ibase];
            }
            return _self.each(function(){
                this.setVerticalAlign(baseElement, direction);
            });
        },
        setTextCenter: function(){
            return this.each(function(){
                this.setTextCenter();
            });
        },
        borderBox: function(){
            return this.each(function(){
                this.borderBox();
            });
        },
        float: function(){
            return this.each(function(){
                this.style.display = "inline-block";
            });
        }
    });



    return $;
});
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
define("main", function(){});

