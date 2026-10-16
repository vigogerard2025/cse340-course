import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation,
} from "./controllers/organizations.js";
import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
} from "./controllers/projects.js";
import {
  showCategoriesPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation,
} from "./controllers/categories.js";
import {
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
} from "./controllers/users.js";
import {
  processVolunteerSignup,
  processVolunteerRemoval,
} from "./controllers/volunteers.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);

// Organization routes
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);
router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm,
);
router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm,
);
router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);

// Service project routes
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/new-project", requireRole("admin"), showNewProjectForm);
router.post(
  "/new-project",
  requireRole("admin"),
  projectValidation,
  processNewProjectForm,
);
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
router.post(
  "/edit-project/:id",
  requireRole("admin"),
  projectValidation,
  processEditProjectForm,
);

// Volunteer routes (any logged-in user)
router.post("/project/:id/volunteer", requireLogin, processVolunteerSignup);
router.post("/project/:id/unvolunteer", requireLogin, processVolunteerRemoval);

// Category routes
router.get("/categories", showCategoriesPage);
router.get("/new-category", requireRole("admin"), showNewCategoryForm);
router.post(
  "/new-category",
  requireRole("admin"),
  categoryValidation,
  processNewCategoryForm,
);
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);
router.post(
  "/edit-category/:id",
  requireRole("admin"),
  categoryValidation,
  processEditCategoryForm,
);
router.get(
  "/assign-categories/:projectId",
  requireRole("admin"),
  showAssignCategoriesForm,
);
router.post(
  "/assign-categories/:projectId",
  requireRole("admin"),
  processAssignCategoriesForm,
);

// User registration, login and logout
router.get("/register", showUserRegistrationForm);
router.post("/register", registrationValidation, processUserRegistrationForm);
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

// Protected routes
router.get("/dashboard", requireLogin, showDashboard);
router.get("/users", requireRole("admin"), showUsersPage);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
