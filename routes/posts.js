import express from 'express';
const router = express.Router();
import {getPostsBySearch,getPosts, createPost, updatePost, deletePost, likePost, deleteVote, approveMember} from '../controllers/posts.js'
import auth from '../middleware/auth.js';

router.get('/search', getPostsBySearch)
router.get('/', auth, getPosts)
router.post('/', auth, createPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth , deletePost)
router.patch('/:id/likePost', auth , likePost)
router.patch('/:id/deleteVote', auth, deleteVote)
router.patch('/:id/approveMember', auth, approveMember)

export default router;