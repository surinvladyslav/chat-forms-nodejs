const Model = require('../database/models');

const { forms } = Model.sequelize.models;

const getForms = async () => {
    const post = [
        {
            as: 'categories',
            through: {
                attributes: [],
            },
        },
        {
            as: 'users',
            attributes: ['id', 'userName'],
        },
    ];
    return post;
};

const addForms = async (user, payload) => {
    // const { id } = user;
    // const { categoryId, title, slug, short_desc, content } = payload;
    // const post = await posts.create({ categoryId, userId: id, title, slug, short_desc, content });
    // await posts_categories.create({
    //     postId: post.id,
    //     categoryId,
    // });
    // return post;
};

module.exports = {
    getForms,
    addForms,
};
