const commentModel = require('../models/Comment');
const newsModel = require('../models/News');
const createError = require('../utils/error-message');
const { validationResult } = require('express-validator');

const allComments = async (req, res, next) => {
  try {
    let comments;
    if(req.role === 'admin') {
    comments = await commentModel.find().populate('article', 'title').sort({ createdAt: -1 });
    }else{
      const news = await newsModel.find({ author: req.id });
      const newsIds = news.map(news => news._id);
      comments = await commentModel.find({  article: { $in: newsIds } }).populate('article', 'title').sort({ createdAt: -1 });
    }
    res.render('admin/comments', { comments, role: req.role });
  } catch (error) {
     next(createError(500, 'Error fetching comments'));
  }

}



const updateCommentStatus = async (req, res, next) => {
  try {
    const comment = await commentModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!comment) {
      return next(createError(404, 'Comment not found'));
    }
    res.json({ success: true, comment });
  } catch (error) {
    next(createError(500, 'Error updating comment status'));
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await commentModel.findByIdAndDelete(req.params.id);
    if (!comment) {
      return next(createError(404, 'Comment not found'));
    }
    res.json({ success: true, comment });
  } catch (error) {
    next(createError(500, 'Error deleting comment'));
  }
};

module.exports = {
  allComments,
  updateCommentStatus,
  deleteComment
};












