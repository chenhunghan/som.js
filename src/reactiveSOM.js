//Smaple Data
const entities = [
  [1, 1, 1],
  [0, 1, 2],
  [1, 2, 4],
  [0, 100, 200]
];

// Random SOMap
const SOMap = [
  [1, 1, 3],
  [0, 100, 220],
  [200, 1000, 1000],
  [100, 200, 400],
  [100, 200, 400],
  [100, 200, 400],
  [100, 200, 400],
  [100, 200, 400],
];

//First Input Entity
const entityIndex = 0;
const entity = entities[entityIndex];

//Find the winner unit of the Map
function arrayMin(arr) {
  let len = arr.length;
  let min = Infinity;
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

function findWinerMapUnit(SOMap, inputEntity) {
  const distanceCollection = SOMap.map(mapUnit => euclideanDistance(mapUnit, inputEntity));
  const index = arrayMinIndex(distanceCollection); // Winner unit's index, should be an intergar.
  return {
    index,
    value: SOMap[index],
  };
}

function getCoordiOn2DSOMap(array, widthOfSOMap) {
  if (!Number.isInteger(widthOfSOMap)) {
    throw new Error('coordination scaler: typeof dimension should be integer');
  }
  const arrayWithScaledDimension = array.map((value, index) => {
    const coordination = [
      index % widthOfSOMap,
      Math.floor(index / widthOfSOMap),
    ];
    return {
      value,
      coordination,
    };
  });
  return arrayWithScaledDimension
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
  return Math.hypot(...point1.map((point1Value, index) => point1Value - point2[index]));
  // above is the same as:
  // let sum = 0;
  // const length = point1.length; // or point2.length since they have the same dimension
  // for (let index = 0; index < length; index += 1) {
  //   sum += Math.pow(point1[index] - point2[index], 2);
  // }
  // return Math.sqrt(sum);
}

function learnOnce (entity, SOMap, widthOfSOMap, learningRadius) {
  const winner = findWinerMapUnit(SOMap, entity);
  //A function how to update map unit
  const winnerUpdateFunction = (winnerUnitValue, entityValue) => (winnerUnitValue + entityValue) / 2;
  //Start upadte the winner unit by the update function
  const winnerCoreUpdatedSOMap = SOMap.map((mapUnit, mapUnitIndex) => {
    if (mapUnitIndex !== winner.index) {
      return mapUnit;
    }
    const learnedMapUnit = mapUnit.map((value, index) => winnerUpdateFunction(value, entity[index]));
    return learnedMapUnit;
  });
  const winnerCoreUpdatedSOMapWithCoordinations = getCoordiOn2DSOMap(winnerCoreUpdatedSOMap, widthOfSOMap)
  const winnerWithCoordination = winnerCoreUpdatedSOMapWithCoordinations[winner.index];
  const neighborUpdateFunction = (neighborUnitValue, entityValue) => (neighborUnitValue + (entityValue / 2)) / 2;
  const winnerCoreNeighborhoodUpdatedWithCoordinationsSOMap = winnerCoreUpdatedSOMapWithCoordinations.map((mapUnitWithCoordination, mapUnitIndex) => {
    if (mapUnitIndex === winner.index) {
      return mapUnitWithCoordination;
    }
    if (euclideanDistance(mapUnitWithCoordination.coordination, winnerWithCoordination.coordination) < learningRadius) {
      const learnedMapUnit = {
        coordination: mapUnitWithCoordination.coordination,
        value: mapUnitWithCoordination.value.map((value, index) => neighborUpdateFunction(value, entity[index])),
      };
      return learnedMapUnit;
    }
    return mapUnitWithCoordination;
  });
  const winnerCoreNeighborhoodUpdatedSOMap = winnerCoreNeighborhoodUpdatedWithCoordinationsSOMap.map(unit => unit.value);
  return winnerCoreNeighborhoodUpdatedSOMap
}

function getTrainedSOMap (entities, SOMap, widthOfSOMap, learningRadius) {
  let map = SOMap
  for (let entity of entities) {
    map = learnOnce(entity, map, widthOfSOMap, learningRadius)
  }
  return map;
}

console.log(getTrainedSOMap(entities, SOMap, 3, 5))
