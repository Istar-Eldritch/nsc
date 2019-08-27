import "./index.scss";
import { h, render } from "preact";
import {Landing} from './pages';

render(<Landing />, document.getElementById("app") as Element);
