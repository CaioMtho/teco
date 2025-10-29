import { LoginForm } from '../components/login-form';
import { SignupForm } from '../components/signup-form';

export default function Page() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
        <div className="flex-1 flex justify-center">
          <LoginForm />
        </div>

        <div className="hidden lg:flex items-center">
          <div className="w-px h-96 bg-gray-300"></div>
        </div>

        <div className="lg:hidden flex justify-center">
          <span className="text-gray-500 font-medium">OU</span>
        </div>

        <div className="flex-1 flex justify-center">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}