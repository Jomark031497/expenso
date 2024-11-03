import { AppError } from "../../utils/appError.js";
import * as walletsService from "./wallets.service.js";
import type { Request, Response, NextFunction } from "express";

export const getWalletsHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) throw new AppError(403, "forbidden");

    const data = await walletsService.getWallets(user.id);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getWalletByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await walletsService.getWalletById(req.params.id as string);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const createWalletHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await walletsService.createWallet(req.body);

    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

export const updateWalletHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateData = req.body;
    if (!Object.keys(updateData).length) return res.status(400).json({ message: "No data provided for update" });

    const data = await walletsService.updateWallet(req.params.id as string, updateData);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const deleteWalletHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await walletsService.deleteWallet(req.params.id as string);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
