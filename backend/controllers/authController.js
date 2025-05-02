import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { sendMail } from '../utils/mailer.js';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function signup(req, res) {
  const {
    name, email, phone,
    companyName, companyEmail, companyAddress,
    password, confirmPassword
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    const token = uuidv4();
    const salt  = await bcrypt.genSalt(10);
    const hash  = await bcrypt.hash(password, salt);

    const user = new User({
      name, email, phone,
      companyName, companyEmail, companyAddress,
      password: hash,
      confirmationToken: token
    });
    await user.save();

    // send confirmation link
    const link = `${process.env.FRONTEND_URL}/confirm?token=${token}`;
    await sendMail({
      to: email,
      subject: 'Please confirm your account',
      html: `<p>Hi ${name},</p>
             <p>Click <a href="${link}">here</a> to confirm your account.</p>`
    });

    res.status(201).json({ msg: 'Signup successful—check your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}


export async function confirmEmail(req, res) {
  const { token } = req.query;
  try {
    const user = await User.findOne({ confirmationToken: token });
    if (!user) return res.status(400).send('Invalid token');

    user.isConfirmed = true;
    user.confirmationToken = undefined;
    await user.save();

    // Send welcome email
    await sendMail({
      to: user.email,
      subject: 'Welcome to MyApp!',
      html: `<p>Congrats ${user.name}, your account is now active.</p>`
    });

    // Redirect to login page
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isConfirmed) {
      return res.status(400).json({ msg: 'Invalid credentials or email not confirmed' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1h
    });
    res.json({ msg: 'Logged in' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

// Google OAuth: step 1, redirect to Google
export function googleAuth(req, res) {
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent',
  });
  res.redirect(url);
}

// Google OAuth: callback
export async function googleCallback(req, res) {
  const { code } = req.query;
  try {
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();

    let user = await User.findOne({ email });
    const isNew = !user;
    if (!user) {
      user = new User({
        name,
        email,
        password: uuidv4(), // dummy
        isConfirmed: true,
        googleTokens: {
          access: tokens.access_token,
          refresh: tokens.refresh_token,
          expiryDate: tokens.expiry_date,
        }
      });
      await user.save();
    } else {
      // store/refresh tokens
      user.googleTokens = {
        access: tokens.access_token,
        refresh: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
      };
      await user.save();
    }

    // welcome email on first Google signup
    if (isNew) {
      await sendMail({
        to: email,
        subject: 'Welcome via Google!',
        html: `<p>Hi ${name}, welcome to MyApp.</p>`
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Google auth error');
  }
}

