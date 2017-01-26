
exports.up = function(knex, Promise) {
  // drop id column from URLs table
  return Promise.all([
  knex.schema.table('urls', function(table){
    table.dropColumn('id');
  })
])
};

exports.down = function(knex, Promise) {
  return Promise.all([
  knex.schema.table('urls', function(table){
    table.string('id').primary();
  })
])
  // add id column back in
};
