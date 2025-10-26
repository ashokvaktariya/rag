-- Database initialization script for Consultant System
-- This script runs when the PostgreSQL container starts for the first time

-- Create the main database (if not exists)
-- Note: The database is already created by POSTGRES_DB environment variable

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS consultant_schema;

-- Set default search path
-- ALTER DATABASE consultant_db SET search_path TO public, consultant_schema;

-- Create any additional users or roles
-- CREATE ROLE consultant_readonly;
-- GRANT CONNECT ON DATABASE consultant_db TO consultant_readonly;
-- GRANT USAGE ON SCHEMA public TO consultant_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO consultant_readonly;

-- Set up any additional database-level configurations
-- ALTER DATABASE consultant_db SET timezone TO 'UTC';
-- ALTER DATABASE consultant_db SET log_statement TO 'mod';
-- ALTER DATABASE consultant_db SET log_min_duration_statement TO 1000;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully for consultant_db';
END $$;
