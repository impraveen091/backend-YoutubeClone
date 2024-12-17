import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "ok" });
  const { fullName, email, username, password } = req.body;
  console.log("All Imputs:", fullName, email, username, password);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User with this email and password already exist ");
  }

  const avatarlocalpath = req.files?.avatar[0]?.path;
  const coverimagelocalpath = req.files?.coverImage[0]?.path;

  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar file is required ");
  }

  const avatar = await uploadOnCloudinary(avatarlocalpath);
  const covarimage = await uploadOnCloudinary(coverimagelocalpath);

  if (!avatar) throw new ApiError(400, "Avatar file is required ");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: covarimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (createdUser) {
    throw new ApiError(500, "Somrthing went wrong while registering the user ");
  }
});

export { registerUser };
