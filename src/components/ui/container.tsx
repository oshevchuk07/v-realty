export type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>;
}
