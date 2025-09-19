import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Todo } from "./todo";

const rootElement = document.getElementById("root")
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <todo/>
    </StrictMode>
);