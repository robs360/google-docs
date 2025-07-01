import { RequestHandler } from "express";
import { userModel } from "./user.model";
import { userServices } from "./user.services";

const createUser: RequestHandler = async (req, res) => {
    try {
        const userData = req.body
        console.log(userData)
        const existingUser = await userModel.findOne({ email: userData.email });

        if (existingUser) {
            console.log("hello user has")
            res.status(400).json({
                success: false,
                message: "Email already used",
            });
        }
        else {
           
            const result = await userServices.createUserIntoDB(userData);
            console.log("hello ok")
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
    createUser,loginUser
}
