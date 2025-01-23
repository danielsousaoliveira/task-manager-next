import mongoose from "mongoose";

const TasksSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    encryptedTask: { type: String, required: true },
});

export default mongoose.model("Tasks", TasksSchema);
