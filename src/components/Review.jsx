import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Image, Collapse } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaReply, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Rating from './Rating';
import {
  useLikeReviewMutation,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '../slices/productsApiSlice';
import './Review.css'; // Nous créerons ce fichier juste après

const Review = ({ review, productId, refetch, depth = 0 }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const [likeReview] = useLikeReviewMutation();
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(depth < 1); // Ouvre les réponses du 1er niveau par défaut
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState(review.comment);
  const [likes, setLikes] = useState(review.likes.length);
  const [isLiked, setIsLiked] = useState(userInfo ? review.likes.includes(userInfo._id) : false);

  const handleLike = async () => {
    if (!userInfo) {
      toast.info('Connectez-vous pour aimer un avis');
      return;
    }
    // Mise à jour optimiste de l'interface
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    try {
      await likeReview({ productId, reviewId: review._id }).unwrap();
    } catch (err) {
      // Si l'API échoue, on annule la mise à jour de l'interface
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, comment: replyText, parentId: review._id }).unwrap();
      toast.success('Réponse publiée !');
      setIsReplying(false);
      setReplyText('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReview({ productId, reviewId: review._id, comment: editText }).unwrap();
      toast.success('Avis modifié !');
      setIsEditing(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      try {
        await deleteReview({ productId, reviewId: review._id }).unwrap();
        toast.info('Avis supprimé.');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  
  const userCanEdit = userInfo && (userInfo._id === review.user || userInfo.isAdmin);
  const userCanDelete = userInfo && (userInfo._id === review.user || userInfo.isAdmin);

  return (
    <div className="review-thread">
      <div className="review-card">
        <Image src={review.user?.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} roundedCircle className="review-avatar" />
        <div className="review-content">
          <div className="review-card-header">
            <div>
              <span className="review-author">{review.name}</span>
              {review.user?.isAdmin && <span className="badge-admin">Admin</span>}
            </div>
            <span className="review-date">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>

          {review.rating > 0 && <Rating value={review.rating} />}
          
          {isEditing ? (
            <Form onSubmit={handleUpdateSubmit} className="edit-form">
              <Form.Control as="textarea" value={editText} onChange={(e) => setEditText(e.target.value)} required />
              <div className="edit-form-actions">
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>Annuler</Button>
                <Button size="sm" variant="primary" type="submit">Enregistrer</Button>
              </div>
            </Form>
          ) : (
            <p className="review-comment-text">{review.comment}</p>
          )}

          <div className="review-actions">
            <Button variant="link" onClick={handleLike} className="like-btn">
              {isLiked ? <FaHeart color="red" /> : <FaRegHeart />} {likes > 0 && likes}
            </Button>
            <Button variant="link" onClick={() => setIsReplying(!isReplying)}>
              <FaReply /> Répondre
            </Button>
            {userCanEdit && <Button variant="link" onClick={() => setIsEditing(!isEditing)}><FaEdit /></Button>}
            {userCanDelete && <Button variant="link" onClick={handleDelete}><FaTrash /></Button>}
          </div>

          {isReplying && (
            <Form onSubmit={handleReplySubmit} className="reply-form">
              <Form.Control as="textarea" placeholder={`Répondre à ${review.name}...`} value={replyText} onChange={(e) => setReplyText(e.target.value)} required />
              <div className="reply-form-actions">
                <Button size="sm" variant="secondary" onClick={() => setIsReplying(false)}>Annuler</Button>
                <Button size="sm" variant="primary" type="submit">Répondre</Button>
              </div>
            </Form>
          )}
        </div>
      </div>
      
      {review.replies && review.replies.length > 0 && (
        <>
          <Button variant="link" onClick={() => setShowReplies(!showReplies)} className="toggle-replies-btn">
            {showReplies ? <FaChevronUp /> : <FaChevronDown />}
            {showReplies ? 'Masquer' : 'Afficher'} les {review.replies.length} réponse(s)
          </Button>
          <Collapse in={showReplies}>
            <div className="replies-container">
              {review.replies.map(reply => (
                <Review key={reply._id} review={reply} productId={productId} refetch={refetch} depth={depth + 1} />
              ))}
            </div>
          </Collapse>
        </>
      )}
    </div>
  );
};

export default Review;