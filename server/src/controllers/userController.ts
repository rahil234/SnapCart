import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import otpModel from '../models/otpModel';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'snapcart.website@gmail.com',
    pass: 'blik rpge njhj aose',
  },
});

const products = [
  {
    categoryName: 'Drinks',
    categoryId: '1',
    products: [
      {
        id: '1',
        name: 'Milk',
        price: 70,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
      },
      {
        id: '2',
        name: 'Chips',
        price: 35,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2022-11/Slice-9_3.png',
      },
      {
        id: '3',
        name: 'Soda',
        price: 109,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/6807f54d-f711-49ca-9635-514ac9b72d7f.jpg?ts=1724850859',
      },
      {
        id: '4',
        name: 'Milk',
        price: 15,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/10b8b01a-8b71-4448-becb-16d4247ef05c.jpg?ts=1707312326',
      },
      {
        id: '5',
        name: 'Pepsi',
        price: 70,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
      },
      {
        id: '6',
        name: 'Milk',
        price: 70,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
      },
      {
        id: '7',
        name: 'Cookies',
        price: 234,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/ff0e79ab-f334-48f1-9c49-8ce74c4e2908.jpg?ts=1710154018',
      },
      {
        id: '8',
        name: 'Juice',
        price: 10,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/363211a.jpg?ts=1690813897',
      },
      {
        id: '9',
        name: 'Yogurt',
        price: 70,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
      },
    ],
  },
  {
    categoryName: 'Dairy',
    categoryId: '2',
    products: [
      {
        id: '10',
        name: 'Soda',
        price: 109,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/6807f54d-f711-49ca-9635-514ac9b72d7f.jpg?ts=1724850859',
      },
      {
        id: '11',
        name: 'Chips',
        price: 35,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2022-11/Slice-9_3.png',
      },
      {
        id: '12',
        name: 'Cookies',
        price: 234,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/ff0e79ab-f334-48f1-9c49-8ce74c4e2908.jpg?ts=1710154018',
      },
      {
        id: '13',
        name: 'Juice',
        price: 10,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/363211a.jpg?ts=1690813897',
      },
      {
        id: '14',
        name: 'Pepsi',
        price: 70,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
      },
      {
        id: '15',
        name: 'Milk',
        price: 15,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/10b8b01a-8b71-4448-becb-16d4247ef05c.jpg?ts=1707312326',
      },
      {
        id: '16',
        name: 'Yogurt',
        price: 70,
        quantity: '100g',
        image:
          'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
      },
    ],
  },
];

const login = (req: Request, res: Response) => {
  try {
    console.log(req.body);

    if (!req.body.email || !req.body.password) {
      res.status(401).json({ message: 'Email and password required' });
    } else {
      res
        .status(200)
        .json({ token: 'JWTToken', message: 'success', ...req.body });
    }
  } catch (err) {
    console.log(err);
  }
};

const signup = (req: Request, res: Response) => {
  res.json({ message: 'Hello from signup controller' });
};

const getProducts = (req: Request, res: Response) => {
  res.json(products);
};

const getProduct = (req: Request, res: Response) => {
  const productId = req.params.productId;
  let foundProduct = null;

  products.forEach((category) =>
    category.products.forEach((product) => {
      if (product.id === productId) {
        foundProduct = product;
      }
    })
  );

  if (foundProduct) {
    res.json(foundProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const sendOtp = async (req: Request, res: Response) => {
  try {
    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();
    const email = 'rahil234@gmail.com';
    const newOtp = await otpModel.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    newOtp.updateOne();

    const mailOptions = {
      to: 'rahilsardar234@gmail.com',
      subject: 'OTP for Snapcart Login',
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #FFDC02; color:#000000; padding: 20px; border-radius: 10px;">
      <h1 style="color: #000000; font-size:35px;">Welcome to SnapCart</h1>
      <p>Use the following OTP to verify your email:</p>
      <h2 style="color: #198C05; line-width: 1.5; font-size:35px">${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Thank you,</p>
      <p>The Snapcart Team</p>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ message: `OTP ${otp}` });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const otpUser = await otpModel.findOne({
      email: req.body.email,
    });
    const otp: string | null = otpUser ? otpUser.otp : null;
    console.log(otp);
    if (otp === req.body.otp) {
      res.json({ message: 'OTP verified' });
      console.log('OTP verified', otp, ':', req.body.otp);
    } else {
      console.log('Wrong Otp', otp, ':', req.body.otp);
      throw 'Invalid OTP';
    }
  } catch (err) {
    res.status(404).json({ message: err });
    console.log(err);
  }
};

export default { login, signup, getProducts, getProduct, sendOtp, verifyOtp };
