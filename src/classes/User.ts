import crypto from 'crypto'
import db from '../postgresql/db'
import { UserData } from '../interfaces/user'
// require('dotenv').config()

export default class User {
  email: string
  private passwordHash ?: string
  private salt ?: string | Buffer
  constructor (email: string) {
    this.email = email
  }

  // arrow functions keep 'this' reference on reassignment
  addOne = (userData : UserData) => {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.passwordHash = this.generateHash(userData.plainTextPassword, this.salt)

    db(
      'INSERT INTO USERS (fname, lname, email, passwordhash, salt) VALUES ($1,$2,$3,$4,$5)',
      [userData.fname, userData.lname, this.email, this.passwordHash, this.salt]
    )
  }

  private generateHash = (password: string, salt : Buffer | string) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  }

  validatePassword = async (attemptedPassword : string, savedHash : string, savedSalt) => {
    return this.generateHash(attemptedPassword, savedSalt) === savedHash
  }
}
