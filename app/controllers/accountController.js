const { Op } = require("sequelize");
const { user: User } = require("../models");
const joi = require("joi");
const bcryptjs = require("bcryptjs");
const _ = require("lodash");
const { template: verifyEmailTemplate } = require("../templates/verifyEmail");
const mailer = require("../helpers/mailer");
const { doLater } = require("../helpers/worker");
const jwt = require("jsonwebtoken");

//GET PROFILE
const profile = async (req, res) => {
  const isUser = await User.findByPk(req.user.id,{
      attributes:['name','email','phone']
  });

  let user = isUser.dataValues
  user["scopes"]= "*"

  return res.send(user);
};

const updateProfile=async (req,res)=>{}
const changePassword=async (req,res)=>{}


module.exports = {profile,updateProfile,changePassword}