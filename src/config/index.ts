import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  // Admin credentials
  admin_name: process.env.ADMIN_NAME,
  admin_pin: process.env.ADMIN_PIN,
  admin_mobileNumber: process.env.ADMIN_MOBILE_NUMBER,
  admin_email: process.env.ADMIN_EMAIL,
  admin_nid: process.env.ADMIN_NID,
  admin_accountType: process.env.ADMIN_ACCOUNT_TYPE,
  admin_status: process.env.ADMIN_STATUS,
};