export interface JwtResponse {
    dataUser:{
        username: string,
        email: string,
        accessToken: string,
        expiresIn: string
    }
}
