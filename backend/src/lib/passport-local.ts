// lib/passport-local.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import handleLocalAuth from "../auth/passport-local"; // ta fonction

export default function setupLocalStrategy() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "identifier",
        passwordField: "password",
        session: true,
      },
      // LocalStrategy attend (username, password, done)
      (identifier: string, password: string, done: any) => {
        return handleLocalAuth(identifier, password, done);
      }
    )
  );
}
