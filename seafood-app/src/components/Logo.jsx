import vamLogo from "../assets/logo.png";

export function Logo({ className = "", imgHeight = "h-6" }) {
  return (
    <div className={`flex items-center -ml-4 ${className}`}>
      <img
        src={vamLogo}
        alt="VAM Logo"
        className={`${imgHeight} w-auto object-contain`}
      />
    </div>
  );
}
