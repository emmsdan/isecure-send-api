import { check, validationResult, body } from "express-validator";
import { EXPIRES_IN, TOTAL_DOWNLOADS_ALLOWED } from "./constant";

/**
 * Got this expresson from stackoverflow.
 * https://stackoverflow.com/a/32439793
 */
const isName = value => {
  // eslint-disable-next-line no-misleading-character-class
  const reg = /^[a-zA-Z {1,2}]+$/;
  return reg.test(value);
};
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

export default {
  form: [
    check("sender_email").isEmail(),
    check("receiver_email").isEmail(),
    body("sender_name", "Enter a valid name.").custom(value => {
      if (!isName(value)) {
        throw new Error("Invalid Name supplied.");
      }
      return true;
    }),
    check("expires_in").isIn(EXPIRES_IN),
    check("downloads_allowed").isIn(TOTAL_DOWNLOADS_ALLOWED),
    validateRequest
  ],
  url: [
    check("email")
      .exists()
      .isEmail(""),
    validateRequest
  ]
};
