import React, {
  memo,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";

type Props = PropsWithChildren<{}>;

export const Portal: React.FC<Props> = ({ children }) => {
  const id = uuidv4();
  const el = useRef(
    document.getElementById(id) || document.createElement("div")
  );
  const [dynamic] = useState(!el.current.parentElement);

  useEffect(() => {
    const refValue = el.current;
    if (dynamic) {
      el.current.id = id;
      document.body.appendChild(el.current);
    }
    return () => {
      if (dynamic && refValue.parentElement) {
        refValue.parentElement.removeChild(refValue);
      }
    };
    //eslint-disable-next-line
  }, [id]);
  return createPortal(children, el.current);
};
