import { Flex } from "@chakra-ui/core";

function Loader() {
  return (
    <div className="lds-ring">
      <style jsx>{`
        .lds-ring {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        .lds-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 64px;
          height: 64px;
          margin: 8px;
          border: 8px solid #2b8c8a;
          border-radius: 50%;
          animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: #2b8c8a transparent transparent transparent;
        }
        .lds-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        .lds-ring div:nth-child(2) {
          animation-delay: -0.3s;
        }
        .lds-ring div:nth-child(3) {
          animation-delay: -0.15s;
        }
        @keyframes lds-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export function Loading() {
  return (
    <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
      <Loader />
    </Flex>
  );
}