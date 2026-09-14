const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  timestamps: {
    type: Date,
    default: Date.now
  }
});

// Use a synchronous pre-validate hook to avoid callback-style `next` issues
categorySchema.pre('validate', function() {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
});


module.exports = mongoose.model('Category', categorySchema);

