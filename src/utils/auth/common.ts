const ldapjs = require('ldapjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('validate-azure-ad-token').default;
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

import { BadRequestException } from '@nestjs/common';
import { ldapOptions } from '../constants/auth.constants';
import { ErrorMessages } from '../constants/message.constants';
import loadEnv from '../configs/configuration';

const env = loadEnv();

export const checkPassword = async (
  password: string,
  userPassword: string,
  isValidation = false,
) => {
  const isMatch = await bcrypt.compare(password, userPassword);
  if (!isMatch && isValidation) {
    throw new BadRequestException(ErrorMessages.LOGIN_FAIL);
  }
  return isMatch;
};

export const HashPassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    return passwordHash;
  } catch (e) {
    console.log(e);
  }
};

export const generateActiveToken = (payload) => {
  return jwt.sign(payload, `${env.ACTIVE_TOKEN_SECRET}`, {
    expiresIn: '5m',
  });
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, `${env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: env.ACCESS_TOKEN_EXPIRE_DURATION,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, `${env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: env.REFRESH_TOKEN_EXPIRE_DURATION,
  });
};
export const generateRefreshTokenShortExpiration = (payload) => {
  return jwt.sign(payload, `${env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: env.REFRESH_TOKEN_EXPIRE_DURATION_SHORT,
  });
};

export const generateAuthenticateToken = (payload) => {
  return jwt.sign(payload, `${env.AUTHENTICATE_TOKEN_SECRET}`, {
    expiresIn: '30s',
  });
};

export const verifyTokenFacebook = async (
  userID: string,
  accessToken: string,
) => {
  const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,first_name,last_name,middle_name,email,picture&access_token=${accessToken}`;
  const data = await fetch(URL)
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
  return data;
};

export const verifyTokenWithGoogle = async (tokenId: string) => {
  try {
    const client = new OAuth2(env.MAILING_SERVICE_CLIENT_ID);
    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: env.MAILING_SERVICE_CLIENT_ID,
    });
    if (!verify?.payload?.email_verified) {
      throw new BadRequestException(ErrorMessages.FAIL_EMAIL_VERIFY);
    }
    return verify.payload;
  } catch (e) {
    console.log('verifyTokenWithGoogle', e);
    return null;
  }
};

export const extractTokenFromHeader = (request) => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export const parseJwtAdmin = (token) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

export const parseJwt = (token) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};
