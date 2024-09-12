import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginUser } from "@/features/auth/handlers/loginUser";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "username must be atleast 3 characters long")
    .max(256, "username must not exceed 256 characters"),

  password: z
    .string()
    .min(6, "password must be atleast 6 characters long")
    .max(256, "password must not exceed 256 characters"),
});

export type LoginUser = z.infer<typeof loginSchema>;

export const Login = () => {
  const { handleSetUser } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginUser> = async (values) => {
    try {
      const userData = await loginUser(values);
      handleSetUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        setError("username", {
          message: error.message,
        });
        setError("password", {
          message: error.message,
        });
        toast.error(error.message);
      } else {
        toast.error("login failed. something went wrong");
      }
    }
  };

  return (
    <>
      <div className="flex max-w-md flex-col gap-2 rounded border p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <h2 className="mb-4 text-sm text-gray-500">Enter your credentials below to login to your account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Username" {...register("username")} formError={errors.username} />
          <Input label="Password" type="password" {...register("password")} formError={errors.password} />

          <Link to="#" className="text-sm underline">
            Forgot your Password?
          </Link>

          <Button type="submit" className="border-2 border-transparent bg-primary text-white hover:bg-primary/95">
            Login
          </Button>

          <Button type="button" className="border-2 hover:bg-gray-100">
            Login with Github
          </Button>

          <p className="self-center text-sm">
            Don't have an account?{" "}
            <Link to="/auth/sign-up" className="underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};
