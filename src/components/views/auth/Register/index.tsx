import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import AUthService from "@/services/auth";
import AuthLayout from "@/components/layouts/AuthLayout";

const RegisterView = ({ setToaster }: { setToaster: Dispatch<SetStateAction<{}>> }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const handlesubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      email: form.email.value,
      password: form.password.value,
    };
    try {
      const result = await AUthService.registerAccouunt(data);

      if (result.status === 200) {
        setLoading(false);
        form.reset();

        setToaster({ message: "Register success", varian: "Success" });
        push("/auth/login");
      }
    } catch (error) {
      form.reset();
      setLoading(false);
      setToaster({ message: "Register failed", varian: "Error" });
    }
  };
  return (
    <AuthLayout setToaster={setToaster} link="/auth/login" description="have an account?" linkTitle="sign in" title="Register">
      <form onSubmit={handlesubmit} className="w-full flex flex-col gap-4 items-center justify-center rounded-xl mb-5">
        <Input name="fullname" label="Fullname" type="text" placeholder="masukkan nama lengkap" />
        <Input name="email" label="Email" type="email" placeholder="masukkan email" />
        <Input name="password" label="Password" type="password" placeholder="masukkan password" />
        <Button type="submit" varian="primary" className={"w-2/4 mb-2.5 p-2"}>
          {loading ? "loading..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;
