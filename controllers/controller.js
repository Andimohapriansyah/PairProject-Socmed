const { formatDate } = require("../helpers/helper");
const { User, Post, Tag, PostTag } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

class Controller {
  static async home(req, res) {
    try {
      res.render("home");
    } catch (error) {
      res.send(error);
    }
  }

  static async posts(req, res) {
    try {
      const { search, order } = req.query;
      let data = await Post.findAllPosts(search, order);
      res.render("posts", { data, formatDate });
    } catch (error) {
      res.send(error);
    }
  }

  static async getAddPost(req, res) {
    try {
      const { error } = req.query;
      let tags = await Tag.findAll();
      res.render("addPost", { tags, error });
    } catch (error) {
      res.send(error);
    }
  }

  static async postAddPost(req, res) {
    try {
      const { title, content, imgUrl, tags } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        throw new Error("Please login to create a post!");
      }

      const post = await Post.create({
        title,
        content,
        imgUrl,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        const postTags = tagArray.map((tagId) => ({
          postId: post.id,
          tagId: Number(tagId),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        await PostTag.bulkCreate(postTags);
      }

      res.redirect("/posts");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let msg = error.errors.map((el) => el.message);
        res.redirect(`/posts/add?error=${msg}`);
      } else {
        res.send(error);
      }
    }
  }

  static async postById(req, res) {
    try {
      const { id } = req.params;
      let data = await Post.findByPk(id, {
        include: [User, Tag],
      });
      res.render("postById", { data, formatDate });
    } catch (error) {
      res.send(error);
    }
  }

  static async getRegister(req, res) {
    try {
      const { error } = req.query;
      res.render("register", { error });
    } catch (error) {
      res.send(error);
    }
  }

  static async postRegister(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate input (optional but recommended)
      if (!username || !email || !password) {
        throw new Error("All fields are required!");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      await User.create({
        username,
        email,
        password: hashedPassword,
      });

      // Redirect to login
      res.redirect("/login");
    } catch (error) {
      res.redirect(`/register?error=${encodeURIComponent(error.message)}`);
    }
  }

  static async getLogin(req, res) {
    try {
      const { error } = req.query;
      res.render("login", { error });
    } catch (error) {
      res.send(error);
    }
  }

  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("Invalid email or password!");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password!");
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      res.redirect("/posts"); // or dashboard, up to you
    } catch (error) {
      res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
