import { hashSync } from "bcrypt";
import { addData, retrieveDataByField } from "../../lib/firebase/service";

export type userData = {
  id?: string;
  email: string;
  password: string;
  fullname: string;
  phone?: string;
  role?: string;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
};

export async function SignUp(userData: userData, callback: Function) {
  const data = await retrieveDataByField("users", "email", userData.email);
  if (data.length > 0) {
    callback({ statis: false, message: "Email already exists" });
  } else {
    if (!userData.role) {
      userData.role = "user";
    }

    userData.password = await hashSync(userData.password, 10);
    userData.created_at = new Date();
    userData.updated_at = new Date();
    userData.image = "";

    await addData("users", userData, (res: any) => {
      if (res.status) {
        callback({ status: true, data: res.path.replace("users/", "") });
      } else {
        callback({ status: false, message: res.message });
      }
    });
  }
}

export async function signIn(email: string) {
  const data = await retrieveDataByField("users", "email", email);
  if (data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

export async function SignInWithGoogle(userData: userData, callback: Function) {
  const data: any = await retrieveDataByField("users", "email", userData.email);

  if (data.length <= 0) {
    userData.role = "user";
    userData.created_at = new Date();
    userData.updated_at = new Date();
    userData.password = "";

    await addData("users", userData, (res: any) => {
      if (res.status) {
        callback({ status: true, data: { ...userData, id: res.path.replace("users/", "") } });
      } else {
        callback({ status: false, message: res.message });
      }
    });
  } else {
    userData.role = data[0].role;

    callback({ status: true, data: data[0] });
  }
}
