import ndarray from "ndarray"
import ops from "ndarray-ops"
import cwise from "cwise"

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

export default class Som {

    constructor( M ) {
        this.M = M
        this.modelNumber = M.size
        this.dimension =  M.dimension - 1
        this.sqrootM = Math.floor(Math.sqrt(this.modelNumber))
        this.Q = ndarray(new Float32Array(this.modelNumber), [1, this.modelNumber])
    }

    learn(inputVector, trainingTimes) {
        var inputLength = inputVector.size

        for(var eindex = 0; eindex < inputLength; eindex++) {
            var inputElement = inputVector.hi(this.dimension, eindex+1).lo(0, eindex)
            for (var t = 1; t < trainingTimes; t++) {
                for (var i = 0; i < this.modelNumber; i++) {
                    //line 1 -> m = M.hi(2,1).lo(0,0); line 2 -> m = M.hi(2,2).lo(0,1)
                    var m = this.M.hi(this.dimension, i + 1).lo(0, i),
                        d = distance(m, inputElement);
                    this.Q.set(0, i, d)
                }
                var winnerIndex = ops.argmin(this.Q)[1],
                    denominator = (1 + t / 300000),
                    learningRate = (0.3 / denominator),
                    learninglRadius = (3 / denominator),
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
                learn2D(this.M, newM, args)
                this.M = newM
            }

        }
        return this.M
    }
}