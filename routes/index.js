const { Router } = require("express");
const controllers = require("../controllers");
const router = Router();

//Users
router.post("/signup", controllers.signUp);
router.post("/login", controllers.login);
router.post("/change-password", controllers.changeUsersPassword);

//JobLinks
router.get("/joblinks", controllers.getAllJobLinks);
router.post("/joblinks", controllers.createAJobLink);
router.delete("/joblinks/:id", controllers.deleteJobLink);

module.exports = router;
