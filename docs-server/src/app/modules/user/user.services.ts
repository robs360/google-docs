import { TUser } from "./user.interface"
import { userModel } from "./user.model"
import jwt from 'jsonwebtoken';
const createUserIntoDB=async (payload:TUser)=>{
    const result=await userModel.create(payload)
    return result
}

const loginuserIntoDB = async (payload: Partial<TUser>) => {
    const { email, password } = payload;
    const result = await userModel.findOne({ email: email });
    
    if (!result) {
        return {
            success: false,
            message: 'User not found'
        };
    }

    if (result.password === password) {
        const token = jwt.sign(
            { name: result.name, image: result.image, email: result.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );
        return {
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: result._id,
                name: result.name,
                email: result.email,
                image: result.image
            }
        };
    }

    return {
        success: false,
        message: 'Invalid password'
    };
};
export const userServices={
    createUserIntoDB,loginuserIntoDB
}