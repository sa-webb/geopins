const { AuthenticationError } = require('apollo-server');

const user = {
  _id: '1',
  name: 'austin webb',
  email: 'stevenaustinwebb@gmail.com',
  picture: 'https://cloudinary.com/nendsudes.jpg'
};

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError();
  }
  return next(root, args, ctx, info)
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser)
  }
};
