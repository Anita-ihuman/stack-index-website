import logoImage from "@/assets/stack-index-logo.png";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="Stack Index Logo" 
        className="h-10 w-auto"
      />
    </div>
  );
};
