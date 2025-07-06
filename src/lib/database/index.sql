
-- Main database schema loader
-- Run this file to set up the complete database schema

-- Load files in the correct order to handle dependencies
\i core-schema.sql
\i tenant-management.sql
\i security-policies.sql
\i database-functions.sql
