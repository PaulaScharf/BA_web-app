// Source: https://matthias-planitzer.de/2017/06/mit-dem-gyroskop-die-geraeteausrichtung-korrekt-messen/

let currentScreenOrientation = (window.innerWidth / window.innerHeight > 1) ? -90 : 0;

let calculateNormal = function(alpha, beta, gamma) {
    let normal = [1, 0, 0];

    let matrix = getBaseRotationMatrix(alpha, beta, gamma);
    matrix = multiplyMatrix(matrix, getScreenMatrix());
    normal = multiplyVector(normal, matrix);

    return normal;
};

let multiplyVector = function(vector, matrix) {
    let newVector = [];
    newVector[0] = vector[0] * matrix[0] + vector[1] * matrix[1] + vector[2] * matrix[2];
    newVector[1] = vector[0] * matrix[3] + vector[1] * matrix[4] + vector[2] * matrix[5];
    newVector[2] = vector[0] * matrix[6] + vector[1] * matrix[7] + vector[2] * matrix[8];

    return newVector;
};

let multiplyMatrix = function(a, b) {
    let newMatrix = [];

    newMatrix[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
    newMatrix[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
    newMatrix[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
    newMatrix[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
    newMatrix[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
    newMatrix[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
    newMatrix[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
    newMatrix[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
    newMatrix[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

    return newMatrix;
};

let getScreenMatrix = function() {
    let cosZ = Math.cos(currentScreenOrientation),
        sinA = Math.sin(currentScreenOrientation);
    return [ cosZ, -sinA, 0,
        sinA, cosZ, 0,
        0, 0, 1 ];
};

function degreeToRad(angle) {
    return angle * Math.PI / 180;
}

let getBaseRotationMatrix = function(alpha, beta, gamma) {
    alpha = alpha ? degreeToRad(alpha) : 0;
    beta = beta ? degreeToRad(beta) : 0;
    gamma = gamma ? degreeToRad(gamma) : 0;

    let cA = Math.cos(alpha),
        cB = Math.cos(beta),
        cG = Math.cos(gamma),
        sA = Math.sin(alpha),
        sB = Math.sin(beta),
        sG = Math.sin(gamma);

    let m11 = cA * cG - sA * sB * sG,
        m12 = -cB * sA,
        m13 = cG * sA * sB + cA * sG,

        m21 = cG * sA + cA * sB * sG,
        m22 = cA * cB,
        m23 = sA * sG - cA * cG * sB,

        m31 = - cB * sG,
        m32 = sB,
        m33 = cB * cG;

    return [ m11, m12, m13,
        m21, m22, m23,
        m31, m32, m33 ];
};

export default calculateNormal;