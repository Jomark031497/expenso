import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import { AppError } from "../../utils/appError.js";
import { generateState, OAuth2RequestError } from "arctic";
import { serializeCookie, parseCookies } from "oslo/cookie";
import { envs } from "../../config/env.js";
import { getUser, createUser } from "../users/users.service.js";
import type { DiscordUser, GitHubUser } from "./auth.utils.js";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
  github,
  discord,
} from "./auth.utils.js";

export const loginUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.loginUser(req.body);

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionTokenCookie(res, token, session.expiresAt);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export const signUpUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.signUpUser(req.body);

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionTokenCookie(res, token, session.expiresAt);

    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
};

export const getAuthenticatedUserHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) throw new AppError(403, "forbidden: no session found");

    const data = await authService.getAuthenticatedUser(user.id);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const logoutUserHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const session = res.locals.session;

    if (!session) throw new AppError(403, "forbidden: no session found");

    deleteSessionTokenCookie(res);
    return res.status(200).json({ message: "logout success" });
  } catch (error) {
    return next(error);
  }
};

export const initiateGithubLoginHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });

    return res
      .appendHeader(
        "Set-Cookie",
        serializeCookie("github_oauth_state", state, {
          secure: process.env.NODE_ENV === "production", // set to false in localhost
          path: "/",
          httpOnly: true,
          maxAge: 60 * 10, // 10 min
          sameSite: "lax",
        }),
      )
      .json({ url: url.toString() });
  } catch (error) {
    return next(error);
  }
};

export const githubCallbackHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state } = req.query;
    const storedState = parseCookies(req.headers.cookie ?? "").get("github_oauth_state");

    if (!code || !state || !storedState || state !== storedState) {
      return res.status(400).json({ error: "Invalid OAuth state or code" });
    }

    const tokens = await github.validateAuthorizationCode(code.toString());
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    if (!githubUserResponse.ok) {
      throw new Error("Failed to fetch GitHub user");
    }

    const githubUser = (await githubUserResponse.json()) as GitHubUser;
    const existingUser = await getUser("githubId", githubUser.id, { returnError: false });

    if (existingUser) {
      const token = generateSessionToken();
      const session = await createSession(token, existingUser.id);
      setSessionTokenCookie(res, token, session.expiresAt);

      return res.status(200).redirect(envs.CLIENT_URL);
    }

    const createdUser = await createUser({
      githubId: githubUser.id,
      username: githubUser.login,
      email: githubUser.email,
    });

    const token = generateSessionToken();
    const session = await createSession(token, createdUser.id);
    setSessionTokenCookie(res, token, session.expiresAt);

    return res.redirect(envs.CLIENT_URL);
  } catch (error) {
    if (error instanceof OAuth2RequestError && error.message === "bad_verification_code") {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    return next(error);
  }
};

export const initiateDiscordLoginHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const state = generateState();
    const url = await discord.createAuthorizationURL(state, {
      scopes: ["identify", "email"],
    });

    // .appendHeader(
    //   "Set-Cookie",
    //   serializeCookie("github_oauth_state", state, {
    //     secure: process.env.NODE_ENV === "production", // set to false in localhost
    //     path: "/",
    //     httpOnly: true,
    //     maxAge: 60 * 10, // 10 min
    //     sameSite: "lax",
    //   }),
    // )

    return res.json({ url: url.toString() });
  } catch (error) {
    return next(error);
  }
};

export const discordCallbackHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    // const storedState = parseCookies(req.headers.cookie ?? "").get("github_oauth_state");

    if (!code) {
      return res.status(400).json({ error: "Invalid OAuth code" });
    }

    const tokens = await discord.validateAuthorizationCode(code.toString());
    const accessToken = tokens.accessToken;

    const discordUserResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!discordUserResponse.ok) {
      throw new Error("Failed to fetch Discord user");
    }

    const discordUser = (await discordUserResponse.json()) as DiscordUser;

    const existingUser = await getUser("discordId", discordUser.id, { returnError: false });

    if (existingUser) {
      const token = generateSessionToken();
      const session = await createSession(token, existingUser.id);
      setSessionTokenCookie(res, token, session.expiresAt);

      return res.status(200).redirect(envs.CLIENT_URL);
    }

    const createdUser = await createUser({
      discordId: discordUser.id,
      username: discordUser.username,
      email: discordUser.email,
    });

    const token = generateSessionToken();
    const session = await createSession(token, createdUser.id);
    setSessionTokenCookie(res, token, session.expiresAt);

    return res.redirect(envs.CLIENT_URL);
  } catch (error) {
    if (error instanceof OAuth2RequestError && error.message === "bad_verification_code") {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    return next(error);
  }
};
