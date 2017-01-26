exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('folders', function(table) {
            table.increments('id').primary();
            table.string('folderTitle');
            table.string('requestType');

            table.timestamps();
        }),

        knex.schema.createTable('urls', function(table){
            table.increments('id').primary();
            table.string('longURL');
            table.string('shortURL');
            table.string('parentFolder');
            table.integer('dateAddedRaw');
            table.integer('dateAddedHumanReadable');
            table.integer('clickCount');
            table.string('requestType');
            table.integer('folder_id')
                 .references('id')
                 .inTable('folders');

            table.timestamps();
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('folders'),
        knex.schema.dropTable('urls')
    ])
};
