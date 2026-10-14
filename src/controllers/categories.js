import { body, validationResult } from "express-validator";
import {
  getAllCategories,
  getCategoryDetails,
  getCategoriesByServiceProjectId,
  createCategory,
  updateCategory,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";

// Validation and sanitization rules for category forms
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters"),
];

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Categories";

  res.render("categories", { title, categories });
};

const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";

  res.render("new-category", { title });
};

const processNewCategoryForm = async (req, res) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/new-category");
  }

  const { name } = req.body;

  try {
    await createCategory(name);
  } catch (error) {
    // 23505 = unique violation (category name already exists)
    if (error.code === "23505") {
      req.flash("error", "A category with that name already exists.");
      return res.redirect("/new-category");
    }
    throw error;
  }

  req.flash("success", "Category added successfully!");
  res.redirect("/categories");
};

const showEditCategoryForm = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryDetails(categoryId);

  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  const title = "Edit Category";

  res.render("edit-category", { title, category });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(`/edit-category/${categoryId}`);
  }

  const { name } = req.body;

  try {
    await updateCategory(categoryId, name);
  } catch (error) {
    if (error.code === "23505") {
      req.flash("error", "A category with that name already exists.");
      return res.redirect(`/edit-category/${categoryId}`);
    }
    throw error;
  }

  req.flash("success", "Category updated successfully!");
  res.redirect("/categories");
};

const showAssignCategoriesForm = async (req, res, next) => {
  const projectId = req.params.projectId;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByServiceProjectId(projectId);
  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    project,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  // Checkboxes send nothing, one string, or an array
  const selectedCategoryIds = [].concat(req.body.categoryIds || []);

  await updateCategoryAssignments(projectId, selectedCategoryIds);

  req.flash("success", "Categories updated successfully!");
  res.redirect(`/project/${projectId}`);
};

export {
  showCategoriesPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation,
};
