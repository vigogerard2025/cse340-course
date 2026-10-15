import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { createUser, authenticateUser, getAllUsers } from "../models/users.js";

const saltRounds = 10;

// Validation rules for the registration form
const registrationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const showUserRegistrationForm = (req, res) => {
  const title = "Register";

  res.render("register", { title });
};

const processUserRegistrationForm = async (req, res) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/register");
  }

  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    await createUser(name, email, passwordHash);
  } catch (error) {
    // 23505 = unique violation (email already registered)
    if (error.code === "23505") {
      req.flash("error", "An account with that email already exists.");
      return res.redirect("/register");
    }
    throw error;
  }

  req.flash("success", "Registration successful! Please log in.");
  res.redirect("/login");
};

const showLoginForm = (req, res) => {
  const title = "Login";

  res.render("login", { title });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);

  if (user) {
    req.session.user = user;
    req.flash("success", "Login successful!");
    console.log("User logged in:", user);
    return res.redirect("/dashboard");
  }

  req.flash("error", "Invalid email or password.");
  res.redirect("/login");
};

const processLogout = (req, res, next) => {
  // regenerate destroys the old session and creates a fresh one,
  // so the flash message can still be stored for the next page
  req.session.regenerate((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You have been logged out.");
    res.redirect("/login");
  });
};

// Middleware: user must be logged in
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/login");
  }

  next();
};

// Middleware factory: user must have a specific role
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash("error", "You must be logged in to access that page.");
      return res.redirect("/login");
    }

    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access that page.");
      return res.redirect("/dashboard");
    }

    next();
  };
};

const showDashboard = (req, res) => {
  const { name, email } = req.session.user;
  const title = "Dashboard";

  res.render("dashboard", { title, name, email });
};

const showUsersPage = async (req, res) => {
  const users = await getAllUsers();
  const title = "Registered Users";

  res.render("users", { title, users });
};

export {
  registrationValidation,
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsersPage,
};
