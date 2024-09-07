import type { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service.js";

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
    const data = await usersService.getUserById(<string>req.params.id, {});
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await usersService.createUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await usersService.updateUser(<string>req.params.id, req.body);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await usersService.deleteUser(<string>req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
