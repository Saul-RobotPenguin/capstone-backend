const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Joblink = new Schema(
  {
    username: { type: String, required: true },
    ownerId: { type: String, required: true },
    role: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true },
  { collection: "jobLinks" }
);

module.exports = mongoose.model("JobLink", Joblink);
