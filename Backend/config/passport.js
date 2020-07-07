const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
     conncetion.query("select * from userRegistration where userId =?",[jwt_payload.userId],function(err,result){
         if(user){
             console.log(user)
            return done(null, user);
         }
         else{
            return done(null, false);
         }
     })
    })
  );
};