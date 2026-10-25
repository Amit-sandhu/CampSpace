-- CampSpace backend schema (run once; server/db.js also runs this automatically on start)
CREATE DATABASE IF NOT EXISTS campspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campspace;

-- Code saved by the user from the Code Editor
CREATE TABLE IF NOT EXISTS snippets (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner       VARCHAR(255) NOT NULL DEFAULT 'guest',   -- user email from the CampSpace session
  title       VARCHAR(120) NOT NULL,
  language    VARCHAR(32)  NOT NULL,
  code        MEDIUMTEXT   NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_owner (owner)
);

-- History of every run (useful for debugging and for showing "recent runs")
CREATE TABLE IF NOT EXISTS runs (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner        VARCHAR(255) NOT NULL DEFAULT 'guest',
  language     VARCHAR(32)  NOT NULL,
  code         MEDIUMTEXT   NOT NULL,
  stdin_text   TEXT NULL,
  stdout_text  MEDIUMTEXT NULL,
  stderr_text  MEDIUMTEXT NULL,
  exit_code    INT NULL,
  timed_out    TINYINT(1) NOT NULL DEFAULT 0,
  duration_ms  INT UNSIGNED NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_owner_time (owner, created_at)
);
