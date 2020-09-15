import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import { Link as Anchor, LinkProps as AnchorProps } from "@chakra-ui/core";

type Props = {
  children: React.ReactChild;
} & AnchorProps &
  LinkProps;

export const NavLink = ({ children, ...props }: Props) => {
  const router = useRouter();

  const {
    as,
    replace,
    scroll,
    shallow,
    passHref,
    prefetch,
    href,
    ...anchorProps
  } = props;

  return (
    <Link
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
      href={href}
    >
      <Anchor
        style={
          router.pathname === href
            ? {
                fontWeight: 600,
                color: "#319795",
              }
            : null
        }
        {...anchorProps}
      >
        {children}
      </Anchor>
    </Link>
  );
};
