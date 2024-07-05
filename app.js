const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');

const SeedCategoriesData = require("./scripts/CategoriesSeeder.js");

// Application routes
const AppRoutes = require("./routes/app.routes.js");
const AuthRoutes = require("./routes/auth.routes.js");
const DashboardRoutes = require("./routes/dashboard.routes.js");
const AccountRoutes = require("./routes/account.routes.js");
const ProjectRoutes = require("./routes/project.routes.js");
const CategoryRoutes = require("./routes/category.routes.js");
const RequestRoutes = require("./routes/request.routes.js");
const NotificationRoutes = require("./routes/notification.routes.js");
const MessageRoutes = require("./routes/message.routes.js");

/**
 * Enable environment variables
 */
dotenv.config({override: true});

/**
 * Creates instance for express
 */
const app = express();

// Remove x-powered-by to not expose our stack to hackers
app.disable("x-powered-by");
/**
 * Environment variables destruct
 * We set default values for each env variable
 * To not breaks the app.
 *
 */

// Enable file uploades
app.use(fileUpload({
  createParentPath: true
}));

const {
  PORT = 3000,
  MONGODB_URI,
  SECRET = "Iw/SGe0ndio",
  NODE_ENV = "production",
  SESSION_NAME = "sid",
} = process.env;

/**
 * SESSION_MAX_AGE milliseconds = seconds * seconds * minutes * hours;
 * This for cookie session expiration in milliseconds
 */
const SESSION_MAX_AGE = 86400000; // 1 day

// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/base-layout");
app.set("view engine", "ejs");

// Enable flash messages
app.use(flash());

/*
 * Middlewares
 * */

// Enable static files (css, js, image, etc.)
app.use(express.static("public"));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Enable cookies
app.use(cookieParser());

// for production session
app.set("trust proxy", NODE_ENV === "production");

// Application session store
app.use(
  session({
    name: SESSION_NAME,
    saveUninitialized: false,
    resave: false,
    secret: SECRET,
    proxy: NODE_ENV === "production", // if you do SSL outside of node.
    store: new MongoStore({
      mongoUrl: MONGODB_URI,
      ttl: 86400, // The maximum lifetime in seconds - 1 day
      crypto: { secret: SECRET },
    }),
    cookie: {
      maxAge: SESSION_MAX_AGE,
      sameSite: true,
      httpOnly: true,
      secure: NODE_ENV === "production", // enable using ssl secure only on production environments
    },
  })
);

/**
 * Middleware to set global data
 * to be accessible on all views
 */
app.use(async (req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.authenticated = !!req.session.user; // true if session has user and false if not

  // Flash messages
  res.locals.messages = req.flash();
  next();
});

/**
 * Connecting to Mongo DB
 * Starting Express app once DB connection established successfully
 * Then seed categories list to database
 */
mongoose.connect(MONGODB_URI).then(() => {
  console.log("Database connection established successfully");

  // Start application once DB connection established
  app.listen(PORT, () => {
    console.log(`Server is running now on port ${PORT}`);

    // Seed categories list
    SeedCategoriesData();
  });
});

// Enable custom routes
app.use(AppRoutes);
app.use(AuthRoutes);
app.use(DashboardRoutes);
app.use(AccountRoutes);
app.use(ProjectRoutes);
app.use(CategoryRoutes);
app.use(RequestRoutes);
app.use(NotificationRoutes);
app.use(MessageRoutes);
