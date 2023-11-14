const app = require("./app");
const database = require("./utils/database");
const logger = require("./utils/logger");

app.listen(database.PORT, () => {
  logger.info(`Server running on port ${database.PORT}`);
});
