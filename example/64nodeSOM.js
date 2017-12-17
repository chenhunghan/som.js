'use strict';

const ndarray = require('ndarray');
const ops = require('ndarray-ops');
const cwise = require('cwise');
const show = require('ndarray-show');
const som = require('../dist/som.js')
const _ = require('underscore');

var modelNumber = 216,
    dimension = 4, //2 -> [x,y], 3 -> [x,y,z],
    M = ndarray(new Float32Array(modelNumber*dimension), [dimension, modelNumber]),
    sqrootM = Math.floor(Math.sqrt(modelNumber)),
    inputNumber = 20,
    inputVector = ndarray(new Float32Array(dimension*inputNumber), [dimension, inputNumber]),
    trainingTimes = 50;

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
var trainedMap = som(M, inputVector, trainingTimes, callback, 300000, 0.3, 3)
console.log(show(ndarray(new Float32Array(_.values(JSON.parse(trainedMap.get(trainedMap.size-1)))), [dimension, sqrootM, sqrootM])))
