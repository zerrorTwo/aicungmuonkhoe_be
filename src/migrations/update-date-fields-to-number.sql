-- Migration: Change DATE_WORKDAY and DATE_OFF from VARCHAR to INT
-- Date: 2025-10-16
-- Description: Convert exercise time fields from string to number (minutes)

-- Step 1: Backup current data (optional but recommended)
-- CREATE TABLE health_document_backup AS SELECT * FROM health_document;

-- Step 2: Update NULL values to 0 for safe conversion
UPDATE health_document 
SET DATE_WORKDAY = '0' 
WHERE DATE_WORKDAY IS NULL OR DATE_WORKDAY = '';

UPDATE health_document 
SET DATE_OFF = '0' 
WHERE DATE_OFF IS NULL OR DATE_OFF = '';

-- Step 3: Alter column types from VARCHAR to INT
ALTER TABLE health_document 
MODIFY COLUMN DATE_WORKDAY INT DEFAULT 0 NULL;

ALTER TABLE health_document 
MODIFY COLUMN DATE_OFF INT DEFAULT 0 NULL;

-- Step 4: Verify the changes
SELECT 
  COLUMN_NAME, 
  DATA_TYPE, 
  IS_NULLABLE, 
  COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'health_document' 
  AND COLUMN_NAME IN ('DATE_WORKDAY', 'DATE_OFF');

-- Expected result:
-- DATE_WORKDAY | int | YES | 0
-- DATE_OFF     | int | YES | 0
