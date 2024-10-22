import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { __SERVER_URL__ } from "@/config/constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";
import { FaGithub, FaDiscord } from "react-icons/fa";

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
  const { handleLogin } = useAuth();

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
      await handleLogin(values);
    } catch (error) {
      if (error instanceof Error) {
        setError("username", { message: error.message });
        setError("password", { message: error.message });
        toast.error(error.message);
      } else {
        toast.error("login failed. something went wrong");
      }
    }
  };

  const loginWithOAuth = async (provider: "discord" | "github") => {
    try {
      const url = new URL(`/api/auth/login/${provider}`, __SERVER_URL__);
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      return toast.error(`Login with ${provider} failed. please contact administrator`);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded border p-6 shadow">
      <h1 className="text-2xl font-semibold">Login</h1>
      <h2 className="mb-4 text-sm text-gray-500">Enter your credentials below to login to your account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Username" {...register("username")} formError={errors.username} />
        <Input label="Password" type="password" {...register("password")} formError={errors.password} />

        <Link to="#" className="text-sm underline">
          Forgot your Password?
        </Link>

        <Button type="submit" variant="contained">
          Login
        </Button>

        <p className="self-center text-sm">
          Don't have an account?{" "}
          <Link to="/auth/sign-up" className="underline">
            Sign Up
          </Link>
        </p>
      </form>

      <hr className="my-4" />

      <div className="flex flex-col gap-4">
        <Button
          onClick={() => loginWithOAuth("github")}
          variant="outlined"
          className="flex items-center justify-center gap-2"
        >
          <FaGithub size="20" />
          Login using Github
        </Button>

        <Button
          onClick={() => loginWithOAuth("discord")}
          variant="outlined"
          className="flex items-center justify-center gap-2"
        >
          <FaDiscord size="20" />
          Login using Discord
        </Button>
      </div>
    </div>
  );
};
