var mongoose = require("mongoose");

var dbURI = "mongodb://localhost/kbbqspace";
//var dbURI = process.env.MONGOLAB_URI;

mongoose.connect(dbURI);

mongoose.connection.on("connected", function(){
    console.log("Mongoose connected to " + dbURI);
});
mongoose.connection.on("error", function(){
    console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", function(){
    console.log("Mongoose disconnected");
});

/*
gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected through " + msg);
    });
};

// APP TERMINATION
process.on("SIGINT", function(){
    gracefulShutdown("app termination", function(){
        process.exit(0);
    });
});
// HEROKU APP TERMINATION
process.on("SIGTERM", function(){
    gracefulShutdown("Heroku app shutdown", function(){
        process.exit(0);
    });
});
*/


require("./locations");