import { RequestHandler } from "express";
import { userModel } from "./user.model";
import { userServices } from "./user.services";
import jwt from 'jsonwebtoken';
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
            let token = '';
            if (result) {
                token = jwt.sign(
                    { name: result.name, image: result.image, email: result.email },
                    process.env.JWT_SECRET as string,
                    { expiresIn: '7d' }
                );
            }
            res.status(200).json({
                success: true,
                message: "User created successfully",
                user: {
                    id: result._id,
                    name: result.name,
                    email: result.email,
                    image: result.image
                },
                token: token
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

const loginUser: RequestHandler = async (req, res) => {
    try {
        const userData = req.body;
        const result = await userServices.loginuserIntoDB(userData);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err
        });
    }
};
export const userController = {
    createUser, loginUser
}
