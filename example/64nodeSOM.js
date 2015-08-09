var ndarray = require("ndarray")
var ops = require("ndarray-ops")
var show =  require('ndarray-show')
var som = require("../src/som.js")

var modelNumber = 64,
    dimension = 1, //2 -> [x,y], 3 -> [x,y,z],
    M = ndarray(new Float32Array(modelNumber*dimension), [dimension, modelNumber]),
    sqrootM = Math.floor(Math.sqrt(modelNumber)),
    trainingTimes = 20,
    inputLength = 64,
    inputVector = ndarray(new Float32Array(dimension*inputLength), [dimension, inputLength]);

ops.random(inputVector)
ops.random(M)

console.log('---------- original Map')
console.log('')
console.log(show(ndarray(new Float32Array(M.data), [sqrootM, sqrootM, dimension])))
console.log('---------- input')
console.log('')
console.log(show(ndarray(new Float32Array(inputVector.data), [sqrootM, sqrootM, dimension])))

M = som.learn(M, inputVector, trainingTimes)

console.log('---------- trained Map')
console.log('')
console.log(show(ndarray(new Float32Array(M.data), [sqrootM, sqrootM, dimension])))