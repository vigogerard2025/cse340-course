import { body, validationResult } from "express-validator";
import {
  getAllProjects,
  getProjectDetails,
  createProject,
  updateProject,
} from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { getCategoriesByServiceProjectId } from "../models/categories.js";

// Validation and sanitization rules for project forms
const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Project title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required")
    .isLength({ max: 1000 })
    .withMessage("Project description cannot exceed 1000 characters"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Project location is required")
    .isLength({ max: 200 })
    .withMessage("Project location cannot exceed 200 characters"),
  body("date")
    .notEmpty()
    .withMessage("Project date is required")
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];

const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = "Service Projects";

  res.render("projects", { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  const categories = await getCategoriesByServiceProjectId(projectId);
  const title = "Project Details";

  res.render("project", { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Add New Service Project";

  res.render("new-project", { title, organizations });
};

const processNewProjectForm = async (req, res) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/new-project");
  }

  const { title, description, location, date, organizationId } = req.body;

  await createProject(title, description, location, date, organizationId);

  req.flash("success", "Service project added successfully!");
  res.redirect("/projects");
};

const showEditProjectForm = async (req, res, next) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  const organizations = await getAllOrganizations();
  const title = "Edit Service Project";

  res.render("edit-project", { title, project, organizations });
};

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(`/edit-project/${projectId}`);
  }

  const { title, description, location, date, organizationId } = req.body;

  await updateProject(
    projectId,
    title,
    description,
    location,
    date,
    organizationId,
  );

  req.flash("success", "Service project updated successfully!");
  res.redirect(`/project/${projectId}`);
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
};
