const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

module.exports = ({ clientID, clientSecret, getUserService }) => {
  const registerStrategy = () => {
    passport.use(
      new GoogleTokenStrategy(
        {
          clientID,
          clientSecret,
        },
        //  Passport verify callback
        async (accessToken, refreshToken, profile, done) => {
          const userService = getUserService();
          const [{ value: email }] = profile.emails;
          let user = await userService.getByEmail(email);
          if (!user) {
            await userService.create({
              name: profile.displayName,
              email,
            });
            user = await userService.getByEmail(email);
          }

          return done(null, {
            id: user.id,
            name: user.name,
            email: user.email,
          });
        },
      ),
    );
  };

  return { registerStrategy, passport };
};
