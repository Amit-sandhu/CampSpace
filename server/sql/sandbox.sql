-- Optional: lets the Code Editor's "MYSQL" language run real SQL safely.
-- Run as a MySQL admin (root). Change the password, then put the same one in .env.
--
-- Each CampSpace user gets their own scratch database named campspace_sb_<hash>.
-- This MySQL user can create/use ONLY databases that start with "campspace_sb_"
-- so it can never read or change the real "campspace" tables.
CREATE USER IF NOT EXISTS 'campspace_sql'@'localhost' IDENTIFIED BY 'change_me_sandbox';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX, CREATE TEMPORARY TABLES
  ON `campspace\_sb\_%`.* TO 'campspace_sql'@'localhost';
FLUSH PRIVILEGES;
