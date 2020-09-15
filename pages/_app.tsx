import { ChakraProvider, Box } from "@chakra-ui/core";
import type { AppProps } from "next/app";

import { Header } from "components/header";
import { User } from "utils/use-user";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider resetCSS>
      <User.Provider>{children}</User.Provider>
    </ChakraProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Header />
      <Box px={8}>
        <Box maxWidth="1240px" margin="0 auto">
          <Component {...pageProps} />
        </Box>
      </Box>
    </Providers>
  );
}

export default MyApp;
