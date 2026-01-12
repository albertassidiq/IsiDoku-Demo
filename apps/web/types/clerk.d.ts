export { }

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            isPegawai2172?: string
        }
    }
}
