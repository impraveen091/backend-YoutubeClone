import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({ message: "ok" });
  const { fullName, email, username, password } = req.body;
  console.log("All Imputs:", fullName, email, username, password);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User with this email and username already exist ");
  }

  const avatarlocalpath = req.files?.avatar[0]?.path;
  const coverimagelocalpath = req.files?.coverImage[0]?.path;
  console.log("paths", avatarlocalpath, coverimagelocalpath);

  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar file is required ");
  }

  const avatar = await uploadOnCloudinary(avatarlocalpath);
  console.log("avatar", avatar);
  const covarimage = await uploadOnCloudinary(coverimagelocalpath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required ");
  }

  const user = await User.create({
    fullName,
    avatar: avatar?.uploadResult?.url,
    coverImage: covarimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user ");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export { registerUser };
