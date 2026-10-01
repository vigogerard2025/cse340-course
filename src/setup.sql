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
(1, 'Community Playground Build', 'Volunteers build a safe playground for neighborhood children.', 'Rexburg, ID', '2026-10-10'),
(1, 'Bridge Repair Day', 'Repair and repaint a pedestrian bridge in the city park.', 'Idaho Falls, ID', '2026-10-24'),
(2, 'Urban Garden Planting', 'Plant vegetables in a shared community garden.', 'Rexburg, ID', '2026-10-17'),
(2, 'Composting Workshop', 'Teach families how to start composting at home.', 'Ammon, ID', '2026-11-07'),
(3, 'Food Bank Sorting', 'Sort and pack donated food for local families.', 'Idaho Falls, ID', '2026-10-31'),
(3, 'Neighborhood Health Fair', 'Free health screenings and information booths.', 'Rexburg, ID', '2026-11-14');

-- ========================================
-- Categories
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla intermedia (muchos a muchos): proyecto <-> categoría
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

-- Asociaciones explícitas (1 = playground, 2 = bridge, 3 = garden,
-- 4 = composting, 5 = food bank, 6 = health fair)
-- Categorías: 1 = Environmental, 2 = Education, 3 = Community Health, 4 = Food & Hunger Relief
INSERT INTO project_category (project_id, category_id) VALUES
    (1, 2),
    (2, 1),
    (3, 1),
    (3, 4),
    (4, 1),
    (4, 2),
    (5, 4),
    (6, 3);