import NextLink, { type LinkProps } from "next/link";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
} from "react";

type Props = Omit<ComponentPropsWithoutRef<"a">, keyof LinkProps> & LinkProps;

export const Link = forwardRef(function Link(
  { prefetch = true, ...rest }: Props,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  return <NextLink ref={ref} prefetch={prefetch} {...rest} />;
});
