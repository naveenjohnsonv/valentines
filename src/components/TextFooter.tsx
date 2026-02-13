import { useMemo } from "react";

type TextFooterProps = {
  phase?: "collect" | "order";
};

const FOOTER_HEADING =
  "text-white text-4xl lg:text-5xl font-bold leading-tight font-display";

export default function TextFooter({ phase = "collect" }: TextFooterProps) {
  const { leftText, rightText } = useMemo(() => {
    if (phase === "collect") {
      return {
        leftText: (
          <>
            <span className="text-gray-400">Find</span> <br /> the letters
          </>
        ),
        rightText: (
          <>
            and discover <br /> <span className="text-gray-400">what awaits</span>
          </>
        ),
      };
    }
    return {
      leftText: (
        <>
          <span className="text-gray-400">Arrange</span> <br /> the letters
        </>
      ),
      rightText: (
        <>
          and let the <br /> <span className="text-gray-400">mystery unfold</span>
        </>
      ),
    };
  }, [phase]);

  return (
    <>
      <h1 className={`absolute left-10 bottom-5 transform -translate-y-1/2 ${FOOTER_HEADING}`}>
        {leftText}
      </h1>
      <h1 className={`absolute right-10 bottom-5 transform -translate-y-1/2 text-right ${FOOTER_HEADING}`}>
        {rightText}
      </h1>
    </>
  );
}
