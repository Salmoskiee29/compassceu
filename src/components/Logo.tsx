import Image from "next/image";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/images/compass-mark.png"
      alt=""
      width={Math.round(size * (223 / 256))}
      height={size}
      aria-hidden="true"
      className="dark:rounded-full dark:bg-white/90 dark:p-0.5"
    />
  );
}
