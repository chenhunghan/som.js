//import ndarray from "ndarray";
//import show from 'ndarray-show'
//import ops from "ndarray-ops"
//import cwise from "cwise"

var ndarray = require("ndarray")
var show =  require('ndarray-show')
var ops = require('ndarray-ops')
var cwise = require('cwise')

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
            var dimensionalIndex = i[0],
                inputElement = args.inputElement.get(0,dimensionalIndex);
            eleN = ele + args.learningRate * (inputElement - ele)
        }
    }
})

module.exports = {

    learn: function (M, inputVector, trainingTimes) {

        var modelNumber = M.size //64
        var dimension =  M.dimension - 1 //1
        var sqrootM = Math.floor(Math.sqrt(modelNumber)) //8
        var inputLength = inputVector.size //64
        var Q = ndarray(new Float32Array(modelNumber), [1, modelNumber])

        for(var eindex = 0; eindex < inputLength; eindex++) {
            var inputElement = inputVector.hi(dimension, eindex+1).lo(0, eindex)
            for (var t = 1; t < trainingTimes; t++) {
                for (var i = 0; i < modelNumber; i++) {
                    //line 1 -> m = M.hi(2,1).lo(0,0); line 2 -> m = M.hi(2,2).lo(0,1)
                    var m = M.hi(dimension, i + 1).lo(0, i),
                        d = distance(m, inputElement);
                    Q.set(0, i, d)
                }
                var winnerIndex = ops.argmin(Q)[1],
                    denominator = (1 + t / 300000),
                    learningRate = (0.3 / denominator),
                    learninglRadius = (3 / denominator),
                    args = {
                        'modelNumber': modelNumber,
                        'winnerIndex': winnerIndex,
                        'learninglRadius': learninglRadius,
                        'denominator': denominator,
                        'learningRate': learningRate,
                        'inputElement': inputElement,
                        'dimension': dimension,
                        'sqrootM': sqrootM
                    },
                    newM = M;
                learn2D(M, newM, args)
                M = newM
            }

        }

        return M
    }
}



