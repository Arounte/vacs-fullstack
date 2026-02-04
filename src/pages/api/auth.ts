import { authService } from '@/domain/auth/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    POST: async (req, res) => {
        const user = await authService.login(req, res);

        return res.status(200).json({ status: true, user });
    },
});
