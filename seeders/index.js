const { sequelize } = require("../models/index");

(async () => {
  try {
    console.log("Syncing databases...");
    // await sequelize.sync({ force: true });

    await require("./media_seed")();
    await require("./likes_seed")();
    await require("./comments_seed")();

    console.log("✅ Seeding complete.");
  } catch (err) {
    console.error("❌ Error during seeding data:", err);
  } finally {
    await sequelize.close();
  }
})();