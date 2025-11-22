'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({
  // Override default find to always populate media
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        featuredImage: {
          fields: ['url', 'alternativeText', 'width', 'height', 'formats']
        }
      }
    };
    
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  // Override default findOne to always populate media
  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        featuredImage: {
          fields: ['url', 'alternativeText', 'width', 'height', 'formats']
        }
      }
    };
    
    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  },
}));

