const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Title needs a text value'],
      min: 1,
      max: 50,
    },
    content: {
      type: String,
      required: [true, 'Content needs a text value'],
      min: 2,
      max: 50,
    },
    publish: {
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('Blog', BlogSchema);
