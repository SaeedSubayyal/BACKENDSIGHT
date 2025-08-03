-- =====================================================
-- Quick Fix for "permission denied for schema public"
-- Run this in pgAdmin4 Query Tool
-- =====================================================

-- Option 1: Grant permissions to PUBLIC (easiest fix)
GRANT USAGE ON SCHEMA public TO PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO PUBLIC;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO PUBLIC;

-- Grant database permissions
GRANT CONNECT ON DATABASE aioptimization TO PUBLIC;
GRANT TEMPORARY ON DATABASE aioptimization TO PUBLIC;

COMMIT; 