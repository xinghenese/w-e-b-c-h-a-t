/**
 * Created by Administrator on 2014/12/15.
 */
define(['TypeCheck', 'DocumentFactory', 'TreeType', 'CSSUtil', 'Layout'], function(TypeCheck, DocumentFactory, TreeType, CSSUtil, Layout){
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

//    HTMLElement.implementMethods({
//        getParent: function(){
//            return this.parentNode || this.parentElement();
//        },
//        getStyle: function(type){
//            if(window.getComputedStyle){
//                HTMLElement.prototype.getStyle = function(type){
////                    console.info("ComputedStyle: " + type);
//                    return window.getComputedStyle(this, null).getPropertyValue(CSSUtil.cssFormat(type));
//                };
//            }
//            else if(this.currentStyle){
//                HTMLElement.prototype.getStyle = function(type){
////                    console.info("CurrentStyle: " + type);
//                    return this.currentStyle[type];
//                };
//            }
//            else {
//                HTMLElement.prototype.getStyle = function(type){
////                    console.info("Style: " + type);
//                    return this.style[type];
//                }
//            }
//            return this.getStyle(type);
//        },
//        getMessures: function(type){
//            if(type = this.getStyle(type)){
//                var arr = type.match(/(\d+)\.*\d*(\D*)$/);
//                return {
//                    digit: arr[1],
//                    unit: arr[2]
//                }
//            }
//        },
//        getMessureDigits: function(type){
//            if(type = this.getStyle(type)){
//                return parseInt(type);
//            }
//            return 0;
//        },
//        show: function(){
//            this.style.display = "block";
//        },
//        hide: function(){
//            this.style.display = "none";
//        },
//        borderBox: function(){
//            var direction = ["Top", "Right", "Bottom", "Left"],
//                messures = ["margin", "border", "padding"],
//                _size = [this.getMessureDigits("height"), this.getMessureDigits("width")];
//            console.info("origin_width: " + _size[1]);
//            console.info("origin_height: " + _size[0]);
//            for(var i = 0, ilen = direction.length; i < ilen; i++){
//                for(var j = 0, tmp = _size[$.isOdd(i)], jlen = messures.length; j < jlen; j++){
//                    tmp -= this.getMessureDigits(messures[j] + direction[i]);
//                    console.log(messures[j] + direction[i] + ": " + this.getMessureDigits(messures[j] + direction[i]));
//                    console.log("tmp: " + tmp);
//                }
//                _size[$.isOdd(i)] = tmp;
//            }
//            console.info("_height: " + _size[0]);
//            console.info("_width: " + _size[1]);
//            this.style.height = _size[0] + "px";
//            this.style.width = _size[1] + "px";
//        },
//        modifyStyle: function(fn, args){
//            if(TypeCheck.isFunction(fn)){
//                this.hide();
////                this[fn]();
//                fn(args);
//                this.show();
//            }
//        },
//        setCenter: function(){
//            var _style = this.style, _parent = this.getParent();
//            if(_style.position == "static"){
//                _style.margin = "auto";
//                _style.marginTop = (_parent.getMessureDigits("width") - _parent.getMessureDigits("height"))/2 + "px";
//            }
//            else{
//                _style.left = _parent.getMessureDigits("width")/2 + "px";
//                _style.top = _parent.getMessureDigits("height")/2 + "px";
//                _style.marginLeft = -parseInt(this.getMessureDigits("width"))/2 + "px";
//                _style.marginTop = -parseInt(this.getMessureDigits("height"))/2 + "px";
//            }
//            return this;
//        },
//        setVerticalAlign: function(baseElement, direction){
//            if(TypeCheck.isHTMLElement(baseElement)){
//                direction = direction != "right";
//                if(direction){
//                    var margin = baseElement.getMessureDigits("marginLeft");
//                }
//                else{
//                    margin = baseElement.getMessureDigits("marginLeft") + baseElement.getMessureDigits("width") -
//                        (margin = this.getMessures("width")).digit + margin.unit;
//                }
//                this.style.marginLeft = margin;
//            }
//            return this;
//        },
//        setTextCenter: function(){
//            this.style.textAlign = "center";
//            this.style.lineHeight = this.getMessureDigits("height") + "px";
//            return this;
//        }
//    });
//
//    NodeList.implementMethods({
//        show: function(){
//            return this.each(function(){
//                this.show();
//            })
//        },
//        hide: function(){
//            return this.each(function(){
//                this.hide();
//            })
//        },
//        setVerticalAlign: function(baseElement, direction){
//            console.info("NodeList.setVerticalAlign");
//            var _self = this, len = _self.length;
//            if(TypeCheck.isString(baseElement)){
//                direction = baseElement;
//                if (direction != "right") {
////                    console.info("direction: " + direction);
//                    var ibase = $.findMin(_self, function (i) {
////                        console.info("marginLeft: " + _self[i].getMessureDigits("marginLeft"));
//                        return _self[i].getMessureDigits("marginLeft");
//                    });
//                    console.info("ibase: " + ibase);
//                }
//                else {
//                    ibase = $.findMax(_self, function (i) {
//                        return _self[i].getMessureDigits("marginLeft") + _self[i].getMessureDigits("width");
//                    });
//                }
//                baseElement = _self[ibase];
//            }
//            return _self.each(function(){
//                this.setVerticalAlign(baseElement, direction);
//            });
//        },
//        setTextCenter: function(){
//            return this.each(function(){
//                this.setTextCenter();
//            });
//        },
//        borderBox: function(){
//            return this.each(function(){
//                this.borderBox();
//            });
//        },
//        float: function(){
//            return this.each(function(){
//                this.style.display = "inline-block";
//            });
//        }
//    });



    return $;
});