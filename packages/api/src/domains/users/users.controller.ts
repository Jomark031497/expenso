import type { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service.js";
import { AppError } from "../../utils/appError.js";
import type { TimeRangeType } from "../../utils/getTimeRange.js";

export const getUsersHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await usersService.getUsers();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await usersService.getUser("id", req.params.id as string);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await usersService.createUser(req.body);
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateData = req.body;
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const data = await usersService.updateUser(req.params.id as string, updateData);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await usersService.deleteUser(req.params.id as string);
    return res.status(204).send(); // 204 for no content on successful delete
  } catch (error) {
    return next(error);
  }
};

export const getUserSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) throw new AppError(403, "Forbidden");

    const { timeRangeType, wallet_id } = req.query;

    if (!timeRangeType) throw new AppError(400, "Please provide a timeRangeType");

    const data = await usersService.getUserSummary(user.id, timeRangeType as TimeRangeType, wallet_id as string);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
