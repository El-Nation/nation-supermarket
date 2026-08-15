import { Request, Response } from 'express';
import { StoreSetting } from '../models/StoreSetting';

export const getStoreSettings = async (req: Request, res: Response) => {
    try {
        const settings = await StoreSetting.getAll();
        res.json(settings);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving store settings' });
    }
};

export const updateStoreSetting = async (req: Request, res: Response) => {
    try {
        const { key, value } = req.body;
        const updated = await StoreSetting.update(key, value);
        res.json({ message: 'Setting updated successfully', setting: updated });
    } catch (e) {
        res.status(500).json({ message: 'Error updating setting' });
    }
};
