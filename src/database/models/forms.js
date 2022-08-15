module.exports = (sequelize, DataTypes) => {
    const Forms = sequelize.define(
        'forms',
        {
            categoryId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            slug: DataTypes.STRING,
            short_desc: DataTypes.STRING,
            content: DataTypes.TEXT,
            image: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {}
    );

    // Forms.associate = function (models) {
    //     here code relation
        // Post.belongsToMany(models.categories, { through: 'posts_categories', foreignKey: 'postId', as: 'categories' });
        // Post.belongsTo(models.users, { foreignKey: 'userId', as: 'users' });
        // Post.belongsToMany(models.tags, { through: 'posts_tags', foreignKey: 'postId', as: 'tags' });
        // Post.hasMany(models.comments, { as: 'comments' });
    // };
    return Forms;
};
