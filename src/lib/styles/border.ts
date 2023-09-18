import * as common from "./common.js";
import { Border, BorderSide } from "../gen/response.js";

export const all = (value: BorderSide): Border => common.all(value);
export const symmetric = (
  horizontal: BorderSide,
  vertical: BorderSide
): Border => common.symmetric(horizontal, vertical);
