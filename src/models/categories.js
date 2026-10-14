import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryDetails = async (categoryId) => {
  const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByServiceProjectId = async (projectId) => {
  const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const createCategory = async (name) => {
  const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

  const queryParams = [name];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create category");
  }

  return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
  const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

  const queryParams = [name, categoryId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Category not found");
  }

  return result.rows[0].category_id;
};

const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

  const queryParams = [projectId, categoryId];
  await db.query(query, queryParams);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;

  await db.query(deleteQuery, [projectId]);

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};

export {
  getAllCategories,
  getCategoryDetails,
  getCategoriesByServiceProjectId,
  createCategory,
  updateCategory,
  updateCategoryAssignments,
};
