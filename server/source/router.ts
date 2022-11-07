import type { NextFunction, Request, Response } from "express";
import express from "express";
import SourceCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as sourceValidator from "../source/middleware";

const router = express.Router();

/**
 * Get all sources from a freet
 *
 * @name GET /api/source/sources/:id
 *
 * @return {SourceResponse[]} - An array of sources for the freet with freetId
 * @throws {403} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/:freetId?",
  [freetValidator.isFreetExists],
  async (req: Request, res: Response) => {
    const response = await SourceCollection.findSourcesByFreet(
      req.params.freetId
    );
    res.status(200).json(response);
  }
);

/**
 * Add source to a freet
 *
 * @name POST /api/source/addSource/:id
 *
 * @param {string} source - the new source to be added
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the source is not a valid website
 */
router.post(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    sourceValidator.isValidSource,
  ],
  async (req: Request, res: Response) => {
    await SourceCollection.addSource(req.params.freetId, req.body.source);
    res.status(200).json({
      message: "You added a source successfully.",
    });
  }
);

/**
 * Remove source from a freet
 *
 * @name PUT /api/source/rmSource/:id
 *
 * @param {string} source - the source to be removed
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the source does not exist
 */
router.put(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    sourceValidator.sourceExists,
  ],
  async (req: Request, res: Response) => {
    await SourceCollection.removeSource(req.params.freetId, req.body.source);
    res.status(200).json({
      message: "You removed the source successfully.",
    });
  }
);

export { router as sourceRouter };
