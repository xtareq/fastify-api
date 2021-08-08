const authController = require("../app/controllers/authController");
const accountController = require("../app/controllers/accountController");

module.exports = (router, option, done) => {
  //router.register(authenticate)
  

  router.post("/login", authController.login);
  router.post("/register", authController.register);
  router.post("/verify", authController.verify);

  //Authenticated Routes

  let authenticate = { preHandler: router.authenticate };
  router.get("/profile", authenticate, accountController.profile);
  router.post("/profile/update", authenticate, accountController.updateProfile);
  router.post(
    "/change-password",
    authenticate,
    accountController.changePassword
  );

  done();
};
