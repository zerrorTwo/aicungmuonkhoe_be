import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const loadEnv = () => {
  let YAML_CONFIG_FILENAME = 'local.yaml';
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'dev') {
    YAML_CONFIG_FILENAME = 'dev.yaml';
  }
  if (process.env.NODE_ENV === 'staging') {
    YAML_CONFIG_FILENAME = 'staging.yaml';
  }
  if (process.env.NODE_ENV === 'production') {
    YAML_CONFIG_FILENAME = 'production.yaml';
  }
  const path = join(__dirname, '../../../configs/', YAML_CONFIG_FILENAME);
  const result = yaml.load(readFileSync(path, 'utf8')) as Record<string, any>;
  return result;
};
export default loadEnv;
