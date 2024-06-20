import { ReactNode } from "react";

function ShowIf({ condition, children }: { condition: boolean; children: ReactNode }) {
  return condition ? children : null;
}

export default ShowIf;
