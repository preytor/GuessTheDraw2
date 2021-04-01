export interface JwtResponse {
    dataUser:{
        id: number,
        username: string,
        email: string,
        accessToken: string,
        expiresIn: string
    }
}
