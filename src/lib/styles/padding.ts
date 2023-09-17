import * as common from "./common";
import { Padding } from "../gen/response.js";

export const all = (value: number): Padding => common.all(value);
export const symmetric = (horizontal: number, vertical: number): Padding =>
  common.symmetric(horizontal, vertical);
