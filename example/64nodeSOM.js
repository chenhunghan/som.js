import ndarray from "ndarray"
import ops from "ndarray-ops"
import cwise from "cwise"
import show from 'ndarray-show'
import Som from "../dist/som.js"

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
console.log(show(ndarray(new Float32Array(M.data), [dimension, sqrootM, sqrootM])))
console.log('---------- input')
console.log('')
console.log(show(ndarray(new Float32Array(M.data), [dimension, sqrootM, sqrootM])))
console.log('---------- trained Map')
console.log('')
var trainedMap = som.learn(inputVector, trainingTimes)
console.log(show(ndarray(new Float32Array(trainedMap.data), [dimension, sqrootM, sqrootM])))
