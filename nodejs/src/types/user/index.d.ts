type UserInfo = {
    uid: string,
    email: string,
    name: string,
    
}

type UserOutput = {
    uid: string,
    refreshToken: string,
    accessToken: string,
    expirationTime: number
}

export { UserInfo, UserOutput }