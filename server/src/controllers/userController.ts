import { Request, Response } from 'express';
// import { Category } from '@/types';

const login = (req: Request, res: Response) => {
  res.json({ message: 'Hello from login controller' });
};

const signup = (req: Request, res: Response) => {
  res.json({ message: 'Hello from signup controller' });
};

const getProducts = (req: Request, res: Response) => {
  res.json([
    {
      catogeryName: 'Drinks',
      catogeryId: '1',
      products: [
        {
          name: 'Chips',
          price: 35,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2022-11/Slice-9_3.png',
        },
        {
          name: 'Soda',
          price: 109,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/6807f54d-f711-49ca-9635-514ac9b72d7f.jpg?ts=1724850859',
        },
        {
          name: 'Milk',
          price: 15,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/10b8b01a-8b71-4448-becb-16d4247ef05c.jpg?ts=1707312326',
        },
        {
          name: 'Cookies',
          price: 234,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/ff0e79ab-f334-48f1-9c49-8ce74c4e2908.jpg?ts=1710154018',
        },
        {
          name: 'Juice',
          price: 10,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/363211a.jpg?ts=1690813897',
        },
        {
          name: 'Pepsi',
          price: 70,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
        },
        {
          name: 'Yogurt',
          price: 70,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
        },
        {
          name: 'Milk',
          price: 70,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
        },
      ],
    },
    {
      catogeryName: 'Dairy',
      catogeryId: '1',
      products: [
        {
          name: 'Chips',
          price: 35,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2022-11/Slice-9_3.png',
        },
        {
          name: 'Soda',
          price: 109,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/6807f54d-f711-49ca-9635-514ac9b72d7f.jpg?ts=1724850859',
        },
        {
          name: 'Milk',
          price: 15,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/10b8b01a-8b71-4448-becb-16d4247ef05c.jpg?ts=1707312326',
        },
        {
          name: 'Cookies',
          price: 234,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/ff0e79ab-f334-48f1-9c49-8ce74c4e2908.jpg?ts=1710154018',
        },
        {
          name: 'Juice',
          price: 10,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/363211a.jpg?ts=1690813897',
        },
        {
          name: 'Pepsi',
          price: 70,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
        },
        {
          name: 'Yogurt',
          price: 70,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
        },
        {
          name: 'Milk',
          price: 70,
          quantity: '100g',
          image:
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/0be0d49a-4dae-408a-8786-afae1dd05cb1.jpg?ts=1707312314',
        },
      ],
    },
  ]);
};

export default { login, signup, getProducts };
