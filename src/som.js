import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import cwise from 'cwise';

const distance = cwise({
  args: ['array', 'array'],
  pre: function defineD() {
    this.d = 0;
  },
  body: function calD(a1, a2) {
    this.d = this.d + Math.abs((a1 - a2) * (a1 - a2));
  },
  post: function retrunSqrtD() {
    return Math.sqrt(this.d);
  },
});

const learn2D = cwise({
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
    const tempArrayX = i[1] % this.sqrootM;
    const tempArrayY = (i[1] - tempArrayX) / this.sqrootM;
    const dist = Math.sqrt(Math.pow((tempArrayX - this.winnerX), 2) + Math.pow((tempArrayY - this.winnerY), 2));
    // console.log('tempArrayX ' + tempArrayX)
    // console.log('tempArrayY ' + tempArrayY)
    // console.log('dist ' + dist)
    const dimensionalIndex = i[0];
    const inputElement = args.inputElement.get(0, dimensionalIndex);
    if (dist <= args.learninglRadius && inputElement !== undefined) {
        // console.log('dimensionalIndex ' + dimensionalIndex)
        // console.log('inputElement ' + inputElement)
      eleN = ele + (args.learningRate * (inputElement - ele));
    }
  },
});

function som(M, inputVector, trainingTimes, callback, denominator = 300000, Rate = 0.3, Radius = 3) {
  const modelNumber = M.size;
  const dimension = M.dimension - 1;
  const sqrootM = Math.floor(Math.sqrt(modelNumber));
  const Q = ndarray(new Float32Array(modelNumber), [1, modelNumber]);
  const mapWithTimeLine = new Map();

  const inputLength = inputVector.shape[1];

  for (let eindex = 0; eindex < inputLength; eindex += 1) {
    const inputElement = inputVector.hi(dimension, eindex + 1).lo(0, eindex);
    for (let t = 0; t < trainingTimes; t += 1) {
      const currentCycle = (eindex * trainingTimes) + t + 1;
      // console.log(currentCycle)
      for (let i = 0; i < modelNumber; i += 1) {
        // line 1 -> m = M.hi(2,1).lo(0,0); line 2 -> m = M.hi(2,2).lo(0,1)
        const m = M.hi(dimension, i + 1).lo(0, i);
        const d = distance(m, inputElement);
        Q.set(0, i, d);
      }
      const winnerIndex = ops.argmin(Q)[1];
      const denominatorWithTime = 1 + (t / denominator);
      const learningRate = (Rate / denominatorWithTime);
      const learninglRadius = (Radius / denominatorWithTime);
      const args = {
        modelNumber,
        winnerIndex,
        learninglRadius,
        denominator: denominatorWithTime,
        learningRate,
        inputElement,
        dimension,
        sqrootM,
      };
      learn2D(M, M, args);
      const mapData = JSON.stringify(M.data);
      mapWithTimeLine.set(currentCycle, mapData);
      if (callback !== undefined) {
        callback(mapData, currentCycle);
      }
    }
  }
  return mapWithTimeLine;
}

module.exports = som;
