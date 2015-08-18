var ndarray = require("ndarray")
var ops = require("ndarray-ops")
var show =  require('ndarray-show')
var Som = require("../dist/som.js")

var modelNumber = 16,
    dimension = 1, //2 -> [x,y], 3 -> [x,y,z],
    M = ndarray(new Float32Array(modelNumber*dimension), [dimension, modelNumber]),

    sqrootM = Math.floor(Math.sqrt(modelNumber)),
    inputVector = ndarray(new Float32Array(dimension*modelNumber), [dimension, modelNumber]),
    trainingTimes = 20;

ops.random(inputVector)
ops.random(M)

var som = new Som(M)

console.log('---------- original Map')
console.log('')
console.log(show(ndarray(new Float32Array(M.data), [sqrootM, sqrootM, dimension])))
console.log('---------- input')
console.log('')
console.log(show(ndarray(new Float32Array(inputVector.data), [sqrootM, sqrootM, dimension])))
console.log('---------- trained Map')
console.log('')
//var trainedMap = som.learn(inputVector, trainingTimes)
//console.log(show(ndarray(new Float32Array(trainedMap.data), [sqrootM, sqrootM, dimension])))