var ndarray = require("ndarray");
var show = require('ndarray-show');
var ops = require("ndarray-ops");
var cwise = require("cwise");

var modelNumber = 64,
    dimension = 1, //2 -> [x,y], 3 -> [x,y,z],
    M = ndarray(new Float32Array(modelNumber*dimension), [dimension, modelNumber]),
    sqrootM = Math.floor(Math.sqrt(modelNumber)),
    Q = ndarray(new Float32Array(modelNumber), [1, modelNumber]),
    trainingTimes = 2000,
    inputLength = 64,
    inputVector = ndarray(new Float32Array(dimension*inputLength), [dimension, inputLength])

ops.random(inputVector)
ops.random(M)

console.log('---------- original Map')
console.log('')
console.log(show(ndarray(new Float32Array(M.data), [sqrootM, sqrootM, dimension])))
console.log('---------- input')
console.log('')
console.log(show(ndarray(new Float32Array(inputVector.data), [sqrootM, sqrootM, dimension])))


var distance = cwise({
    args: ["array", "array"],
    pre: function(shape) {
        this.d = 0
    },
    body: function(a1, a2) {
        this.d = this.d + Math.abs((a1-a2)*(a1-a2))
    },
    post: function() {
        return Math.sqrt(this.d)
    }
})

var learn2D = cwise({
    pre: function(i, ele, eleN, args) {
        this.sqrootM = args.sqrootM
        //Winner Index Calculation in "temp array", which is this.sqrootM * this.sqrootM.
        this.winnerX = args.winnerIndex % this.sqrootM
        this.winnerY = (args.winnerIndex - this.winnerX)/this.sqrootM
    },
    args: ["index", "array", "array", "scalar"],
    body: function(i, ele, eleN, args) {
        //Element Index Calculation in "temp array", which is this.sqrootM * this.sqrootM.
        var tempArrayX = i[1] % this.sqrootM,
            tempArrayY = (i[1] - tempArrayX)/this.sqrootM,
            dist = Math.sqrt( Math.pow((tempArrayX-this.winnerX), 2) + Math.pow((tempArrayY-this.winnerY), 2) );
        if (dist <= args.learninglRadius) {
            var dimensionalIndex = i[0]
            var inputElement = args.inputElement.get(0,dimensionalIndex);
            eleN = ele + args.learningRate * (inputElement - ele)
        }
    }
})

for(eindex = 0; eindex < inputLength; eindex++) {
    var inputElement = inputVector.hi(dimension, eindex+1).lo(0, eindex)
    for (t = 1; t < trainingTimes; t++) {
        for (i = 0; i < modelNumber; i++) {
            //line 1 -> m = M.hi(2,1).lo(0,0); line 2 -> m = M.hi(2,2).lo(0,1)
            m = M.hi(dimension, i + 1).lo(0, i)
            d = distance(m, inputElement)
            Q.set(0, i, d)
        }
        winnerIndex = ops.argmin(Q)[1]
        var denominator = (1 + t / 300000),
            learningRate = (0.3 / denominator),
            learninglRadius = (3 / denominator);
        var args = {
            'modelNumber': modelNumber,
            'winnerIndex': winnerIndex,
            'learninglRadius': learninglRadius,
            'denominator': denominator,
            'learningRate': learningRate,
            'inputElement': inputElement,
            'dimension': dimension,
            'sqrootM': sqrootM
        }
        newM = M
        learn2D(M, newM, args)
        M = newM
    }

}

console.log('---------- trained Map')
console.log('')
console.log(show(ndarray(new Float32Array(M.data), [sqrootM, sqrootM, dimension])))