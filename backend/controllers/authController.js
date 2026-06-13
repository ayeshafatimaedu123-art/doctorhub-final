const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabase } = require('../config/db');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });

// @desc Register
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const allowedRoles = ['patient', 'doctor'];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Check existing
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error } = await supabase.from('users').insert({
      name, email, password: hashedPassword,
      role: role || 'patient', phone
    }).select('id, name, email, role, phone, profile_image, is_active').single();

    if (error) throw error;

    // Create patient profile if role is patient
    if (user.role === 'patient') {
      await supabase.from('patients').insert({ user_id: user.id });
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await supabase.from('users').update({ refresh_token: refreshToken, last_login: new Date() }).eq('id', user.id);

    res.status(201).json({ success: true, message: 'Registration successful', token, refreshToken, user });
  } catch (error) { next(error); }
};

// @desc Login
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.is_active) return res.status(401).json({ success: false, message: 'Account deactivated' });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await supabase.from('users').update({ refresh_token: refreshToken, last_login: new Date() }).eq('id', user.id);

    const { password: _, refresh_token: __, ...safeUser } = user;
    res.json({ success: true, message: 'Login successful', token, refreshToken, user: safeUser });
  } catch (error) { next(error); }
};

// @desc Refresh Token
// @route POST /api/auth/refresh
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { data: user } = await supabase.from('users').select('id, refresh_token').eq('id', decoded.id).single();

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    const newToken = generateToken(user.id);
    res.json({ success: true, token: newToken });
  } catch (error) { next(error); }
};

// @desc Forgot Password
// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { data: user } = await supabase.from('users').select('id, name, email').eq('email', req.body.email).single();
    if (!user) return res.status(404).json({ success: false, message: 'No account with that email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expire = new Date(Date.now() + 10 * 60 * 1000);

    await supabase.from('users').update({
      reset_password_token: hashedToken,
      reset_password_expire: expire
    }).eq('id', user.id);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    res.json({ success: true, message: 'Reset link generated', resetUrl });
  } catch (error) { next(error); }
};

// @desc Reset Password
// @route POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const { data: user } = await supabase.from('users')
      .select('id').eq('reset_password_token', hashedToken)
      .gt('reset_password_expire', new Date().toISOString()).single();

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await supabase.from('users').update({
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expire: null
    }).eq('id', user.id);

    const token = generateToken(user.id);
    res.json({ success: true, message: 'Password reset successful', token });
  } catch (error) { next(error); }
};

// @desc Get Me
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc Logout
// @route POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    await supabase.from('users').update({ refresh_token: null }).eq('id', req.user.id);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};
