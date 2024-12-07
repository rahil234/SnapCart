import couponModel from '@/models/couponModel';
import userModel from '@models/userModel';

const validateCoupon = async (couponCode: string, userId: string) => {
  const coupon = await couponModel.findOne({ code: couponCode });
  console.log(coupon);
  if (!coupon) {
    return { error: 'Coupon not found' };
  }
  const currentDate = new Date();
  if (
    coupon.status !== 'Active' ||
    coupon.startDate > currentDate ||
    coupon.endDate < currentDate
  ) {
    return { error: 'Coupon is not valid at this time' };
  }

  const user  = await userModel.findById(userId);

  if (!user) {
    return { error: 'User not found' };
  }


  switch (coupon.applicableTo) {
    case 'All':
      break;
    case 'New':
      if (user.createdAt > coupon.startDate) {
        return { error: 'Coupon is not valid for new users' };
      }
      break;
    case 'Existing':
      if (user.createdAt < coupon.startDate) {
        return { error: 'Coupon is not valid for existing users' };
      }
      break;
    case 'Exclusive':
      if (user.createdAt > coupon.startDate) {
        return { error: 'Coupon is not valid for new users' };
      }
      if (user.createdAt < coupon.startDate) {
        return { error: 'Coupon is not valid for existing users' };
      }
      break;
  }

  return { coupon };
};

export default validateCoupon;
