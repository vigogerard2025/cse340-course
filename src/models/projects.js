import db from "./db.js";

const getAllProjects = async () => {
  const query = `
    SELECT
      service_project.project_id,
      service_project.organization_id,
      service_project.title,
      service_project.description,
      service_project.location,
      service_project.date,
      organization.name AS organization_name
    FROM service_project
    JOIN organization
      ON service_project.organization_id = organization.organization_id;
  `;

  const result = await db.query(query);

  return result.rows;
};
const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
      SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        date
      FROM service_project
      WHERE organization_id = $1
      ORDER BY date;
    `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};
const getUpcomingProjects = async (numberOfProjects) => {
  const query = `
      SELECT
        sp.project_id,
        sp.title,
        sp.description,
        sp.date,
        sp.location,
        sp.organization_id,
        o.name AS organization_name
      FROM service_project sp
      JOIN organization o ON sp.organization_id = o.organization_id
      WHERE sp.date >= CURRENT_DATE
      ORDER BY sp.date ASC
      LIMIT $1;
    `;

  const queryParams = [numberOfProjects];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (id) => {
  const query = `
      SELECT
        sp.project_id,
        sp.title,
        sp.description,
        sp.date,
        sp.location,
        sp.organization_id,
        o.name AS organization_name
      FROM service_project sp
      JOIN organization o ON sp.organization_id = o.organization_id
      WHERE sp.project_id = $1;
    `;

  const queryParams = [id];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};
const getProjectsByCategoryId = async (categoryId) => {
  const query = `
      SELECT
        sp.project_id,
        sp.title,
        sp.description,
        sp.date,
        sp.location,
        sp.organization_id
      FROM service_project sp
      JOIN project_category pc ON sp.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY sp.date;
    `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};
export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  getProjectsByCategoryId,
};
