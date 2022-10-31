import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BookmarkCollection from '../bookmark/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a bookmark with bookmarkId in req.params exists
 */
const isBookmarkExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.bookmarkId);
  const bookmark = validFormat ? await BookmarkCollection.findOne(req.params.bookmarkId) : '';
  if (!bookmark) {
    res.status(404).json({
      error: {
        bookmarkNotFound: `Bookmark with bookmark ID ${req.params.bookmarkId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.body exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const {freetId} = req.body;
  const validFormat = Types.ObjectId.isValid(freetId);
  const freet = validFormat ? await FreetCollection.findOne(freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the creator of the bookmark whose bookmarkId is in req.params
 */
const isValidBookmarkModifier = async (req: Request, res: Response, next: NextFunction) => {
  const bookmark = await BookmarkCollection.findOne(req.params.bookmarkId);
  const userId = bookmark.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' bookmarks.'
    });
    return;
  }

  next();
};

export {
  isBookmarkExists,
  isFreetExists,
  isValidBookmarkModifier
};
