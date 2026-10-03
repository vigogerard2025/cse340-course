-- ========================================
-- Reset (permite recrear la base de datos)
-- ========================================
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS service_project;
DROP TABLE IF EXISTS organization;

-- ========================================
-- Organizations
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- ========================================
-- Service Projects
-- (5 projects per organization)
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

INSERT INTO service_project (organization_id, title, description, location, date)
VALUES
-- BrightFuture Builders (1)
(1, 'Community Playground Build', 'Volunteers build a safe playground for neighborhood children.', 'Rexburg, ID', '2026-10-10'),
(1, 'Bridge Repair Day', 'Repair and repaint a pedestrian bridge in the city park.', 'Idaho Falls, ID', '2026-10-24'),
-- GreenHarvest Growers (2)
(2, 'Urban Garden Planting', 'Plant vegetables in a shared community garden.', 'Rexburg, ID', '2026-10-17'),
(2, 'Composting Workshop', 'Teach families how to start composting at home.', 'Ammon, ID', '2026-11-07'),
-- UnityServe Volunteers (3)
(3, 'Food Bank Sorting', 'Sort and pack donated food for local families.', 'Idaho Falls, ID', '2026-10-31'),
(3, 'Neighborhood Health Fair', 'Free health screenings and information booths.', 'Rexburg, ID', '2026-11-14'),
-- Additional projects (ids 7 to 15)
(1, 'Community Center Repair', 'Volunteers repair and repaint the local community center.', 'Rexburg, ID', '2026-11-21'),
(1, 'Home Weatherization Day', 'Seal windows and doors for low-income households.', 'Ammon, ID', '2026-12-05'),
(1, 'Park Pavilion Construction', 'Build a covered pavilion for community gatherings.', 'Idaho Falls, ID', '2026-12-12'),
(2, 'Urban Tree Planting', 'Plant trees along streets with little shade.', 'Idaho Falls, ID', '2026-11-21'),
(2, 'Seed Swap and Gardening Class', 'Teach residents how to start vegetable gardens from seed.', 'Rexburg, ID', '2026-12-05'),
(2, 'Harvest Donation Day', 'Harvest and donate fresh produce to local families.', 'Ammon, ID', '2026-12-12'),
(3, 'Tutoring Program', 'Free after-school tutoring for elementary students.', 'Rexburg, ID', '2026-11-28'),
(3, 'Winter Coat Drive', 'Collect and distribute coats for families in need.', 'Idaho Falls, ID', '2026-12-05'),
(3, 'Community Cleanup Day', 'Volunteers clean streets and parks.', 'Ammon, ID', '2026-12-12');

-- ========================================
-- Categories
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla intermedia (muchos a muchos): proyecto <-> categoria
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_pc_project
        FOREIGN KEY (project_id) REFERENCES service_project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

INSERT INTO category (name) VALUES
    ('Environmental'),
    ('Education'),
    ('Community Health'),
    ('Food & Hunger Relief');

-- Categorias: 1 = Environmental, 2 = Education, 3 = Community Health, 4 = Food & Hunger Relief
INSERT INTO project_category (project_id, category_id) VALUES
    (1, 2),
    (2, 1),
    (3, 1),
    (3, 4),
    (4, 1),
    (4, 2),
    (5, 4),
    (6, 3),
    (7, 3),
    (8, 1),
    (9, 3),
    (10, 1),
    (11, 2),
    (12, 4),
    (13, 2),
    (14, 4),
    (15, 1);

-- ========================================
-- Verificacion: debe mostrar 5 por organizacion
-- ========================================
SELECT o.organization_id, o.name, COUNT(sp.project_id) AS total_projects
FROM organization o
LEFT JOIN service_project sp ON sp.organization_id = o.organization_id
GROUP BY o.organization_id, o.name
ORDER BY o.organization_id;