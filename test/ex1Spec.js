/**
 Q = zeros(64,1); //quantization error
 for t = 1:1000000
    X = rand(1,2); % training input
    // Winner search
    for i = 1:64
        Q(i,1) = norm(X(t,:) - M(i,:));
    end
    [C,c] = min(Q);
**/

var jStat = require('jStat').jStat;
var ubique = require('ubique');
var _ = require('underscore');

var modelNumber = 64, dimension = 2;
var M = jStat.rand(modelNumber,dimension),
    //the SOM array.
    Q = jStat.zeros(modelNumber,1);
    //Quantization error, the norm of the difference of an input vector and the best-matching model.
for (t = 1; t<100; t++) {
    var inputVector = jStat.rand(1,dimension)[0]
    for (i = 1; i < modelNumber; i++) {
        var range = jStat([inputVector, M[i]]).range();
        Q[i][0] = jStat(range).norm();
    };
    winnerIndex = _.findIndex(Q, [jStat(Q).min(true)]);
    var denominator = (1 + t/300000),
        learningRate = (0.3/denominator),
        radius = Math.round(3/denominator),
        M = mutiReshape(M,8,8,2),
        X = mutiReshape(X,1,1,2);
        ch = ((winnerIndex-1) % 8) + 1
        cv = Math.floor((winnerIndex-1)/8+ 1);
        for (h = Math.min((ch+radius),8); h<Math.max((ch-radius),1); h++){
            for (v = Math.min((cv+radius),8); v < Math.max((cv-radius),1); v++){

            }
        }
}

//console.log(inputVector)
//console.log(Q);
//console.log([jStat(Q).min(true)])
//console.log(winnerIndex)
//console.log(A)

var matrix = jStat.rand(1,2);
console.log(mutiReshape(matrix,1,1,2))

function mutiReshape (matrix, rows, cols, slice) {
    var numbers = ubique.numel(matrix),
        colBycol = ubique.subsetlin(matrix,ubique.colon(0,numbers-1,1)),
        slicenumbers = numbers/slice,
        sliced = ubique.reshape([colBycol],slice,slicenumbers),
        reshaped = _.map(sliced, function(ele) {
            return ubique.reshape([ele], rows, cols);
        });
    return reshaped
};

/**
describe('example 1', function(){
    describe('', function(){
        it('should return -1 when the value is not present', function(){
            Q = math.eval('zeros(64, 1)');
        })
    })
})
**/