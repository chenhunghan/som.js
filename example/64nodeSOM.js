import ndarray from "ndarray"
import ops from "ndarray-ops"
import cwise from "cwise"
import show from 'ndarray-show'
import { som } from "../dist/som.js"
import _ from "underscore"

var modelNumber = 64,
    dimension = 1, //2 -> [x,y], 3 -> [x,y,z],
    M = ndarray(new Float32Array(modelNumber*dimension), [dimension, modelNumber]),
    sqrootM = Math.floor(Math.sqrt(modelNumber)),
    inputNumber = 1000,
    inputVector = ndarray(new Float32Array(dimension*inputNumber), [dimension, inputNumber]),
    trainingTimes = 10;

ops.random(inputVector)
ops.random(M)

//var som = new Som(M)
function callback(currentmap, currentTime) {
    //console.log(currentTime)
    //a[currentTime] = JSON.stringify(currentmap.data)
    //console.log(show(ndarray(new Float32Array(currentmap.get(currentTime).data), [dimension, sqrootM, sqrootM])))
}

console.log('---------- original Map')
console.log('')
console.log(show(ndarray(new Float32Array(M.data), [dimension, sqrootM, sqrootM])))
//console.log('---------- input')
//console.log('')
//console.log(show(ndarray(new Float32Array(M.data), [dimension, sqrootM, sqrootM])))
console.log('---------- trained Map')
console.log('')
var trainedMap = som(M, inputVector, trainingTimes, callback)
console.log(show(ndarray(new Float32Array(_.values(JSON.parse(trainedMap.get(trainedMap.size-1)))), [dimension, sqrootM, sqrootM])))