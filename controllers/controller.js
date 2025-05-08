const { User, Post, Tag, PostTag } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

class Controller {
  static async home(req, res) {
    res.render('home');
  }

  static async posts(req, res) {
    try {
      const { search, order } = req.query;
      let options = {
        include: [
          { model: User, attributes: ['email'] },
          { model: Tag, attributes: ['name'] }
        ],
        attributes: ['id', 'title', 'content', 'imgUrl', 'userId', 'createdAt']
      };
      if (order) options.order = [[order, 'DESC']];
      if (search) options.where = { title: { [Op.iLike]: `%${search}%` } };
      let data = await Post.findAll(options);
      const { formatDate } = require('../helpers/helper');
      res.render('posts', { data, formatDate });
    } catch (error) {
      res.send(error);
    }
  }

  static async getAddPost(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect('/login');
      }
      const tags = await Tag.findAll();
      res.render('addPost', { tags, errors: req.query.errors ? JSON.parse(req.query.errors) : [] });
    } catch (error) {
      res.send(error);
    }
  }

  static async postAddPost(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect('/login');
      }
      const { title, content, imgUrl, tags } = req.body;
      const userId = req.session.userId;
      const newPost = await Post.create({ title, content, imgUrl, userId });
      if (tags) {
        const tagIds = Array.isArray(tags) ? tags : [tags];
        const postTags = tagIds.map(tagId => ({ postId: newPost.id, tagId }));
        await PostTag.bulkCreate(postTags);
      }
      res.redirect('/posts');
    } catch (error) {
      const errors = error.errors ? error.errors.map(e => e.message) : [error.message];
      res.redirect(`/posts/add?errors=${encodeURIComponent(JSON.stringify(errors))}`);
    }
  }

  static async postById(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id, {
        include: [
          { model: User, attributes: ['email'] },
          { model: Tag, attributes: ['name'] }
        ]
      });
      if (!post) throw new Error('Post not found');
      const { formatDate } = require('../helpers/helper');
      res.render('postById', { post, formatDate });
    } catch (error) {
      res.send(error);
    }
  }

  static async getRegister(req, res) {
    res.render('register', { errors: req.query.errors ? JSON.parse(req.query.errors) : [] });
  }

  static async postRegister(req, res) {
    try {
      const { email, password, role } = req.body;
      const user = await User.create({ email, password, role });
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'apriansyahandi07@gmail.com', 
             pass: 'ksjp hwjw rswi dche' 
        }
      });
      const mailOptions = {
        from: 'apriansyahandi07@gmail.com',
        to: email,
        subject: 'Welcome to InstaClone!',
        text: `Hi ${email},\n\nThanks for joining InstaClone! We're excited to have you.\n\nBest,\nThe InstaClone Team`
      };
      await transporter.sendMail(mailOptions);
      res.redirect('/login');
    } catch (error) {
      const errors = error.errors ? error.errors.map(e => e.message) : [error.message];
      res.redirect(`/register?errors=${encodeURIComponent(JSON.stringify(errors))}`);
    }
  }

  static async getLogin(req, res) {
    const errors = req.query.errors ? JSON.parse(req.query.errors) : [];
    res.render('login', { errors });
  }

  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error('Email not found');
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid password');
      req.session.userId = user.id;
      req.session.role = user.role;
      res.redirect('/posts');
    } catch (error) {
      const errors = [error.message];
      res.redirect(`/login?errors=${encodeURIComponent(JSON.stringify(errors))}`);
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect('/login');
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;