const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

/**
 * @route   GET api/posts/test
 * @desc    Tests posts route
 * @acess   Public 
 */
router.get('/test', (req, res) => res.json({
  msg: "Posts Works"
}));

/**
 * @route   GET api/posts/
 * @desc    Get Posts
 * @acess   Public
 */

router.get('/', (req, res) => {
    Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
      nopostsfound: 'No posts found'
    }))
});

/**
 * @route   GET api/posts/:id
 * @desc    Get Posts by id
 * @acess   Public
 */
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostfound: 'No post found with that ID'}))
})

 /**
 * @route   POST api/posts/
 * @desc    Create Post
 * @acess   Private
 */
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = validatePostInput(req.body)
  
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });

  newPost.save().then(post => res.json(post));
})

/**
 * @route   DELETE api/posts/:id
 * @desc    Delete Post by id
 * @acess   Private
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' })
          }
          // Delete
          post.remove().then(() => res.json({ success:true }))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
})

/**
 * @route   POST api/posts/like/:id
 * @desc    like Post by id
 * @acess   Private
 */
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      console.log(profile)
      Post.findById(req.params.id)
      .then(post => {
        console.log(post)
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this post' })
          }
          // Add user id to likes array
          post.likes.unshift({ user: req.user.id })

          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found', err }))
    })
})

/**
 * @route   POST api/posts/unlike/:id
 * @desc    unlike Post by id
 * @acess   Private
 */
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not yet liked this post' })
          }
          // GEt remove index
          post.likes = post.likes.filter(like => like.user.toString() !== req.user.id)

          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found', err }))
    })
})

/**
 * @route   POST api/posts/comment/:id
 * @desc    Comment to Post by id
 * @acess   Private
 */
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      const {errors, isValid} = validatePostInput(req.body)

    // Check validation
      if (!isValid) {
        return res.status(400).json(errors)
      }

      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }
      post.comments.unshift(newComment);
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No Post found' }))
})

/**
 * @route   Delete api/posts/comment/:id/:comment_id
 * @desc    REmove comment Post by id
 * @acess   Private
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.comment_id)
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No Post found' }))
})


module.exports = router;