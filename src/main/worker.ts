import amqp from "amqplib";
async function main() {
  const rabbitConnString = process.env.RABBITMQ_URL!;
  const conn = await amqp.connect(rabbitConnString);

  console.log("RabbitMQ connection successful");
  const channel = await conn.createConfirmChannel();

  process.on("SIGINT", async () => {
    console.log("Program is shutting down...");
    await conn.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Program is shutting down...");
    await conn.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(`Fatal error: ${err.message ?? err}`);
});
