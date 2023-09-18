import { BorderRadius, Radius } from "../gen/response.js";

export function all(value: number | Radius): BorderRadius {
  if (typeof value === "number")
    value = {
      x: value,
      y: value,
    };
  return {
    topLeft: value,
    topRight: value,
    bottomRight: value,
    bottomLeft: value,
  };
}
