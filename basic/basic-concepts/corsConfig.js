const cors = require("cors");

const configureCors = () => {
  return cors({
    //origin -> this will tell that which origins you want user can access your api
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000", //local dev
        "https://yourcustomdomain.com", //production domain
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); //giving permissio 1/2 Error(message?: string, options?: ErrorOptions):
      } else {
        callback(new Error("Not allowed by cors"));
      }
    },
    methods:['GET','POST','PUT'],
    allowedHeader:[
        "Content-type",
        "Authorization"
    ],
    exposeHeaders:[
        "Content-Range"
    ],
    credentials:true, //enable cookies supports
    preflightContinue:false,
    maxAge:600 // avoide to send options request
  });
};

module.exports={configureCors}
