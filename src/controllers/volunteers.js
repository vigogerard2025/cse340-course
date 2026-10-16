import { getProjectDetails } from "../models/projects.js";
import {
  addVolunteerToProject,
  removeVolunteerFromProject,
} from "../models/volunteers.js";

const processVolunteerSignup = async (req, res, next) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  await addVolunteerToProject(req.session.user.user_id, projectId);

  req.flash("success", "You are now volunteering for this project!");
  res.redirect(`/project/${projectId}`);
};

const processVolunteerRemoval = async (req, res) => {
  const projectId = req.params.id;

  await removeVolunteerFromProject(req.session.user.user_id, projectId);

  req.flash(
    "success",
    "You have been removed as a volunteer from this project.",
  );

  // Return to the page the user came from (only two valid destinations)
  const redirectPath =
    req.body.returnTo === "dashboard" ? "/dashboard" : `/project/${projectId}`;
  res.redirect(redirectPath);
};

export { processVolunteerSignup, processVolunteerRemoval };
