import ndarray from "ndarray"
import ops from "ndarray-ops"
import cwise from "cwise"
import show from 'ndarray-show'
import Som from "../dist/som.js"

<<<<<<< HEAD
var modelNumber = 16,
    dimension = 2, //2 -> [x,y], 3 -> [x,y,z],
=======
var modelNumber = 64,
<<<<<<< HEAD
    dimension = 4, //2 -> [x,y], 3 -> [x,y,z],
>>>>>>> modify demo a little bit
=======
    dimension = 1, //2 -> [x,y], 3 -> [x,y,z],
>>>>>>> some bad changes
    M = ndarray(new Float32Array(modelNumber*dimension), [dimension, modelNumber]),
    sqrootM = Math.floor(Math.sqrt(modelNumber)),
    inputVector = ndarray(new Float32Array(dimension*modelNumber), [dimension, modelNumber]),
    trainingTimes = 20;

ops.random(inputVector)
ops.random(M)

var som = new Som(M)

console.log('---------- original Map')
console.log('')
<<<<<<< HEAD
console.log(show(ndarray(new Float32Array(M.data), [dimension, sqrootM, sqrootM])))
console.log('---------- input')
console.log('')
console.log(show(ndarray(new Float32Array(inputVector.data), [dimension, sqrootM, sqrootM])))
=======
console.log(show(ndarray(new Float32Array(M.data), [sqrootM, sqrootM, dimension])))

//console.log('---------- input')
//console.log('')
//console.log(show(ndarray(new Float32Array(inputVector.data), [sqrootM, sqrootM, dimension])))

M = som.learn(M, inputVector, trainingTimes)

>>>>>>> modify demo a little bit
console.log('---------- trained Map')
console.log('')
var trainedMap = som.learn(inputVector, trainingTimes)
console.log(show(ndarray(new Float32Array(trainedMap.data), [dimension, sqrootM, sqrootM])))
