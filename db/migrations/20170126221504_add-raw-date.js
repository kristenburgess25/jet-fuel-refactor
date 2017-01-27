
exports.up = function(knex, Promise) {
  return Promise.all([
  knex.schema.table('urls', function(table){
    table.integer('rawDate');
  })
])
};

exports.down = function(knex, Promise) {
  return Promise.all([
  knex.schema.table('urls', function(table){
    table.dropColumn('rawDate');
  })
])
};
