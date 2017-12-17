'use strict';

var _ndarray = require('ndarray');

var _ndarray2 = _interopRequireDefault(_ndarray);

var _ndarrayOps = require('ndarray-ops');

var _ndarrayOps2 = _interopRequireDefault(_ndarrayOps);

var _cwise = require('cwise');

var _cwise2 = _interopRequireDefault(_cwise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var distance = (0, _cwise2.default)({
  args: ['array', 'array'],
  pre: function defineD() {
    this.d = 0;
  },
  body: function calD(a1, a2) {
    this.d = this.d + Math.abs((a1 - a2) * (a1 - a2));
  },
  post: function retrunSqrtD() {
    return Math.sqrt(this.d);
  }
});

var learn2D = (0, _cwise2.default)({
  pre: function defineVar(i, ele, eleN, args) {
    this.sqrootM = args.sqrootM;
    // Winner Index Calculation in 'temp array', which is this.sqrootM * this.sqrootM.
    this.winnerX = args.winnerIndex % this.sqrootM;
    this.remainder = args.modelNumber % this.sqrootM;
    this.winnerY = (args.winnerIndex - this.winnerX) / this.sqrootM;
    // console.log('model numbers ' + args.modelNumber)
    // console.log('sqt ' + this.sqrootM)
    // console.log('reminder ' + this.remainder)
    // console.log('winnerIndex ' + args.winnerIndex)
    // console.log([this.winnerX, this.winnerY])
  },
  args: ['index', 'array', 'array', 'scalar'],
  body: function learn(i, ele, eleN, args) {
    // Element Index Calculation in 'temp array', which is this.sqrootM * this.sqrootM.
    var tempArrayX = i[1] % this.sqrootM;
    var tempArrayY = (i[1] - tempArrayX) / this.sqrootM;
    var dist = Math.sqrt(Math.pow(tempArrayX - this.winnerX, 2) + Math.pow(tempArrayY - this.winnerY, 2));
    // console.log('tempArrayX ' + tempArrayX)
    // console.log('tempArrayY ' + tempArrayY)
    // console.log('dist ' + dist)
    var dimensionalIndex = i[0];
    var inputElement = args.inputElement.get(0, dimensionalIndex);
    if (dist <= args.learninglRadius && inputElement !== undefined) {
      // console.log('dimensionalIndex ' + dimensionalIndex)
      // console.log('inputElement ' + inputElement)
      eleN = ele + args.learningRate * (inputElement - ele);
    }
  }
});

function som(M, inputVector, trainingTimes, callback) {
  var denominator = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300000;
  var Rate = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.3;
  var Radius = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 3;

  var modelNumber = M.size;
  var dimension = M.dimension - 1;
  var sqrootM = Math.floor(Math.sqrt(modelNumber));
  var Q = (0, _ndarray2.default)(new Float32Array(modelNumber), [1, modelNumber]);
  var mapWithTimeLine = new Map();

  var inputLength = inputVector.shape[1];

  for (var eindex = 0; eindex < inputLength; eindex += 1) {
    var inputElement = inputVector.hi(dimension, eindex + 1).lo(0, eindex);
    for (var t = 0; t < trainingTimes; t += 1) {
      var currentCycle = eindex * trainingTimes + t + 1;
      // console.log(currentCycle)
      for (var i = 0; i < modelNumber; i += 1) {
        // line 1 -> m = M.hi(2,1).lo(0,0); line 2 -> m = M.hi(2,2).lo(0,1)
        var m = M.hi(dimension, i + 1).lo(0, i);
        var d = distance(m, inputElement);
        Q.set(0, i, d);
      }
      var winnerIndex = _ndarrayOps2.default.argmin(Q)[1];
      var denominatorWithTime = 1 + t / denominator;
      var learningRate = Rate / denominatorWithTime;
      var learninglRadius = Radius / denominatorWithTime;
      var args = {
        modelNumber: modelNumber,
        winnerIndex: winnerIndex,
        learninglRadius: learninglRadius,
        denominator: denominatorWithTime,
        learningRate: learningRate,
        inputElement: inputElement,
        dimension: dimension,
        sqrootM: sqrootM
      };
      learn2D(M, M, args);
      var mapData = JSON.stringify(M.data);
      mapWithTimeLine.set(currentCycle, mapData);
      if (callback !== undefined) {
        callback(mapData, currentCycle);
      }
    }
  }
  return mapWithTimeLine;
}

module.exports = som;