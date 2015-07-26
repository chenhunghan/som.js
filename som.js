var jStat = require('jStat').jStat;
var ubique = require('ubique');
var _ = require('underscore');

/**
 Q = zeros(64,1);           %quantization error
 for t = 1:1000000
 X = rand(1,2);          % training input
 for i = 1:64            % Winner search
 Q(i,1) = norm(X(t,:) - M(i,:));
 end
 [C,c] = min(Q);
 **/

var modelNumber = 64, dimension = 2;
var M = jStat.rand(modelNumber, dimension),
    Q = jStat.zeros(modelNumber, 1);

for (t = 1; t < 100; t++) {
    var inputVector = jStat.rand(1, dimension)[0];
    for (i = 1; i < modelNumber; i++) {
        var range = jStat([inputVector, M[i]]).range();
        Q[i][0] = jStat(range).norm();
    }
    winnerIndex = _.findIndex(Q, [jStat(Q).min(true)]);

    /**Updating the neighborhood

     denom = 1 + t/300000;               % time-dependent parameter
     a = .3/denom;                       % learning coefficient
     r = round(3/denom);                 % neighborhood radius
     M = reshape(M,[8 8 2]);
     X = reshape(X,[1 1 2]);
     ch = mod(c-1,8) + 1;                % c starts at top left of the
     cv = floor((c-1)/8) + 1;            % 2D SOM array and runs downwards!
     for h = max(ch-r,1):min(ch+r,8)
     for v = max(cv-r,1):min(cv+r,8)
     M(h,v,:) = M(h,v,:) + ...
     a*(X(1,1,:) - M(h,v,:));
     end
     end

     **/

    var denominator = (1 + t / 300000),
        learningRate = (0.3 / denominator),
        radius = Math.round(3 / denominator),
    //reshapedM = mutiReshape(M,8,8,2),
    //reshapedInputVector = mutiReshape(inputVector,1,1,2);
        ch = ((winnerIndex - 1) % 8) + 1;
    cv = Math.floor((winnerIndex - 1) / 8 + 1);
    for (h = Math.min((ch + radius), 8); h < Math.max((ch - radius), 1); h++) {
        for (v = Math.min((cv + radius), 8); v < Math.max((cv - radius), 1); v++) {
        }
    }
}

//console.log(inputVector)
//console.log(Q);
//console.log([jStat(Q).min(true)])
//console.log(winnerIndex)
//console.log(A)j;;;;;<<<<>>>>jkljkljkljij

var matrix = jStat.rand(4, 2);
r = mutiReshape(matrix, 2, 2, 2);
console.log(matrix);
//console.log(r)

function mutiReshape(matrix, rows, cols, slice) {
    var numbers = ubique.numel(matrix),
        colBycol = ubique.subsetlin(matrix, ubique.colon(0, numbers - 1, 1));
    //slicenumbers = numbers/slice,
    //sliced = ubique.reshape([colBycol],slice,slicenumbers),
    //reshaped = _.map(sliced, function(ele) {
    //    return ubique.reshape([ele], rows, cols);
    //});
    //return reshaped
}

