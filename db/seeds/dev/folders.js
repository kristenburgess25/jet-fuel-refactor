exports.seed = function(knex, Promise) {
  return knex('folders').del()
  .then(() => {
    return Promise.all([
      knex('folders').insert({
        folderTitle: 'Sports',
        id: 1167,
        requestType: 'bookmark-update'
      }),
      knex('folders').insert({
        folderTitle: 'Cats',
        id: 1169,
        requestType: 'bookmark-update'
      })
    ]);
  });
};
