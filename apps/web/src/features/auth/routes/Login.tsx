export const Login = () => {
  return (
    <>
      <form className="max-w-sm p-4">
        <label className="flex flex-col gap-1 text-sm">
          <div>username</div>
          <input
            type="text"
            placeholder="username"
            className="rounded border-2 p-1.5 outline-none transition-all hover:border-primary/50 focus:border-primary active:border-primary"
          />
        </label>
      </form>
    </>
  );
};
