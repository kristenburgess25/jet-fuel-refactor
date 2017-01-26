
exports.up = function(knex, Promise) {
  return Promise.all([
  knex.schema.table('urls', function(table){
    table.increments('id').primary();
  })
])
};

exports.down = function(knex, Promise) {
  return Promise.all([
  knex.schema.table('urls', function(table){
    table.dropColumn('id');
  })
])
};
