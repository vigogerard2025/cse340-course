import db from "./db.js";

const addVolunteerToProject = async (userId, projectId) => {
  const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

  const queryParams = [userId, projectId];
  await db.query(query, queryParams);
};

const removeVolunteerFromProject = async (userId, projectId) => {
  const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

  const queryParams = [userId, projectId];
  await db.query(query, queryParams);
};

const isUserVolunteer = async (userId, projectId) => {
  const query = `
        SELECT 1
        FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

  const queryParams = [userId, projectId];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0;
};

const getVolunteerProjectsByUserId = async (userId) => {
  const query = `
        SELECT
            p.project_id,
            p.title,
            p.location,
            to_char(p.date, 'YYYY-MM-DD') AS date,
            o.name AS organization_name
        FROM volunteer v
        JOIN service_project p ON p.project_id = v.project_id
        JOIN organization o ON o.organization_id = p.organization_id
        WHERE v.user_id = $1
        ORDER BY p.date;
    `;

  const queryParams = [userId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

export {
  addVolunteerToProject,
  removeVolunteerFromProject,
  isUserVolunteer,
  getVolunteerProjectsByUserId,
};
