/**
 * Created by chenh on 26/07/15.
 */

var jStat = require('jStat').jStat;
var ubique = require('ubique');
var _ = require('underscore');

var ndarray = require("ndarray");
var show = require('ndarray-show');
var ops = require("ndarray-ops");
var cwise = require("cwise");

var modelNumber = 64,
    dimension = 2 //2 -> [x,y], 3 -> [x,y,z]

function isInt(n) {
    return n % 1 === 0;
}
function random (low, high) {
    return Math.random() * (high - low) + low;
}

if( isInt(modelNumber/dimension) != true){
    console.warn('modelNumber/dimension is not a integer')
}

//replace M = jStat.rand(modelNumber, dimension)
var modelRaw = new Array(modelNumber);
for (var i = 0; i < modelRaw.length; i++) {
    modelRaw[i] = random(0,1)
}
var M = ndarray(new Float32Array(modelRaw), [dimension, Math.floor(modelNumber/dimension)])

//replace Q = jStat.zeros(modelNumber, 1);
var Q = ndarray(new Float32Array(modelNumber), [1, modelNumber])

//console.log(show(M))

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

var inputVector = ndarray(new Float32Array(dimension), [dimension, 1])
ops.random(inputVector)
//console.log(show(inputVector));

var a = ndarray(new Float32Array([0,0,0,0]), [4,1])
var b = ndarray(new Float32Array([3,4,0,1000]), [4,1])

console.log(distance(a, b))

//for (t = 1; t < 100; t++) {
//    var inputVector = jStat.rand(1, dimension)[0];
//    for (i = 1; i < modelNumber; i++) {
//        var range = jStat([inputVector, M[i]]).range();
//        Q[i][0] = jStat(range).norm();
//    }
//    winnerIndex = _.findIndex(Q, [jStat(Q).min(true)]);
//    var denominator = (1 + t / 300000),
//        learningRate = (0.3 / denominator),
//        radius = Math.round(3 / denominator),
//    //reshapedM = mutiReshape(M,8,8,2),
//    //reshapedInputVector = mutiReshape(inputVector,1,1,2);
//        ch = ((winnerIndex - 1) % 8) + 1;
//        cv = Math.floor((winnerIndex - 1) / 8 + 1);
//    for (h = Math.min((ch + radius), 8); h < Math.max((ch - radius), 1); h++) {
//        for (v = Math.min((cv + radius), 8); v < Math.max((cv - radius), 1); v++) {
//        }
//    }
//}
