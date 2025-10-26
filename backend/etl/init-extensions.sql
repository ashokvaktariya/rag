-- PostgreSQL Extensions initialization script
-- This script enables required extensions for the Consultant System

-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable additional useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Enable full-text search extensions
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Log successful extension initialization
DO $$
BEGIN
    RAISE NOTICE 'Extensions initialized successfully:';
    RAISE NOTICE '- vector: %', CASE WHEN EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN 'ENABLED' ELSE 'FAILED' END;
    RAISE NOTICE '- uuid-ossp: %', CASE WHEN EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN 'ENABLED' ELSE 'FAILED' END;
    RAISE NOTICE '- pg_trgm: %', CASE WHEN EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN 'ENABLED' ELSE 'FAILED' END;
    RAISE NOTICE '- unaccent: %', CASE WHEN EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'unaccent') THEN 'ENABLED' ELSE 'FAILED' END;
END $$;
