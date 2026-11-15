import Image from "next/image";

export function Logo({
  className = "h-11 w-[5.5rem]",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/logo-gold.png"
      alt="Philly Fades skyline logo"
      width={1500}
      height={750}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
