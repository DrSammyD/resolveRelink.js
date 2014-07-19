(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['lodash'], factory);
    } else {
        factory(_);
    }
})(function (_) {
    var opts = {
        refProp: '$ref',
        idProp: '$id',
        clone: true
    };
    _.mixin({
        relink: function (obj, optsParam) {
            var options = optsParam !== undefined ? optsParam : {};
            _.defaults(options, _.relink.prototype.opts);
            obj = options.clone ? _.clone(obj, true) : obj;
            var ids = {};
            var refs = [];
            function rl(s) {
                // we care naught about primitives
                if (!_.isObject(s)) {
                    return s;
                }
                if (s[options.refProp]) {
                    return null;
                }
                if (s[options.idProp] === 0 || s[options.idProp]) {
                    ids[s[options.idProp]] = s;
                }
                delete s[options.idProp];
                _(s).pairs().each(function (pair) {
                    if (pair[1]) {
                        s[pair[0]] = rl(pair[1]);
                        if (s[pair[0]] === null) {
                            if (pair[1][options.refProp] !== undefined) {
                                refs.push({ 'parent': s, 'prop': pair[0], 'ref': pair[1][options.refProp] });
                            }
                        }
                    }
                });

                return s;
            }
            var partialLink;
            if(_.isArray(obj)){
                partialLink = _(obj).map(function(arrObj){
                    if(arrObj[options.idProp]||arrObj[options.refProp])
                        return rl(arrObj);
                    return (arrObj);
                }).value();
            }else{
                partialLink =obj;
                if(obj[options.idProp]||obj[options.refProp])
                    partialLink = rl(obj);
            }
            _(refs).each(function (recordedRef) {
                recordedRef['parent'][recordedRef['prop']] = ids[recordedRef['ref']] || {};
            });
            return partialLink;
        },
        resolve: function (obj, optsParam) {
            var options = optsParam !== undefined ? optsParam : {};
            _.defaults(options, _.resolve.prototype.opts);
            obj = options.clone ? _.clone(obj, true) : obj;
            var objs = [{}];

            function rs(s) {
                // we care naught about primitives
                if (!_.isObject(s) || s[options.refProp]) {
                    return s;
                }
                var replacementObj = {};

                if (objs.indexOf(s) != -1) {
                    replacementObj[options.refProp] = objs.indexOf(s).toString();
                    return replacementObj;
                }
                objs.push(s);
                s[options.idProp] = objs.indexOf(s).toString();
                _(s).pairs().each(function (pair) {
                    s[pair[0]] = rs(pair[1]);
                });
                delete replacementObj[options.idProp];
                return s;
            }

            if(_.isArray(obj)){
                return _(obj).map(function(arrObj){
                    return rs(arrObj);
                }).value()
            }else{
                return rs(obj);
            }
        }
    });
    _(_.resolve.prototype).assign({ opts: opts });
    _(_.relink.prototype).assign({ opts: opts });
});