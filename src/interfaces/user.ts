export interface UserData {
  fname : string,
  lname: string,
  plainTextPassword : string,
  passwordConfirmation ?: string
}

export interface ResponseObj {
  success: boolean,
  data ?: {},
  error ?: string,
  successMsg ?: string
  token
}
