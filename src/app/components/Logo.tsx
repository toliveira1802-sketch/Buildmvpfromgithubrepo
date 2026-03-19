// Logo Doctor Auto - componente reutilizável
// Usa o logo real da empresa

const LOGO_URL = "/logo.png";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <img
      src={LOGO_URL}
      alt="Doctor Auto"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export default Logo;
