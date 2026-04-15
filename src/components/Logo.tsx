interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Light mode → black logo */}
      <img
        src="/stack-index-black.png"
        alt="Stack Index"
        className="h-10 w-auto block dark:hidden"
      />
      {/* Dark mode → white logo */}
      <img
        src="/stack-index-white.png"
        alt="Stack Index"
        className="h-10 w-auto hidden dark:block"
      />
    </div>
  );
};
