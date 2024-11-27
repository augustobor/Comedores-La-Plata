-- Database: seba_maps_demo

-- DROP DATABASE IF EXISTS mentes_libres_demo;

CREATE DATABASE seba_maps_demo
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
--    LC_COLLATE = 'Spanish_Mexico.utf8'
--    LC_CTYPE = 'Spanish_Mexico.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- SCHEMA: schema_1

-- DROP SCHEMA IF EXISTS schema_1 ;

CREATE SCHEMA IF NOT EXISTS schema_1
    AUTHORIZATION postgres;