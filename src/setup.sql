-- ========================================
-- Reset (permite recrear la base de datos)
-- Orden: primero las tablas que dependen de otras
-- ========================================
DROP TABLE IF EXISTS volunteer;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
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
(1, 'Community Playground Build', 'Volunteers build a safe playground for neighborhood children.', 'Rexburg, ID', '2026-11-07'),
(1, 'Bridge Repair Day', 'Repair and repaint a pedestrian bridge in the city park.', 'Idaho Falls, ID', '2026-11-14'),
(1, 'Park Bench Installation', 'Install new benches along the riverside walking path.', 'Rigby, ID', '2026-11-21'),
(1, 'Community Center Renovation', 'Paint and repair rooms at the community center.', 'Ammon, ID', '2026-12-05'),
(1, 'Affordable Housing Cleanup', 'Clean and prepare lots for new affordable housing.', 'Rexburg, ID', '2026-12-12'),
(2, 'Urban Garden Planting', 'Plant vegetables in a shared community garden.', 'Rexburg, ID', '2026-11-08'),
(2, 'Composting Workshop', 'Teach families how to start composting at home.', 'Ammon, ID', '2026-11-15'),
(2, 'School Garden Project', 'Build raised garden beds with students.', 'Sugar City, ID', '2026-11-22'),
(2, 'Food Sustainability Workshop', 'Learn to preserve and store seasonal produce.', 'Idaho Falls, ID', '2026-12-06'),
(2, 'Harvest and Food Donation', 'Harvest vegetables and donate them to local families.', 'Rigby, ID', '2026-12-13'),
(3, 'Food Bank Sorting', 'Sort and pack donated food for local families.', 'Idaho Falls, ID', '2026-11-09'),
(3, 'Neighborhood Health Fair', 'Free health screenings and information booths.', 'Rexburg, ID', '2026-11-16'),
(3, 'Clothing Donation Drive', 'Collect and sort winter clothing for families in need.', 'Ammon, ID', '2026-11-23'),
(3, 'Senior Support Day', 'Help seniors with yard work and small household tasks.', 'Rigby, ID', '2026-12-07'),
(3, 'Holiday Community Outreach', 'Deliver holiday meal baskets to neighbors.', 'Rexburg, ID', '2026-12-14');

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

-- Categorías: 1 = Environmental, 2 = Education, 3 = Community Health, 4 = Food & Hunger Relief
INSERT INTO project_category (project_id, category_id) VALUES
    (1, 2),
    (2, 1),
    (3, 1),
    (4, 2), (4, 1),
    (5, 1),
    (6, 1),
    (7, 1), (7, 2),
    (8, 2),
    (9, 4), (9, 2),
    (10, 4),
    (11, 4),
    (12, 3),
    (13, 4),
    (14, 3),
    (15, 3);

-- ========================================
-- Roles
-- ========================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- ========================================
-- Users
-- ========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Volunteers (muchos a muchos): usuario <-> proyecto
-- ========================================
CREATE TABLE volunteer (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id),
    CONSTRAINT fk_volunteer_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_volunteer_project
        FOREIGN KEY (project_id) REFERENCES service_project(project_id) ON DELETE CASCADE
);