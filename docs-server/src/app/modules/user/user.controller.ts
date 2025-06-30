import { RequestHandler } from "express";
import { userModel } from "./user.model";
import { userServices } from "./user.services";

const createUser: RequestHandler = async (req, res) => {
    try {
        const userData = req.body
        const existingUser = await userModel.findOne({ email: userData.email });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "Email already used",
            });
        }
        else {
            const result = await userServices.createUserIntoDB(userData);
            res.status(200).json({
                success: true,
                message: "User created successfully",
                data: result,
            });
        }
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: (error as Error).message,
        });
    }
};

export const userController = {
    createUser
}
