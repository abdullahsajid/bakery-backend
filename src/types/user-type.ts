interface IUser{
    username: string;
    email: string;
    password: string;
    googleId: string;
    isAdmin: {
        type: boolean;
        enum: [true, false];
        default: false;
    };
}

export default IUser;