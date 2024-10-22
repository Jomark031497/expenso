import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AppError } from "@/features/misc/misc.types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "username must be atleast 3 characters long")
    .max(256, "username must not exceed 256 characters"),

  password: z
    .string()
    .min(6, "password must be atleast 6 characters long")
    .max(256, "password must not exceed 256 characters"),
  email: z.string().email("please enter a valid email address").max(256, "email must not exceed 256 characters"),
  fullName: z.string().optional(),
});

export type SignUpUser = z.infer<typeof signUpSchema>;

export const SignUp = () => {
  const { handleSignUp } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpUser>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpUser> = async (values) => {
    try {
      await handleSignUp(values);
    } catch (error) {
      if (error && typeof error === "object") {
        const appErrors = error as AppError;
        toast.error(appErrors.message);

        if (appErrors.errors) {
          Object.keys(appErrors.errors).forEach((field) => {
            setError(field as keyof SignUpUser, {
              message: appErrors.errors[field] as string,
            });
          });
        }
      } else {
        toast.error("Sign Up failed. Something went wrong.");
      }
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded border p-6 shadow">
      <h1 className="text-2xl font-semibold">Sign Up</h1>
      <h2 className="mb-4 text-sm text-gray-500">Enter your information to create an account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Username" {...register("username")} formError={errors.username} />
        <Input label="Email" {...register("email")} formError={errors.email} />
        <Input label="Password" type="password" {...register("password")} formError={errors.password} />

        <Button type="submit" className="bg-primary hover:bg-primary/95 border-2 border-transparent text-white">
          Sign Up
        </Button>

        <p className="self-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
