export enum Exchanges {
  JOBS = "jobs",
  DELIVERY = "delivery",
  DELIVERY_RETRY = "delivery.retry", // dead letter exchange — routes back to delivery.attempts
}

export default Exchanges;
