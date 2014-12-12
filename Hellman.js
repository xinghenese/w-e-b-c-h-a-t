/**
 * Created by Administrator on 2014/12/4.
 */
define(['Coder', "HttpRequestProxy", "ThreadProxy", 'Utils/CookieUtil', 'Logger/Logger'], function(Coder, HttpRequestProxy, ThreadProxy, CookieUtil, Logger){
    var PRIME = "171718397966129586011229151993178480901904202533705695869569760169920539808075437788747086722975900425740754301098468647941395164593810074170462799608062493021989285837416815548721035874378548121236050948528229416139585571568998066586304075565145536350296006867635076744949977849997684222020336013226588207303";
    var BASE = "2";
    var privateKey = "";
    var publicKey = "";
    var sharedKey = "";
    var thread;

//    for (var i = 0; i < 12; i++)
//    {
//        var randomVal = ~~(Math.random() * 1000000000);
//        privateKey = privateKey + randomVal;
//    }



    return {
        p: PRIME,
        g: BASE,
        priv: "1926877662633358844204024729202550362056900610652831479170955612156095738332170432108364352536733746571489",
        createPublicKey: function(){
//            return this.g.modPow(this.priv, this.p)
//            return this.g.modPow(this.priv, this.p)
        },
        getPublicKey: function(){
//            return this.createPublicKey();
            if(!publicKey){
                var _self = this;
                thread = ThreadProxy.createThread({
                    url: "BigInteger2.js",
                    task: "createHellmanKey",
                    arguments: {
                        prime: _self.p,
                        base: _self.g,
                        exp: _self.priv
                    },
                    handler: function(evt){
                        publicKey = Coder.encodeBase64(evt.data.remainder);//toByteArray
                        Logger.info("Prime", evt.data.prime);
                        Logger.info("Base", evt.data.base);
                        Logger.info("Exp", evt.data.exp);
                        Logger.info("Remainder", evt.data.remainder);
                        Logger.info("PublicKey", publicKey);
                        HttpRequestProxy.request({
                            urlPath: "user/prepare",
                            requestData: {
                                pkey: publicKey
                            },
                            onDataSuccess: function(data){
                                thread.reuse({
                                    arguments: {
                                        prime: _self.p,
                                        base: publicKey,
                                        exp: _self.priv
                                    },
                                    handler: function(evt){
                                        sharedKey = Coder.encodeBase64(evt.data.remainder);//toByteArray
                                        Logger.info("Prime", evt.data.prime);
                                        Logger.info("Base", evt.data.base);
                                        Logger.info("Exp", evt.data.exp);
                                        Logger.info("Remainder", evt.data.remainder);
                                        Logger.info("SharedKey", sharedKey);
                                        CookieUtil.setCookie("RCKey", sharedKey);
                                    }
                                });
                            }
                        });

                    }
                });
                thread.start();
            }
            return publicKey;
        },
        getShared: function(pub){
            if(!pub){
                return "";
            }
            if(!sharedKey){
                var _self = this;
                thread.reuse({
                    arguments: {
                        prime: _self.p,
                        base: pub,
                        exp: _self.priv,
                        task: "createHellmanKey"
                    },
                    handler: function(evt){
                        sharedKey = Coder.encodeBase64(evt.data.remainder);//toByteArray
                        Logger.info("Prime", evt.data.prime);
                        Logger.info("Base", evt.data.base);
                        Logger.info("Exp", evt.data.exp);
                        Logger.info("Remainder", evt.data.remainder);
                    }
                });
                thread.stop();
                //sharedKey = pub.modPow(this.priv, this.p);
            }
            return sharedKey;
        },
        getRCKey: function(pub){
            //var bitIntSecretKey = this.getShared(BigInteger(pub).abs());
            //var result = Coder.encodeBase64(bitIntSecretKey);//toByteArray
            //return
        },

        //TestBlock
        getP: function(){
            return this.p;
        },
        getG: function(){
            return this.g;
        }
        //
    }

});