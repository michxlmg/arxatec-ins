export interface ApiResponse<T = void> {
    status: number;
    message: string;
    description: string;
    timestamp: string;
    path: string;
    data?: T;
}
