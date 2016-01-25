module.exports = {
  rethinkdb: {
    // host: 'app-db',
    host: '192.168.99.100',
    port: 28015,
    authKey: '',
    db: 'nerd',
    tables: ['users', 'groups']
  },
  express: {
     port: 3000
  }
};
