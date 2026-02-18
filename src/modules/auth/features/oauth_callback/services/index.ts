import { axiosInstance } from "@/interceptors";
import type { ApiResponse } from "@/types";

export interface OAuthCallbackResponse {
    token: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        creation_timestamp: string;
        profile_image: string | null;
        onboarding_completed: boolean;
    };
}

export const getOAuthCallback = async (): Promise<OAuthCallbackResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<OAuthCallbackResponse>>(
        "/auth/login/google/me",
        {
            withCredentials: true,
        }
    );
    if (!data.data) {
        throw new Error("No se pudo obtener el perfil");
    }
    return data.data;
};
