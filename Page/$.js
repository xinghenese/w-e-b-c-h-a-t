/**
 * Created by Administrator on 2014/12/15.
 */
define(['../TypeCheck', 'DocumentFactory', 'TreeType', 'CSSUtil'], function(TypeCheck, DocumentFactory, TreeType, CSSUtil){
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

    function borderBoxModel(element){

    }



    HTMLElement.implementMethods({
        show: function(){
            this.style.display = "block";
        },
        hide: function(){
            this.style.display = "none";
        },
        borderBox: function(){
            var direction = ["Top", "Right", "Bottom", "Left"],
                messures = ["margin", "border", "padding"],
                _size = [this.getMessureDigits("width"), this.getMessureDigits("height")];
            for(var i = 0, ilen = direction.length; i < ilen; i++){
                for(var j = 0, jlen = messures.length; j < jlen; j++){
                    _size[$.isOdd(i)] -= this.getMessureDigits(messures[j] + direction[i]);
                }
            }
            this.style.width = _size[0] + "px";
            this.style.height = _size[1] + "px";
        },
        modifyStyle: function(fn){
            if(TypeCheck.isFunction(fn)){
                this.hide();
                fn();
                this.show();
            }
        },
        getParent: function(){
            return this.parentNode || this.parentElement();
        },
        getStyle: function(type){
            if(window.getComputedStyle){
                HTMLElement.prototype.getStyle = function(type){
                    return window.getComputedStyle(this, null).getPropertyValue(CSSUtil.cssFormat(type));
                };
            }
            else if(this.currentStyle){
                HTMLElement.prototype.getStyle = function(type){
                    return this.currentStyle[type];
                };
            }
            else {
                HTMLElement.prototype.getStyle = function(type){
                    return this.style[type];
                }
            }
            return this.getStyle(type);
        },
        getMessures: function(type){
            if(type = this.getStyle(type)){
                var arr = type.match(/([\d\.]+)(\D*)$/);
                return {
                    digit: arr[1],
                    unit: arr[2]
                }
            }
        },
        getMessureDigits: function(type){
            if(type = this.getStyle(type)){
                return parseFloat(type);
            }
            return 0;
        },
        setCenter: function(){
            var _style = this.style;
            if(_style.position == "static"){
                var _parent = this.getParent();
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
            return this;
        },
        setVerticalAlign: function(baseElement, direction){
            if(TypeCheck.isHTMLElement(baseElement)){
                direction = direction != "right";
                if(direction){
                    var margin = baseElement.style.marginLeft;
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
            this.style.lineHeight = this.style.height;
            return this;
        }
    });

    NodeList.implementMethods({
        setVerticalAlign: function(baseElement, direction){
            var _self = this, len = _self.length;
            if(TypeCheck.isHTMLElement(baseElement)){
                _self.each(function(){
                    this.setVerticalAlign(baseElement, direction);
                });
//                for(var i = 0; i < len; i ++){
//                    _self[i].setVerticalAlign(baseElement, direction);
//                }
            }
            else if(TypeCheck.isString(baseElement)){
                direction = baseElement;
                if(direction != "right"){
                    console.info("direction: " + direction);
                    var ibase = $.findMin(_self, function(i){
//                        console.info("marginLeft: " + _self[i].getMessureDigits("marginLeft"));
                        return _self[i].getMessureDigits("marginLeft");
                    });
                    console.info("ibase: " + ibase);
                }
                else{
                    ibase = $.findMax(_self, function(i){
                        return _self[i].getMessureDigits("marginLeft") + _self[i].getMessureDigits("width");
                    });
                }
                _self.each(function(){
                    this.setVerticalAlign(_self[ibase], direction);
                });
//                for(i = 0; i < len; i ++){
//                    _self[i].setVerticalAlign(_self[ibase], direction);
//                }
            }
            return _self;
        },
        setTextCenter: function(){
            this.each(function(){
                this.setTextCenter();
            });
//            for(var i = 0, len = this.length; i < len; i ++){
//                this[i].setTextCenter();
//            }
        }
    });

    return $;
});