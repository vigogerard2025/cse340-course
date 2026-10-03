// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from "../models/projects.js";
import { getCategoriesByServiceProjectId } from "../models/categories.js";

// Define any controller functions
const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = "Upcoming Service Projects";

  res.render("projects", { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project Not Found");
    err.status = 404;
    return next(err);
  }

  const categories = await getCategoriesByServiceProjectId(projectId);
  const title = "Service Project Details";

  res.render("project", { title, project, categories });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };
