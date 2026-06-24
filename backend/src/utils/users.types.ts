
//*Interface CreateUserData

export interface CreateUserData {
  fullName: string;
  userName: string;
  email: string;
  mobileNo?: string;
  password: string;
}

export interface CreateUserDataRepo {
  fullName: string;
  userName: string;
  email: string;
  mobileNo?: string;
  passwordHash: string;
}


export interface User {
  id: number;

  full_name: string | null;

  user_name: string;

  email: string;

  mobile_no: string | null;

  password_hash: string;

  date_of_birth: Date | null;

  email_verified_at: Date | null;

  role: string;

  profile_image: string | null;

  bio: string | null;

  created_at: Date;

  updated_at: Date;
}

export interface loginData {
  email:string;
  password:string
}