import { AppError } from "../../utils/appError.js";
import * as transactionsService from "./transactions.service.js";
import type { Request, Response, NextFunction } from "express";

export const createTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transactionsService.createTransaction(req.body);

    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getTransactionByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) throw new AppError(403, "forbidden");

    const data = await transactionsService.getTransactionById(req.params.id as string, req.query);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getTransactionsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) throw new AppError(403, "forbidden");

    const data = await transactionsService.getTransactions(user.id, req.query);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getTransactionsByWalletIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transactionsService.getTransactionsByWalletId(req.params.walletId as string, req.query);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const updatedTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transactionsService.updateTransaction(req.params.id as string, req.body);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const deleteTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transactionsService.deleteTransaction(req.params.id as string);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
