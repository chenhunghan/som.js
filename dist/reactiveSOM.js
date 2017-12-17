'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var entities = [[1, 1, 1], [0, 1, 2], [1, 2, 4], [0, 100, 200]];
var SOMap = [[1, 1, 3], [0, 100, 220], [200, 1000, 1000], [100, 200, 400]];

var entityIndex = 0;

var entity = entities[entityIndex];
var winner = findWinerMapUnit(SOMap, entity);
var winnerUpdateFunction = function winnerUpdateFunction(winnerUnitValue, entityValue) {
  return (winnerUnitValue + entityValue) / 2;
};
var winnerCoreUpdatedSOMap = SOMap.map(function (mapUnit, mapUnitIndex) {
  if (mapUnitIndex !== winner.index) {
    return mapUnit;
  }
  var learnedMapUnit = mapUnit.map(function (value, index) {
    return winnerUpdateFunction(value, entity[index]);
  });
  return learnedMapUnit;
});

/*
  One map unit(the "winner") in SOMap has been updated.
*/

console.log(winnerCoreUpdatedSOMap);

/*
  Enhance SOMap with added coordinations to help find and update neighborhood around the winner map unit.
*/

var winnerCoreUpdatedSOMapWithCoordinations = winnerCoreUpdatedSOMap.map(function (mapUnit, mapUnitIndex) {
  var value = mapUnit;
  return {
    value: value,
    coordination: [mapUnitIndex, mapUnitIndex]
  };
});
var winnerWithCoordination = winnerCoreUpdatedSOMapWithCoordinations[winner.index];
var neighborUpdateFunction = function neighborUpdateFunction(neighborUnitValue, entityValue) {
  return (neighborUnitValue + entityValue / 2) / 2;
};
var winnerCoreNeighborhoodUpdatedWithCoordinationsSOMap = winnerCoreUpdatedSOMapWithCoordinations.map(function (mapUnitWithCoordination, mapUnitIndex) {
  if (mapUnitIndex === winner.index) {
    return mapUnitWithCoordination;
  }
  if (euclideanDistance(mapUnitWithCoordination.coordination, winnerWithCoordination.coordination) < 100) {
    var learnedMapUnit = {
      coordination: mapUnitWithCoordination.coordination,
      value: mapUnitWithCoordination.value.map(function (value, index) {
        return neighborUpdateFunction(value, entity[index]);
      })
    };
    return learnedMapUnit;
  }
  return mapUnitWithCoordination;
});

var winnerCoreNeighborhoodUpdatedSOMap = winnerCoreNeighborhoodUpdatedWithCoordinationsSOMap.map(function (unit) {
  return unit.value;
});

console.log(winnerCoreNeighborhoodUpdatedSOMap);

function findWinerMapUnit(somap, inputEntity) {
  var distanceCollection = somap.map(function (mapUnit) {
    return euclideanDistance(mapUnit, inputEntity);
  });
  var index = arrayMinIndex(distanceCollection); // Winner unit's index, should be an intergar.
  return {
    index: index,
    value: somap[index]
  };
}

function euclideanDistance(point1, point2) {
  if (!Array.isArray(point1)) {
    throw new Error('euclidean distance algorithm: input points one is not an Array');
  }
  if (!Array.isArray(point2)) {
    throw new Error('euclidean distance algorithm: input points two is not an Array');
  }
  if (point1.length !== point2.length) {
    throw new Error('euclidean distance algorithm: two input points has differnt dimension.');
  }
  return Math.hypot.apply(Math, _toConsumableArray(point1.map(function (point1Value, index) {
    return point1Value - point2[index];
  })));
  // above is the same as:
  // let sum = 0;
  // const length = point1.length; // or point2.length since they have the same dimension
  // for (let index = 0; index < length; index += 1) {
  //   sum += Math.pow(point1[index] - point2[index], 2);
  // }
  // return Math.sqrt(sum);
}

function arrayMin(arr) {
  var len = arr.length;
  var min = Infinity;
  while (len >= 0) {
    len -= 1;
    if (arr[len] < min) {
      min = arr[len];
    }
  }
  return min;
}

function arrayMinIndex(arr) {
  return arr.indexOf(arrayMin(arr));
}

// function arrayMax(arr) {
//   let len = arr.length;
//   let max = -Infinity;
//   while (len >= 0) {
//     len -= 1;
//     if (arr[len] > max) {
//       max = arr[len];
//     }
//   }
//   return max;
// }

function coordinationScaler(array, dimension) {
  if (!Number.isInteger(dimension)) {
    throw new Error('coordination scaler: typeof dimension should be integer');
  }
  var rootByDimesion = Math.pow(array.length, 1 / dimension);
  var lineBreakValue = Math.floor(rootByDimesion);
  var arrayWithScaledDimension = array.map(function (value, index) {
    var coordination = [index % lineBreakValue, Math.floor(index / lineBreakValue)];
    return {
      value: value,
      coordination: coordination
    };
  });
  console.log(lineBreakValue);
  console.log(arrayWithScaledDimension);
}
coordinationScaler([1, 4, 3, 1, 3, 4], 2);