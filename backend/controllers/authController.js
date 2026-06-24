const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { userModel } = require('../models');
const { AppError, hashToken } = require('../middleware');

const SALT_ROUNDS = 12;

const authController = {
  async signup(req, res, next) {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        throw new AppError('Email, username, and password are required.', 400);
      }

      if (password.length < 6) {
        throw new AppError('Password must be at least 6 characters.', 400);
      }

      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        throw new AppError('An account with this email already exists.', 409);
      }

      const existingUsername = await userModel.findByUsername(username);
      if (existingUsername) {
        throw new AppError('This username is already taken.', 409);
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await userModel.create({ email, username, passwordHash });

      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(201).json({
        data: { user, token },
        code: 201,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required.', 400);
      }

      const user = await userModel.findByEmail(email);
      if (!user) {
        throw new AppError('Invalid email or password.', 401);
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        throw new AppError('Invalid email or password.', 401);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const { password_hash, ...safeUser } = user;

      res.json({
        data: { user: safeUser, token },
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const token = req.token;
      if (!token) {
        throw new AppError('No token provided.', 401);
      }

      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        throw new AppError('Invalid token.', 401);
      }

      const tokenHash = hashToken(token);
      const expiresAt = new Date(decoded.exp * 1000);

      await require('../config/database').query(
        'INSERT INTO invalidated_tokens (token_hash, expires_at) VALUES ($1, $2)',
        [tokenHash, expiresAt]
      );

      res.json({
        data: { message: 'Logged out successfully.' },
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        throw new AppError('User not found.', 404);
      }

      res.json({
        data: user,
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
