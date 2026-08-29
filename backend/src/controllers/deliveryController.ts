import { Request, Response } from 'express';
import { DeliveryZone } from '../models/DeliveryZone';

export const getDeliveryZones = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string;
        const zones = await DeliveryZone.getAll(search);
        res.json(zones);
    } catch (e) {
        res.status(500).json({ message: 'Failed to retrieve delivery zones' });
    }
};

export const getActiveDeliveryZones = async (req: Request, res: Response) => {
    try {
        const zones = await DeliveryZone.getActive();
        res.json(zones);
    } catch (e) {
        res.status(500).json({ message: 'Failed to retrieve active delivery zones' });
    }
};

export const createDeliveryZone = async (req: Request, res: Response) => {
    try {
        const { name, areas, fee } = req.body;
        const zone = await DeliveryZone.create(name, areas, fee);
        res.status(201).json(zone);
    } catch (e: any) {
        if (e.code === '23505') return res.status(400).json({ message: 'Delivery Zone specifically covering identical phrasing already exists.' });
        res.status(500).json({ message: 'Failed to create delivery zone' });
    }
};

export const updateDeliveryZone = async (req: Request, res: Response) => {
    try {
        const zone = await DeliveryZone.update(Number(req.params.id), req.body);
        res.json(zone);
    } catch (e) {
        res.status(500).json({ message: 'Failed to update delivery zone' });
    }
};

export const deleteDeliveryZone = async (req: Request, res: Response) => {
    try {
        const deleted = await DeliveryZone.delete(Number(req.params.id));
        res.json({ message: 'Successfully deleted zone', deleted });
    } catch (e) {
        res.status(500).json({ message: 'Failed to delete delivery zone' });
    }
};
