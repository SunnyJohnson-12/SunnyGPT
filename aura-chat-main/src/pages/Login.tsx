import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, BotMessageSquare } from "lucide-react";

// For decoding the JWT token returned by Google
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    const decoded = decodeJwt(token);
    if (decoded) {
      login({
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });
      navigate("/");
    } else {
      setError("Failed to verify Google completely. Please try again.");
    }
  };

  const handleFailure = () => {
    setError("Google Sign-in failed or was cancelled.");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md p-8 bg-card border border-border/50 rounded-2xl shadow-xl z-10 animate-fade-in mx-4 flex flex-col items-center">
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
          <BotMessageSquare className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-center text-card-foreground flex items-center gap-2">
          Sunny's GPT <Sparkles className="w-5 h-5 text-primary" />
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Sign in to your account to continue your conversations and explore the AI.
        </p>

        {error && (
          <div className="w-full p-3 mb-6 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="w-full flex justify-center pb-4">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleFailure}
            theme="filled_blue"
            size="large"
            shape="rectangular"
            text="continue_with"
            width="300"
          />
        </div>
        
        {/* Placeholder Login for testing if User has no Client ID yet */}
        <div className="mt-6 w-full pt-6 border-t border-border/50 flex flex-col items-center">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Testing mode? Bypass Google Auth
          </p>
          <button 
            onClick={() => login({ email: "tester@example.com", name: "Guest User", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" })}
            className="text-xs px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
