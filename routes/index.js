const express = require("express");
const router = express.Router();

router.use("/media", require("./media_route"));
// router.use("/users", require("./user_route"));
// router.use("/activity_logs", require("./activityLog_routes"));
// router.use("/", require("./model_route"));
module.exports = router;
