const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import { BadRequestException } from '@nestjs/common';
import loadEnv from '../configs/configuration';
import { ErrorMessages } from '../constants/message.constants';
import { pick } from 'lodash';

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
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (e) {
    console.log(e);
  }
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

export const pickUser = (user) => {
  if (!user) return {};
  return pick(user, [
    'USER_ID',
    'EMAIL',
    'START_TOUR',
    'STATUS_ACTIVE',
    'FACE_IMAGE',
    'CREATED_AT',
    'UPDATED_AT',
    'PHONE',
  ]);
};
