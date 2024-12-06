import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Validate required fields
  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Handle file uploads
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // Upload avatar to Cloudinary
  const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUploadResult || !avatarUploadResult.url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  let coverImageUploadResult = null;
  if (coverLocalPath) {
    coverImageUploadResult = await uploadOnCloudinary(coverLocalPath);
  }

  // Create the user
  const user = await User.create({
    fullName,
    avatar: avatarUploadResult.url,
    coverImage: coverImageUploadResult?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Fetch created user (exclude sensitive fields)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
