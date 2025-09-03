import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import User, { IUser } from "./models/User";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI || "", {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

passport.use(User.createStrategy());

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  User.findById(id, (err: any, user: IUser | null) => {
    done(err, user as Express.User);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    (accessToken: string, refreshToken: string, profile: Profile, cb) => {
      User.findOrCreate({ googleId: profile.id }, (err: any, user: IUser) => {
        return cb(err, user);
      });
    }
  )
);

// ---------------- Routes ----------------

app.get("/", (_req: Request, res: Response) => {
  res.render("home");
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (_req: Request, res: Response) => {
    res.redirect("/secrets");
  }
);

app.get("/register", (_req: Request, res: Response) => {
  res.render("register");
});

app.get("/secrets", (_req: Request, res: Response) => {
  User.find({ secret: { $ne: null as any } }, (err: any, foundUsers: IUser[]) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets", { usersWithSecrets: foundUsers });
    }
  });
});

app.get("/submit", (req: Request, res: Response) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", (req: Request, res: Response) => {
  const submittedSecret = req.body.post;
  if (!req.user) return res.redirect("/login");

  User.findById((req.user as any).id, (err: any, foundUser: IUser | null) => {
    if (err) {
      console.log(err);
    } else if (foundUser) {
      foundUser.secret = submittedSecret;
      foundUser.save(() => {
        res.redirect("/secrets");
      });
    }
  });
});

app.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.post("/register", (req: Request, res: Response) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err: any, user: IUser) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    }
  );
});

app.get("/login", (_req: Request, res: Response) => {
  res.render("login");
});

app.post("/login", (req: Request, res: Response) => {
  const user = new User({
    username: req.body.name,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000.");
});
