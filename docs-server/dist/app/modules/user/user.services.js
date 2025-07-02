"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const user_model_1 = require("./user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.create(payload);
    return result;
});
const loginuserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const result = yield user_model_1.userModel.findOne({ email: email });
    if (!result) {
        return {
            success: false,
            message: 'User not found'
        };
    }
    if (result.password === password) {
        const token = jsonwebtoken_1.default.sign({ name: result.name, image: result.image, email: result.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
});
exports.userServices = {
    createUserIntoDB, loginuserIntoDB
};
