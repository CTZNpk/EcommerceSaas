import { ReactNode } from "react";

export const Background = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`${className} min-h-screen `}>
      {children}
    </div>
  );
};
