import { Request, Response } from 'express';
import offerModal from '@models/offerModel';

const getOffers = async (req: Request, res: Response) => {
  try {
    const offers = await offerModal.find();
    res.status(200).json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get offers' });
  }
};

const addOffer = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { title, discount, startDate, endDate } = req.body;

    const newOffer = new offerModal({
      title,
      discount,
      startDate,
      endDate,
    });
    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to add offer' });
  }
};

const updateOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOffer = await offerModal.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedOffer) {
      res.status(404).json({ error: 'Offer not found' });
      return;
    }
    res.status(200).json(updatedOffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update offer' });
  }
};

const softDeleteOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedOffer = await offerModal.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedOffer) {
      res.status(404).json({ error: 'Offer not found' });
      return;
    }
    res.status(200).json(deletedOffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete offer' });
  }
};

export default { getOffers, softDeleteOffer, updateOffer, addOffer };

// const router = express.Router();

// // Get a specific offer by ID
// router.get('/offers/:id', (req, res) => {
//   const offer = offers.find((o) => o.id === parseInt(req.params.id));
//   if (offer) {
//     res.json(offer);
//   } else {
//     res.status(404).send('Offer not found');
//   }
// });

// // Create a new offer
// router.post('/offers', (req, res) => {
//   const newOffer = {
//     id: offers.length + 1,
//     name: req.body.name,
//     discount: req.body.discount,
//   };
//   offers.push(newOffer);
//   res.status(201).json(newOffer);
// });

// // Update an existing offer
// router.put('/offers/:id', (req, res) => {
//   const offer = offers.find((o) => o.id === parseInt(req.params.id));
//   if (offer) {
//     offer.name = req.body.name;
//     offer.discount = req.body.discount;
//     res.json(offer);
//   } else {
//     res.status(404).send('Offer not found');
//   }
// });

// // Delete an offer
// router.delete('/offers/:id', (req, res) => {
//   const offerIndex = offers.findIndex((o) => o.id === parseInt(req.params.id));
//   if (offerIndex !== -1) {
//     offers.splice(offerIndex, 1);
//     res.status(204).send();
//   } else {
//     res.status(404).send('Offer not found');
//   }
// });

// export default router;
