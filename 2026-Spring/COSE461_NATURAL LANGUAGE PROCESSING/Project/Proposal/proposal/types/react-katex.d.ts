declare module "react-katex" {
  import type { ComponentType, ReactNode } from "react";

  type BaseProps = {
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
    className?: string;
  };

  export const BlockMath: ComponentType<BaseProps & { math: string }>;
  export const InlineMath: ComponentType<BaseProps & { math: string }>;
}
