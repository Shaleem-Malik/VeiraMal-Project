/**
 * Latest Post Widget
 */
import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import update from 'react-addons-update';
import { Scrollbars } from 'react-custom-scrollbars';
import {
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Form,
   FormGroup,
   Label,
   Input
} from 'reactstrap';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { Fab } from '@material-ui/core';
// api
import api from 'Api';
//Helper
import { getTheDate } from 'Helpers/helpers';
// card component
import { RctCardFooter } from 'Components/RctCard';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
// intl messages
import IntlMessages from 'Util/IntlMessages';

function LatestPost(){
   const [blogPostData, setBlogPostData] = useState(null);
   const [snackbar, setSnackbar] = useState(false);
   const [sectionReload, setSectionReload] = useState(false);
   const [snackbarMessage, setSnackbarMessage] = useState('');
   const [editPostModal, setEditPostModal] = useState(false);
   const [editPost, setEditPost] = useState(null);
   const [addNewPostForm, setAddNewPostForm] = useState(false);
   const [addNewPostDetails, setAddNewPostDetails] = useState({
      body: '',
      title: '',
      id: null,
      date: null,
      thumbnail: ''
   })
   
   useEffect(() => {
      getBlogData();
   },[]);

   // get Blog Data
   const getBlogData = () => {
      setSectionReload(true);
      api.get('blogData.js')
         .then((response) => {
            setBlogPostData(response.data);
            setSectionReload(false);
         }).catch(error => {
            setBlogPostData(null);
            setSectionReload(false);
         })
   }

	/**
     * On Delete Post
   */
   const onDeletePost = (e, post) =>  {
      e.stopPropagation();
      setSectionReload(true);
      let posts = blogPostData;
      let index = posts.indexOf(post);
      setTimeout(() => {
         posts.splice(index, 1);
         setBlogPostData(posts);
         setSectionReload(false);
         setSnackbar(true);
         setSnackbarMessage('Post Has Been Moved To Trash');
      }, 1500);
   }

   // edit Post
   const onEditPost = (data) => {
      setEditPostModal(true);
      setEditPost(data) ;
      setAddNewPostForm(false);
   }

   // toggle edit Post modal
   const toggleEditPostModal = () => {
      setEditPostModal(!editPostModal);
   }

   // submit Post edit form
   const onSubmitPostEditDetailForm = () => {
      if (editPost.title !== '' && editPost.body !== '') {
         setEditPostModal(false);
         setSectionReload(true);
         let indexOfPost;
         for (let i = 0; i < blogPostData.length; i++) {
            const post = blogPostData[i];
            if (post.id === editPost.id) {
               indexOfPost = i;
            }
         }
         setTimeout(() => {
            setSectionReload(false);
            setSnackbar(true);
            setSnackbarMessage('Post Updated Successfully');
            setBlogPostData(update(blogPostData,{
                  [indexOfPost]: { $set: editPost }
               }
            ))
         }, 1500);
      }
   }

   // on change Post details
   const onChangePostDetails = (key, value) => {
      setEditPost({
         ...editPost,
         [key]: value
      })
   }

   // add new Post
   const addNewPost = () => {
      setEditPostModal(true);
      setAddNewPostForm(true);
      setEditPost(null);
      setAddNewPostDetails({
         body: '',
         title: '',
         id: null,
         comments: 0,
         views: 0,
         likes: 0,
         thumbnail: "http://via.placeholder.com/63X63"
      })
   }

   // on change Post add new form value
   const onChangePostAddNewForm = (key, value) => {
      setAddNewPostDetails({
         ...addNewPostDetails,
         [key]: value
      })
   }

   // on submit add new Post form
   const onSubmitAddNewPostForm = () => {
      if (addNewPostDetails.title !== '' && addNewPostDetails.body !== '') {
         setEditPostModal(false);
         setSectionReload(true);
         let newPost = addNewPostDetails;
         newPost.date = new Date().getTime() / 1000;
         let newPosts = blogPostData;
         setTimeout(() => {
            newPosts.push(newPost);
            setBlogPostData(newPosts);
            setSectionReload(false);
            setSnackbar(true);
            setSnackbarMessage('Post Added Successfully');
         }, 1500);
      }
   }

   return (
      <div className="blog-list-wrap">
         {sectionReload &&
            <RctSectionLoader />
         }
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={600} autoHide>
            <List className="p-0">
               {blogPostData && blogPostData.map((data, key) => (
                  <ListItem key={key} button className="post-item align-items-center justify-content-between py-25">
                     <div className="post-content d-flex">
                        <div className="post-img mr-20">
                           <img src={data.thumbnail} alt="post-img" className="img-fluid" />
                        </div>
                        <div className="post-info">
                           <h5><a href="!#">{data.title}</a></h5>
                           <div className="meta-info fs-12 text-muted mb-5">
                              <span className="mr-15 d-inline-block"><i className="zmdi zmdi-time mr-5"></i>{getTheDate(data.date, 'DD MMM YYYY')}</span>
                              <span className="mr-15 d-inline-block"><i className="zmdi zmdi-comment mr-5"></i>{data.comments} comments</span>
                              <span className="mr-15 d-inline-block"><i className="zmdi zmdi-favorite mr-5"></i>{data.likes} Likes</span>
                              <span className="mr-15 d-inline-block"><i className="zmdi zmdi-eye mr-5"></i>{data.views} Views</span>
                           </div>
                           <p className="mb-0">{data.body}</p>
                        </div>
                     </div>
                     <div className="d-flex hover-action">
                        <Fab variant="round" size="small" className="btn-success text-white m-5"
                           onClick={() => onEditPost(data)}
                        >
                           <i className="zmdi zmdi-edit"></i>
                        </Fab>
                        <Fab variant="round" size="small" className="btn-danger text-white m-5"
                           onClick={(e) => onDeletePost(e, data)}
                        >
                           <i className="zmdi zmdi-delete"></i>
                        </Fab>
                     </div>
                  </ListItem>
               ))}
            </List>
         </Scrollbars>
         <RctCardFooter customClasses="d-flex justify-content-between align-items-center">
            <Button variant="contained" color="primary" className="text-white" onClick={() => addNewPost()}>
               <IntlMessages id="widgets.addNew" />
            </Button>
            <span className="fs-12 text-base">
               <i className="mr-15 zmdi zmdi-refresh"></i>
               <IntlMessages id="widgets.updated10Minago" />
            </span>
         </RctCardFooter>
         {editPostModal &&
            <Modal
               isOpen={editPostModal}
               toggle={toggleEditPostModal}
            >
               <ModalHeader toggle={toggleEditPostModal}>
                  {addNewPostForm ? 'Add New Post' : 'Edit Post'}
               </ModalHeader>
               <ModalBody>
                  {addNewPostForm ?
                     <Form>
                        <FormGroup>
                           <Label for="postTitle">Title</Label>
                           <Input
                              type="text"
                              name="name"
                              id="postTitle"
                              value={addNewPostDetails.title}
                              onChange={(e) => onChangePostAddNewForm('title', e.target.value)}
                           />
                        </FormGroup>
                        <FormGroup>
                           <Label for="postBody">Content</Label>
                           <Input
                              type="textarea"
                              name="textarea"
                              id="postBody"
                              value={addNewPostDetails.body}
                              onChange={(e) => onChangePostAddNewForm('body', e.target.value)}
                           />
                        </FormGroup>
                     </Form>
                     : <Form>
                        <FormGroup>
                           <Label for="postTitle">Tilte</Label>
                           <Input
                              type="text"
                              name="title"
                              id="postTitle"
                              value={editPost.title}
                              onChange={(e) => onChangePostDetails('title', e.target.value)}
                           />
                        </FormGroup>
                        <FormGroup>
                           <Label for="postContent">Content</Label>
                           <Input
                              type="textarea"
                              name="content"
                              id="postContent"
                              value={editPost.body}
                              onChange={(e) => onChangePostDetails('body', e.target.value)}
                           />
                        </FormGroup>
                     </Form>
                  }
               </ModalBody>
               <ModalFooter>
                  {addNewPostForm ?
                     <div>
                        <Button variant="contained" color="primary" className="text-white" onClick={() => onSubmitAddNewPostForm()}><IntlMessages id="button.add" /></Button>{' '}
                        <Button variant="contained" className="btn-danger text-white" onClick={toggleEditPostModal}><IntlMessages id="button.cancel" /></Button>
                     </div>
                     : <div><Button variant="contained" color="primary" className="text-white" onClick={() => onSubmitPostEditDetailForm()}><IntlMessages id="button.update" /></Button>{' '}
                        <Button variant="contained" className="btn-danger text-white" onClick={toggleEditPostModal}><IntlMessages id="button.cancel" /></Button></div>
                  }
               </ModalFooter>
            </Modal>
         }
         <Snackbar
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'center',
            }}
            open={snackbar}
            onClose={() => setSnackbar(false)}
            autoHideDuration={2000}
            message={<span id="message-id">{snackbarMessage}</span>}
         />
      </div>
   );
}

export default LatestPost;