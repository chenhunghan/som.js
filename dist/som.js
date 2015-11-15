"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.som = som;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ndarray = require("ndarray");

var _ndarray2 = _interopRequireDefault(_ndarray);

var _ndarrayOps = require("ndarray-ops");

var _ndarrayOps2 = _interopRequireDefault(_ndarrayOps);

var _cwise = require("cwise");

var _cwise2 = _interopRequireDefault(_cwise);

var _ndarrayShow = require('ndarray-show');

var _ndarrayShow2 = _interopRequireDefault(_ndarrayShow);

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
        this.remainder = args.modelNumber % this.sqrootM;
        this.winnerY = (args.winnerIndex - this.winnerX) / this.sqrootM;
        //console.log('model numbers ' + args.modelNumber)
        //console.log('sqt ' + this.sqrootM)
        //console.log('reminder ' + this.remainder)
        //console.log('winnerIndex ' + args.winnerIndex)
        //console.log([this.winnerX, this.winnerY])
    },
    args: ["index", "array", "array", "scalar"],
    body: function body(i, ele, eleN, args) {
        //Element Index Calculation in "temp array", which is this.sqrootM * this.sqrootM.
        var tempArrayX = i[1] % this.sqrootM,
            tempArrayY = (i[1] - tempArrayX) / this.sqrootM,
            dist = Math.sqrt(Math.pow(tempArrayX - this.winnerX, 2) + Math.pow(tempArrayY - this.winnerY, 2));
        //console.log('tempArrayX ' + tempArrayX)
        //console.log('tempArrayY ' + tempArrayY)
        //console.log('dist ' + dist)
        var dimensionalIndex = i[0],
            inputElement = args.inputElement.get(0, dimensionalIndex);
        if (dist <= args.learninglRadius && inputElement != undefined) {
            //console.log('dimensionalIndex ' + dimensionalIndex)
            //console.log('inputElement ' + inputElement)
            eleN = ele + args.learningRate * (inputElement - ele);
        }
    }
});

function som(M, inputVector, trainingTimes, callback) {
    var denominator = arguments.length <= 4 || arguments[4] === undefined ? 300000 : arguments[4];
    var Rate = arguments.length <= 5 || arguments[5] === undefined ? 0.3 : arguments[5];
    var Radius = arguments.length <= 6 || arguments[6] === undefined ? 3 : arguments[6];

    var modelNumber = M.size;
    var dimension = M.dimension - 1;
    var sqrootM = Math.floor(Math.sqrt(modelNumber));
    var Q = (0, _ndarray2["default"])(new Float32Array(modelNumber), [1, modelNumber]);
    var mapWithTimeLine = new Map();

    var inputLength = inputVector.shape[1];

    for (var eindex = 0; eindex < inputLength; eindex++) {
        var inputElement = inputVector.hi(dimension, eindex + 1).lo(0, eindex);
        for (var t = 0; t < trainingTimes; t++) {
            var currentCycle = eindex * trainingTimes + t + 1;
            //console.log(currentCycle)
            for (var i = 0; i < modelNumber; i++) {
                //line 1 -> m = M.hi(2,1).lo(0,0); line 2 -> m = M.hi(2,2).lo(0,1)
                var m = M.hi(dimension, i + 1).lo(0, i),
                    d = distance(m, inputElement);
                Q.set(0, i, d);
            }
            var winnerIndex = _ndarrayOps2["default"].argmin(Q)[1],
                denominatorWithTime = 1 + t / denominator,
                learningRate = Rate / denominatorWithTime,
                learninglRadius = Radius / denominatorWithTime,
                args = {
                'modelNumber': modelNumber,
                'winnerIndex': winnerIndex,
                'learninglRadius': learninglRadius,
                'denominator': denominatorWithTime,
                'learningRate': learningRate,
                'inputElement': inputElement,
                'dimension': dimension,
                'sqrootM': sqrootM
            };

            learn2D(M, M, args);
            var mapData = JSON.stringify(M.data);
            mapWithTimeLine.set(currentCycle, mapData);
            if (callback != undefined) {
                callback(mapData, currentCycle);
            }
        }
    }
    return mapWithTimeLine;
}