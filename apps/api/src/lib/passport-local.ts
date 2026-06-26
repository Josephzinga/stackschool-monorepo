import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import handleLocalAuth from "../controllers/passport-local";

export default function setupLocalStrategy() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "identifier",
        passwordField: "password",
        session: true,
      },
      (identifier: string, password: string, done: any) => {
        return handleLocalAuth(identifier, password, done);
      }
    )
  );
}
