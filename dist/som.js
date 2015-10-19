"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ndarray = require("ndarray");

var _ndarray2 = _interopRequireDefault(_ndarray);

var _ndarrayOps = require("ndarray-ops");

var _ndarrayOps2 = _interopRequireDefault(_ndarrayOps);

var _cwise = require("cwise");

var _cwise2 = _interopRequireDefault(_cwise);

var distance = (0, _cwise2["default"])({
    args: ["array", "array"],
    pre: function pre(shape) {
        this.d = 0;
    },
    body: function body(a1, a2) {
        this.d = this.d + Math.abs((a1 - a2) * (a1 - a2));
    },
    post: function post() {
        return Math.sqrt(this.d);
    }
});

var learn2D = (0, _cwise2["default"])({
    pre: function pre(i, ele, eleN, args) {
        this.sqrootM = args.sqrootM;
        //Winner Index Calculation in "temp array", which is this.sqrootM * this.sqrootM.
        this.winnerX = args.winnerIndex % this.sqrootM;
        this.winnerY = (args.winnerIndex - this.winnerX) / this.sqrootM;
    },
    args: ["index", "array", "array", "scalar"],
    body: function body(i, ele, eleN, args) {
        //Element Index Calculation in "temp array", which is this.sqrootM * this.sqrootM.
        var tempArrayX = i[1] % this.sqrootM,
            tempArrayY = (i[1] - tempArrayX) / this.sqrootM,
            dist = Math.sqrt(Math.pow(tempArrayX - this.winnerX, 2) + Math.pow(tempArrayY - this.winnerY, 2));
        if (dist <= args.learninglRadius) {
            var dimensionalIndex = i[0],
                inputElement = args.inputElement.get(0, dimensionalIndex);
            eleN = ele + args.learningRate * (inputElement - ele);
        }
    }
});

var Som = (function () {
    function Som(M) {
        _classCallCheck(this, Som);

        this.M = M;
        this.modelNumber = M.size;
        this.dimension = M.dimension - 1;
        this.sqrootM = Math.floor(Math.sqrt(this.modelNumber));
        this.Q = (0, _ndarray2["default"])(new Float32Array(this.modelNumber), [1, this.modelNumber]);
    }

    _createClass(Som, [{
        key: "learn",
        value: function learn(inputVector, trainingTimes, callback) {
            var inputLength = inputVector.size;

            for (var eindex = 0; eindex < inputLength; eindex++) {
                var inputElement = inputVector.hi(this.dimension, eindex + 1).lo(0, eindex);
                for (var t = 1; t < trainingTimes; t++) {
                    for (var i = 0; i < this.modelNumber; i++) {
                        //line 1 -> m = M.hi(2,1).lo(0,0); line 2 -> m = M.hi(2,2).lo(0,1)
                        var m = this.M.hi(this.dimension, i + 1).lo(0, i),
                            d = distance(m, inputElement);
                        this.Q.set(0, i, d);
                    }
                    var winnerIndex = _ndarrayOps2["default"].argmin(this.Q)[1],
                        denominator = 1 + t / 300000,
                        learningRate = 0.3 / denominator,
                        learninglRadius = 3 / denominator,
                        args = {
                        'modelNumber': this.modelNumber,
                        'winnerIndex': winnerIndex,
                        'learninglRadius': learninglRadius,
                        'denominator': denominator,
                        'learningRate': learningRate,
                        'inputElement': inputElement,
                        'dimension': this.dimension,
                        'sqrootM': this.sqrootM
                    },
                        newM = this.M; //set newM as same as M
                    learn2D(this.M, newM, args);
                    this.M = newM;
                    if (callback != undefined) {
                        time = t + 1;
                        callback(newM, time);
                    }
                }
            }
            return this.M;
        }
    }]);

    return Som;
})();

exports["default"] = Som;
module.exports = exports["default"];