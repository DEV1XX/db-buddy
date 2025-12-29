import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="w-full h-14 px-6 flex items-center justify-between bg-gray-900 text-white">
      
      {/* Logo */}
      <div className="text-lg font-semibold">
        db-buddy
      </div>

      {/* Auth Actions */}
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

    </nav>
  );
};

export default Navbar;
