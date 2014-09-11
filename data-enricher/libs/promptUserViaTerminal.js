var Q = require("q"),
    prompt = require("prompt");

prompt.start();

function getFromTerminal(schema){
    var deferred = Q.defer();
    prompt.get(schema,function(err,result){
        if (err) deferred.reject(err);
        deferred.resolve(result);
    });
    
    return deferred.promise;
    
}

module.exports = getFromTerminal;



