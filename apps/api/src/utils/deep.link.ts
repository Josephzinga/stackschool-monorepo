import { Request } from "express";

export function getPlateForm(req: Request) {
  const plateform = req.query.plateform === "mobile" ? "mobile" : "web";

  const state = Buffer.from(JSON.stringify({ plateform })).toString("base64");
  return state;
}

export function parseState(state?: string) {
  try {
    if (!state) return { platform: "web" };
    return JSON.parse(Buffer.from(state, "base64").toString());
  } catch {
    return { platform: "web" };
  }
}
