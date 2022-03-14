var elipsoide = [
    {
        "name": "Airy 1830",
        "año": 1830,
        "pa": 6377563.396000,	
        "pb": 6356256.910000
    },
    {
        "name": "Airy Modificado 1965",
        "año": 1965,
        "pa": 6377340.189000,
        "pb": 6356034.447900
    },
    {
        "name": "Bessel 1841",
        "año": 1841,
        "pa": 6377397.155000,
        "pb": 6356078.962840
    },
    {
        "name": "Clarke 1866",
        "año": 1866,
        "pa": 6378206.400000,
        "pb": 6356583.800000
    },               
    {
        "name": "Clarke 1880",
        "año": 1880,
        "pa": 6378249.145000,
        "pb": 6356514.869550
    },
    {
        "name": "Airy Modificado 1965",
        "año": 1965,
        "pa": 6377340.189000,
        "pb": 6356034.447900
    },
    {
        "name": "Fischer 1968",
        "año": 1968,
        "pa": 6378150.000000,
        "pb": 6356768.330000
    },
    {
        "name": "GRS80",
        "año": 1980,
        "pa": 6378137.000000,
        "pb": 6356752.314140
    },
    {
        "name": "Hayford 1909",
        "año": 1909,
        "pa": 6378388.000000,
        "pb": 6356911.946130
    },
    {
        "name": "Helmert 1906" ,
        "año": 1906,
        "pa": 6378200.000000,
        "pb": 6356818.170000
    },
    {
        "name": "Hough 1960",
        "año": 1960,
        "pa": 6378270.000000,
        "pb": 6356794.343479
    },
    {
        "name": "Internacional 1909",
        "año": 1909,
        "pa": 6378388.000000,
        "pb": 6356911.946130
    },
    {
        "name": "Internacional 1924",
        "año": 1924,
        "pa": 6378388.000000,
        "pb": 6356911.946130
    },
    {
        "name": "Krasovsky 1940",
        "año": 1940,
        "pa": 6378245.000000,
        "pb": 6356863.018800
    },
    {
        "name": "Mercury 1960",
        "año": 1960,
        "pa": 6378166.000000,
        "pb": 6356784.283666
    },
    {
        "name": "Mercury Modificado 1968",
        "año": 1968,
        "pa": 6378150.000000,
        "pb": 6356768.337303
    },
    {
        "name": "Nuevo International 1967",
        "año": 1967,
        "pa": 6378157.500000,
        "pb": 6356772.200000
    },
    {
        "name": "Sudamericano 1969",
        "año": 1969,
        "pa": 6378160.000000,
        "pb": 6356774.720000
    },
    {
        "name": "Walbeck 1817",
        "año": 1817,
        "pa": 6376896.000000,
        "pb": 6355834.846700
    },
    {
        "name": "WGS66",
        "año": 1966,
        "pa": 6378145.000000,
        "pb": 6356759.769356
    },
    {
        "name": "WGS72",
        "año": 1972,
        "pa": 6378135.000000,
        "pb": 6356750.519915
    },
    {
        "name": "WGS84",
        "año": 1984,
        "pa": 6378137.000000,
        "pb": 6356752.314245
    }
]

//Cambiar el nombre del elipsoide si es necesario. Elegir alguno del objeto 'elipsoide'
var elipsoideInput = "WGS84";

function findElipsoide(elipsoideInput){
    for (var i = 0; i < elipsoide.length; i++) {
        if (elipsoide[i].name == elipsoideInput)
            return i
    };
};

//Parametros del elipsoide de referencia    
var a = elipsoide[findElipsoide(elipsoideInput)].pa;  //semieje mayor elipsoide
var b = elipsoide[findElipsoide(elipsoideInput)].pb;  //semieje menor elipsoide 
var e = Math.sqrt(Math.pow(a,2)-Math.pow(b,2)) / a;     //primera excentricidad
var e_ = Math.sqrt(Math.pow(a,2)-Math.pow(b,2)) / b;    //segunda excentricidad
var c = Math.pow(a,2) / b;                              //radio polar de curvatura     

//Variables globales para calcular x,y raton
var _lat;                                               //latitud en grados
var _lon;                                               //longitud en grados                

function gradToRad(grad){
    return grad * Math.PI / 180;
};

function calc_XY(lat_,lon_){  
    var huso = Math.trunc(lon_ / 6 + 31);   
    var meriH = 6 * huso - 183;                         //meridiano central del huso
    var Alambda = gradToRad(lon_ - meriH);                  
    var alfa = (3 / 4) * Math.pow(e_,2); 
    var beta = (5 / 3) * Math.pow(alfa,2);
    var gamma = (35 / 27) * Math.pow(alfa,3);
    var A = Math.cos(lat_) * Math.sin(Alambda);
    var A1 = Math.sin(2 * lat_);
    var A2 = A1 * Math.pow(Math.cos(lat_), 2);
    var J2 = lat_ + (A1 / 2);
    var J4 = ((3 * J2) + A2) / 4;
    var J6 = (5 * J4 + A2 * Math.pow(Math.cos(lat_), 2)) / 3;            
    var Xi = 0.5 * Math.log((1 + A) / (1 - A));
    var eta = Math.atan(Math.tan(lat_)/Math.cos(Alambda)) - lat_;
    var Ni = c / Math.sqrt(1 + Math.pow(e_,2) * Math.pow(Math.cos(lat_), 2)) * 0.9996;
    var Zeta = (Math.pow(e_,2) / 2) * Math.pow(Xi,2) * Math.pow(Math.cos(lat_), 2);
    var fi = 0.9996 * c * (lat_ - (alfa * J2) + (beta * J4) - (gamma * J6));
    var x = Xi * Ni * (1 + Zeta/3) + 500000;
    var y = eta * Ni * (1 + Zeta) + fi;
    return [x,y];
};