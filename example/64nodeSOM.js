import ndarray from "ndarray"
import ops from "ndarray-ops"
import cwise from "cwise"
import show from 'ndarray-show'
import { som } from "../dist/som.js"

var modelNumber = 64,
    dimension = 1, //2 -> [x,y], 3 -> [x,y,z],
    M = ndarray(new Float32Array(modelNumber*dimension), [dimension, modelNumber]),
    sqrootM = Math.floor(Math.sqrt(modelNumber)),
    inputVector = ndarray(new Float32Array(dimension*modelNumber), [dimension, modelNumber]),
    trainingTimes = 40;

ops.random(inputVector)
ops.random(M)

//var som = new Som(M)

var a = []
function callback(currentmap, currentTime) {
    //console.log(currentTime)
    //a[currentTime] = JSON.stringify(currentmap.data)

    //console.log(show(ndarray(new Float32Array(currentmap.get(currentTime).data), [dimension, sqrootM, sqrootM])))
}

//console.log('---------- original Map')
//console.log('')
//console.log(show(ndarray(new Float32Array(M.data), [dimension, sqrootM, sqrootM])))
//console.log('---------- input')
//console.log('')
//console.log(show(ndarray(new Float32Array(M.data), [dimension, sqrootM, sqrootM])))
//console.log('---------- trained Map')
//console.log('')
var trainedMap = som(M, inputVector, trainingTimes, callback)
console.log(trainedMap.get(1))
console.log(trainedMap.get(trainedMap.size))
//console.log(trainedMap.length)
//console.log(trainedMap[1])
//console.log(trainedMap[100])
//console.log(show(ndarray(new Float32Array(trainedMap.data), [dimension, sqrootM, sqrootM])))
