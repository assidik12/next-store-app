import { hashSync } from "bcrypt";
import { addData, retrieveDataByField } from "../../lib/firebase/service";

type userData = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role?: string;
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

    await addData("users", userData)
      .then((res) => {
        callback({ status: true, message: res.id });
      })
      .catch((err) => {
        console.log(err.message);
        callback({ status: false, message: err.message });
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

export async function SignInWithGoogle(userData: any, callback: Function) {
  const data: any = await retrieveDataByField("users", "email", userData.email);

  if (data.length <= 0) {
    userData.role = "user";

    await addData("users", userData)
      .then((res) => {
        callback({ status: true, message: res.id });
      })
      .catch((err) => {
        callback({ status: false, message: err.message });
      });
  } else {
    userData.role = data[0].role;

    callback({ status: true, data: data[0] });
  }
}
