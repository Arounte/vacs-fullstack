import { authService } from "@/domain/auth/service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ status: false, reason: "method_not_allowed" });
    }

    try {
        const user = await authService.login(req, res);

        return res.status(200).json({ status: true, user });
    } catch (error) {
        return res
            .status(200)
            .json({ status: false, reason: (error as Error).message });
    }
}
