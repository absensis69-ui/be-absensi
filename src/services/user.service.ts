import ResponseError from "../errors/response.error";
import {
  RegisterRequest,
  LoginRequest,
  UserResponse,
  UpdateRequest,
  customJwtPayload,
  toUserResponse,
} from "../models/users.interface";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  async createUser(userData: RegisterRequest): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const datatoCreate = {
      ...userData,
      password: hashedPassword,
    };
    const newUser = await prisma.user.create({
      data: datatoCreate,
    });
    return toUserResponse(newUser);
  }

  async loginUser(userData: LoginRequest): Promise<UserResponse> {
    const isEmailReady = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!isEmailReady) {
      throw new ResponseError(400, "belum terdaftar");
    }

    const passwordMatched = await bcrypt.compare(
      userData.password,
      isEmailReady.password
    );
    if (!passwordMatched) {
      throw new ResponseError(400, "email atau password salah");
    }

    const token = jwt.sign(
      {
        id: isEmailReady.id,
        name: isEmailReady.name,
        email: isEmailReady.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    const userResponsedata = {
      status: 200,
      data: {
        email: isEmailReady.email,
        token: token,
      },
    };

    return userResponsedata;
  }

  async getUser(user: customJwtPayload): Promise<UserResponse> {
    const userlogin = await prisma.user.findUnique({
      where: { email: user.email },
      select: { email: true, name: true },
    });

    if (!userlogin) {
      throw new ResponseError(404, "User tidak ditemukan setelah login.");
    }
    const userResponse: UserResponse = {
      status: 200,
      data: {
        email: userlogin.email,
      },
    };
    return userResponse;
  }

  async updateUser(
    userFromToken: customJwtPayload,
    updatePayload: UpdateRequest
  ): Promise<UserResponse> {
    const dataToUpdate = Object.fromEntries(
      Object.entries(updatePayload).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(dataToUpdate).length === 0) {
      throw new ResponseError(
        400,
        "Tidak ada data yang dikirim untuk diupdate."
      );
    }
    const userToUpdate = await prisma.user.findUnique({
      where: {
        email: userFromToken.email,
      },
    });
    if (!userToUpdate) {
      throw new ResponseError(400, "email atau password salah");
    }
    const userUpdate = await prisma.user.update({
      where: {
        email: userFromToken.email,
      },
      data: dataToUpdate,
      select: { id: true, email: true, name: true, phoneNumber: true },
    });
    const response: UserResponse = {
      status: 200,
      data: {
        email: userUpdate.email,
      },
    };
    return response;
  }

  async deleteUser(userData: customJwtPayload) {
    const userToUpdate = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (!userToUpdate) {
      throw new ResponseError(400, "email atau password salah");
    }

    const userDelete = await prisma.user.delete({
      where: { email: userData.email },
    });
    return { status: 200, data: "sukses hapus user" };
  }
}

export default new UserService();
