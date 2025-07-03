import express from 'express'
import { userRoutes } from '../app/modules/user/user.routes';
import { documentRoutes } from '../app/modules/document/document.routes';

const router = express.Router()
const modulesRouter = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/document',
        route: documentRoutes
    }
];

modulesRouter.forEach((route) => router.use(route.path, route.route));
export default router;
