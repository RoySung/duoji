import { HeroUIProvider } from '@heroui/react';

function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <main>{children}</main>
      </Providers>
    </>
  );
}
