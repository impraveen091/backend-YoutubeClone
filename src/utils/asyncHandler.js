//method 1

const asyncHandler = (asynchandler) => {
  (req, res, next) => {
    Promise.resolve(asynchandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

//method 2

// const asychandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json({ success: false, message: error.message });
//   }
// };
