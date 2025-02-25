export type TLogin = {
    mobileNumber?: string;
    email?: string;
    pin: string;
  };


  export type TAuthPayload = {
    _id: string
    mobileNumber: string
    accountType: string
    iat: number
    exp: number
  }
  