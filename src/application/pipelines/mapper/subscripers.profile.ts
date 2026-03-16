import { createMap } from "@automapper/core";
import mapper from "@application/shared/mapper/mapper";
import {  Subscriber } from "@core/models";
import SubscriberResponse from "@core/dto/pipeline/subscriberResponse.dto";

export default function subscripersProfile(): void {
  createMap(mapper, Subscriber, SubscriberResponse);
}
