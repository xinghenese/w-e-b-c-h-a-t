/**
 * Created by Administrator on 2014/12/29.
 */
define(['Base', 'TypeCheckExtender', 'TreeType', 'CSSUtil'], function(Base, TypeCheck, TreeType, CSSUtil){
    /*
     Interface Tree{
         getTreeType();
         getRoot();
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


    /*
     Interface Node{
         checkSubNodes();
         getSubNodeByKey(key);
         parseAttributes(targetNode, mapConversion);
         copyAttributes(key, value);
         createAndAppendChild(tag, tree, mapConversion);
     }
     */
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
                                _self[key] = CSSUtil.toCSSText(_self[key]);
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
                    if(!TypeCheck.isFunction(_value) && !TypeCheck.isObject(_value)  && !TypeCheck.isArray(_value)){
                        key = (mapConversion && mapConversion[key]) || key;
                        targetNode.copyAttributes(key, _value);
                    }
                }
            }
        },
        copyAttributes: function(key, value){
            this[key] = ClassMap[value] ? {} : value;
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var _self = this;
            tag = (mapConversion && mapConversion[tag]) || tag;
            _self[tag] = {};
            return _self[tag];
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
                }while(!TypeCheck.isUndefined(_attrs[++i]));
            }
        },
        copyAttributes: function(key, value){
            if(key !== "text"){
                this.setAttribute(key, (ClassMap[value] ? "" : value));
            }
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            return this.appendChild(tree.createElement(tag));
        }
    });

    HTMLElement.implementMethods({
        createAndAppendChild: function(tag, tree, mapConversion){
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            if(tag == "text"){
                return this.appendChild(tree.createTextNode(arr[1] || ""));
            }
            return this.appendChild(tree.createElement(tag));
        }
    });

    /*
    Invoke this method When the document has only one childnode, which results in heigher performance as
    useless steps omitted.
     */
    Document.prototype.simpleParse = function(){
        return this.documentElement.parseAttributes();
    };

});