import ndarray from "ndarray"
import ops from "ndarray-ops"
import cwise from "cwise"
import show from 'ndarray-show'

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
        this.remainder = args.modelNumber % this.sqrootM
        this.winnerY = (args.winnerIndex - this.winnerX)/this.sqrootM
        //console.log('model numbers ' + args.modelNumber)
        //console.log('sqt ' + this.sqrootM)
        //console.log('reminder ' + this.remainder)
        //console.log('winnerIndex ' + args.winnerIndex)
        //console.log([this.winnerX, this.winnerY])
    },
    args: ["index", "array", "array", "scalar"],
    body: function(i, ele, eleN, args) {
        //Element Index Calculation in "temp array", which is this.sqrootM * this.sqrootM.
        var tempArrayX = i[1] % this.sqrootM,
            tempArrayY = (i[1] - tempArrayX)/this.sqrootM,
            dist = Math.sqrt( Math.pow((tempArrayX-this.winnerX), 2) + Math.pow((tempArrayY-this.winnerY), 2) );
        //console.log('tempArrayX ' + tempArrayX)
        //console.log('tempArrayY ' + tempArrayY)
        //console.log('dist ' + dist)
        var dimensionalIndex = i[0],
            inputElement = args.inputElement.get(0,dimensionalIndex);
        if (dist <= args.learninglRadius && inputElement != undefined) {
            //console.log('dimensionalIndex ' + dimensionalIndex)
            //console.log('inputElement ' + inputElement)
            eleN = ele + args.learningRate * (inputElement - ele)
        }
    }
})

export function som (M, inputVector, trainingTimes, callback, denominator = 300000, Rate = 0.3 , Radius = 3) {

    let modelNumber = M.size
    let dimension =  M.dimension - 1
    let sqrootM = Math.floor(Math.sqrt(modelNumber))
    let Q = ndarray(new Float32Array(modelNumber), [1, modelNumber])
    let mapWithTimeLine = new Map()

    var inputLength = inputVector.shape[1]

    for(var eindex = 0; eindex < inputLength; eindex++) {
        var inputElement = inputVector.hi(dimension, eindex+1).lo(0, eindex)
        for (var t = 0; t < trainingTimes; t++) {
            let currentCycle = eindex*trainingTimes + t + 1
            //console.log(currentCycle)
            for (var i = 0; i < modelNumber; i++) {
                //line 1 -> m = M.hi(2,1).lo(0,0); line 2 -> m = M.hi(2,2).lo(0,1)
                var m = M.hi(dimension, i + 1).lo(0, i),
                    d = distance(m, inputElement);
                Q.set(0, i, d)
            }
            let winnerIndex = ops.argmin(Q)[1],
                denominatorWithTime = (1 + t /denominator),
                learningRate = (Rate / denominatorWithTime),
                learninglRadius = (Radius / denominatorWithTime),
                args = {
                    'modelNumber': modelNumber,
                    'winnerIndex': winnerIndex,
                    'learninglRadius': learninglRadius,
                    'denominator': denominatorWithTime,
                    'learningRate': learningRate,
                    'inputElement': inputElement,
                    'dimension': dimension,
                    'sqrootM': sqrootM
                }

            learn2D(M, M, args)
            var mapData = JSON.stringify(M.data)
            mapWithTimeLine.set(currentCycle, mapData)
            if (callback != undefined) {
                callback(mapData, currentCycle)
            }
        }

    }
    return mapWithTimeLine
}