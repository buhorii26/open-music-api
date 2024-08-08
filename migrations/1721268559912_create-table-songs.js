exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(12)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: false,
    },
    albumId: {
      type: 'VARCHAR(30)',
      notNull: false,
    },
  });
  /*
    memberikan constraint foreign key pada songs.albumId
    terhadap albums.id
    */
  pgm.addConstraint('songs', 'fk_songs.albumId_albums.id', {
    foreignKeys: {
      columns: 'albumId',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // menghapus table songs
  pgm.dropTable('songs');
  // menghapus constraint fk_songs.albumId_albums.id pada tabel songs
  pgm.dropConstraint('songs', 'fk_songs.albumId_albums.id');
};
