declare namespace root.branch {
    interface userData {
        user_id: string,
        token: string,
        userName: string,
        role: string,
        validaty: string,
        refreshToken: string,
        id: string,
        emailId: string,
        guidId: string,
        expiredTime: string,
        username: string,
    }
    interface IApiConfig {
        url?: string;
        data?: any;
        headers?: IkeyValuePair<string>;
        formData?: any
    }
    interface IkeyValuePair<T> {
        [k: string]: T
    }
    interface IApiConfig {
        url?: string;
        data?: any;
        headers?: IkeyValuePair<string>;
    }
    interface IUser {
        roleCode?: string,
        status?: number,
        fname?: string,
        lname?: string,
        token?: string;
        loginAttempts?: string,
        email?: string,
        soleId?: string
    }
}
