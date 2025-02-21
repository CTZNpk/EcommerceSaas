import { useState, FormEvent, ChangeEvent } from "react";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in with:", email, password);
    } else {
      if (password === confirmPassword) {
        console.log("Signing up with:", email, password);
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary bg-p rounded-lg p-8 shadow-lg max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-light mb-8 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <div className="mb-4">
          <label className="block text-light mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 rounded bg-light text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-light mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 rounded bg-light text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        {!isLogin && (
          <div className="mb-6">
            <label className="block text-light mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 rounded bg-light text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-accent text-light py-2 rounded hover:bg-opacity-90 transition duration-200"
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p className="text-light mt-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="text-accent hover:underline focus:outline-none"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
