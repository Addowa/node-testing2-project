
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();
        tbl.string('name', 128).notNullable();
        tbl.string('email').notNullable().unique();
      });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
