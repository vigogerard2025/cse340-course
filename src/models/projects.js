import db from "./db.js";

const getAllProjects = async () => {
  const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            to_char(p.date, 'YYYY-MM-DD') AS date,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON o.organization_id = p.organization_id
        ORDER BY p.date;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            to_char(p.date, 'YYYY-MM-DD') AS date
        FROM service_project p
        WHERE p.organization_id = $1
        ORDER BY p.date;
    `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            to_char(p.date, 'YYYY-MM-DD') AS date,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON o.organization_id = p.organization_id
        WHERE p.project_id = $1;
    `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
        INSERT INTO service_project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  return result.rows[0].project_id;
};

const updateProject = async (
  projectId,
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
        UPDATE service_project
        SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

  const queryParams = [
    title,
    description,
    location,
    date,
    organizationId,
    projectId,
  ];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Project not found");
  }

  return result.rows[0].project_id;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getProjectDetails,
  createProject,
  updateProject,
};
