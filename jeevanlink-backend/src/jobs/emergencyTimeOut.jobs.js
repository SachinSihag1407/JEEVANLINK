import cron from "node-cron";
import { Emergency } from "../models/emergency.model.js";
import redis from "../config/redis.js";

cron.schedule("*/1 * * * *", async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const emergencies = await Emergency.find({
    status: "CREATED",
    createdAt: { $lte: tenMinutesAgo },
  });

  for (const emergency of emergencies) {
    emergency.status = "CLOSED";
    emergency.closedAt = new Date();
    await emergency.save();

    await redis.del(
      `active_emergency:${emergency.patient.toString()}`
    );
  }
});
