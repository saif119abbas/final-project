import { classes } from "@automapper/classes";
import { createMapper } from "@automapper/core";

const mapper = createMapper({
  strategyInitializer: classes(),
});
export default mapper;
