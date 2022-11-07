import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import SourceCollection from "../source/collection";
import SourceModel from "./model";

function isValidUrl(str: string) {
  let url;
  try {
    url = new URL(str);
  } catch (_: unknown) {
    return false;
  }

  return true;
}

/**
 * Checks if a source is a valid website url
 */
const isValidSource = (req: Request, res: Response, next: NextFunction) => {
  if (!isValidUrl(req.body.source)) {
    res.status(400).json({
      error: `${req.body.source} is not a valid link or url.`,
    });
    return;
  }

  next();
};

/**
 * Checks if a source exists in the sources for a freet
 */
const sourceExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const freetSources = await SourceModel.findOne({
    freetId: req.params.freetId,
  });
  if (!freetSources.sources.includes(req.body.source)) {
    res.status(400).json({
      error: "Cannot remove a source that was not originally added.",
    });
    return;
  }

  next();
};

export { isValidSource, sourceExists };
