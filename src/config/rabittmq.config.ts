type RabbitMQConfig = {
  url: string;
  prefetch: number;
  rertyPollInternalMs: number;
};

const config: RabbitMQConfig = {
  url: process.env.RABBITMQ_URL || "amqp://localhost",
  prefetch: 10,
  rertyPollInternalMs: parseInt(process.env.RETRY_POLL_INTERVAL_MS!),
};

export default config;
