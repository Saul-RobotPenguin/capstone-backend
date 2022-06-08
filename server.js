const app = require("./app.js");
const db = require("./db");

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running at port ${PORT}`));
