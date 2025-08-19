export const ldapOptions = {
  url: process.env.LDAP_URL || 'ldap://ldap.example.com',
  baseDN: process.env.LDAP_BASE_DN || 'dc=example,dc=com',
  username: process.env.LDAP_USERNAME || '',
  password: process.env.LDAP_PASSWORD || '',
};
