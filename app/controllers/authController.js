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

// POST VERIFY
const verify = async (req, res) => {
  const rules = joi.object({
    email: joi.string().trim().email().required().label("Email"),
    verify_code: joi.string().trim().required().label("Verification Code"),
  });
  const { error, value } = rules.validate(req.body);
  if (error) return res.status(400).send(error);
  const isUser = await User.findOne({
    where: {
      email: value.email,
    },
  });
  if (!isUser) return res.status(404).send("User not found.");

  if (isUser && isUser.verified)
    return res.status(400).send("User already verified!");

  if (isUser.verify_code !== value.verify_code)
    return res.status(400).send("Invalid verification code!");
  isUser.verify_code = null;
  isUser.verified = true;
  await isUser.save();
  res.send(isUser);
};

//POST REGISTER
const register = async (req, res) => {
  const rules = joi.object({
    name: joi.string().label("Name").required().trim(),
    email: joi.string().trim().email().required().label("Email"),
    phone: joi.string().trim().required().label("Phone Number"),
    password: joi.string().trim().min(6).required().label("Password"),
    confirm_password: joi.ref("password"),
  });
  const { error, value } = rules.validate(req.body);
  if (error) res.status(400).send(error);

  const isUser = await User.findOne({
    where: {
      [Op.or]: [
        {
          email: value.email,
        },
        {
          phone: value.phone,
        },
      ],
    },
  });

  if (isUser && isUser.email === value.email)
    res.status(400).send("Email already Exits!");
  if (isUser && isUser.phone === value.phone)
    res.status(400).send("Phone Number already Taken!");

  const newUser = await User.create({
    name: value.name,
    email: value.email,
    phone: value.phone,
    password: bcryptjs.hashSync(value.password, bcryptjs.genSaltSync(10)),
    verify_code: _.random(111111, 999999),
  });

  const company = {
    name: "Saxon",
    email: "registration@saxon.com",
  };

  //sending mail
  //loading template
  const template = verifyEmailTemplate({ receiver: newUser, company });
  const mailData = {
    receiver: newUser,
    from: company,
    subject: "Account Verification",
    template,
  };
  doLater(mailer.send(mailData));

  res.send(newUser);
};

//POST LOGIN
const login = async (req,res) => {
    
  //Validate here

  const validationRules = joi.object({
    username: joi.string().label("Email/Password").required(),
    password: joi.string().label("Password").required(),
  });

  const { error, value } = validationRules.validate(req.body);

  if (error) return res.status(400).send(error);

  const isUser = await User.findOne({
    where: {
      [Op.or]: [
        {
          email: value.username,
        },
        {
          phone: value.username,
        },
      ],
    },
  });

  if (!isUser) return res.status(404).send("User not found.");
  if (!isUser.verified) return res.status(403).send("User not verified");
  if (!bcryptjs.compareSync(value.password, isUser.password))
    return res.status(401).send("Incorrect password!");

  const token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET);
  res.send({
    token,
    user: isUser,
  });
};

module.exports = { login, register, verify, profile };
