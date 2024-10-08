exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  /*
    memberikan constraint foreign key pada user_album_likes.user_id
    terhadap users.id
    */
  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.user_id_users.id',
    {
      foreignKeys: {
        columns: 'user_id',
        references: 'users(id)',
        onDelete: 'CASCADE',
      },
    },
  );
  /*
    memberikan constraint foreign key pada user_album_likes.album_id
    terhadap albums.id
    */
  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.album_id_albums.id',
    {
      foreignKeys: {
        columns: 'album_id',
        references: 'albums(id)',
        onDelete: 'CASCADE',
      },
    },
  );
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
