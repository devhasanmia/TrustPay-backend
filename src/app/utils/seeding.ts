import config from "../../config";
import User from "../modules/user/user.model";

export const seed = async () => {
    try {
      const admin = await User.findOne({
        accountType: 'Admin',
      });
      if (!admin) {
        console.log('Seeding started...');
        await User.create({
            name: config.admin_name,
            pin: config.admin_pin,
            mobileNumber: config.admin_mobileNumber,
            email: config.admin_email,
            accountType: config.admin_accountType,
            nid: config.admin_nid,
            balance: 999999999999999999999999999999,
            status: config.admin_status,
        });
        console.log('Seeding completed...');
      }
    } catch (error) {
      console.log('Error in seeding', error);
    }
  };