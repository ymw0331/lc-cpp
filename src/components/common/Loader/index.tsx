import Image from "next/image";

const Loader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-boxdark">
    <div className="relative mb-6">
      <Image
        src="/images/logo/loockard-logo-color.svg"
        alt="LookCard Logo"
        width={160}
        height={48}
        className="dark:hidden"
      />
      <Image
        src="/images/logo/lookcard-logo-white.svg"
        alt="LookCard Logo"
        width={160}
        height={48}
        className="hidden dark:block"
      />
    </div>
    <div className="flex items-center justify-center">
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  </div>
  );
};

export default Loader;
