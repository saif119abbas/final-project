type RabbitMQConfig = {
  url: string;
  prefetch: number;
};

const config: RabbitMQConfig = {
  url: process.env.RABBITMQ_URL || "amqp://localhost",
  prefetch: 10,
};

export default config;
