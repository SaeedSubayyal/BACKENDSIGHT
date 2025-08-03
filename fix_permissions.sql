-- =====================================================
-- Fix PostgreSQL Permissions for AI Optimization Database
-- Run this as a superuser (postgres) in pgAdmin4
-- =====================================================

-- Connect to your database first, then run these commands:

-- 1. Grant usage on schema public
GRANT USAGE ON SCHEMA public TO your_username;

-- 2. Grant create on schema public
GRANT CREATE ON SCHEMA public TO your_username;

-- 3. Grant all privileges on all tables in schema public
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;

-- 4. Grant all privileges on all sequences in schema public
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;

-- 5. Grant all privileges on all functions in schema public
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO your_username;

-- 6. Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO your_username;

-- 7. Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO your_username;

-- 8. Set default privileges for future functions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO your_username;

-- 9. Grant usage on the database itself
GRANT CONNECT ON DATABASE aioptimization TO your_username;

-- 10. Grant temporary privileges (needed for some operations)
GRANT TEMPORARY ON DATABASE aioptimization TO your_username;

-- =====================================================
-- ALTERNATIVE: Grant to PUBLIC (all users)
-- =====================================================

-- If you want to grant permissions to all users (less secure but easier):
GRANT USAGE ON SCHEMA public TO PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO PUBLIC;

-- =====================================================
-- Check Current Permissions
-- =====================================================

-- Check schema permissions
SELECT 
    nspname as schema_name,
    nspacl as permissions
FROM pg_namespace 
WHERE nspname = 'public';

-- Check table permissions
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public';

-- =====================================================
-- COMMIT CHANGES
-- =====================================================
COMMIT; 