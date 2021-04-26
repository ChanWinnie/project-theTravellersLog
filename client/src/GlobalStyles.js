import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    *,
    *:before,
    *:after {
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
    }

    body {
        margin: 0;
        scroll-behavior:smooth;
    }
 
    html, body {
        max-width: 100vw;
    }

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }

    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }

    h1 {
        font-size: 40px;
        font-family: "Euphoria Script", "cursive";
    }

    h2 {
        font-size: 30px;
    }

    h2, 
    h3, 
    h4,
    p, 
    a,
    li,
    label,
    button,
    blockquote,
    input {
        font-family: "Open Sans", "sans-serif";
    } 

    button {
        border: none;
        text-decoration: none;
        outline: none;
        display: flex;
        align-items: center;
        border-radius: 3px;
        justify-content: center;
    }

`;

export const styling = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  border: "2px solid black",
  borderRadius: "3px",
  colorPrimary: "#455a64",
};

export const modalStyles = {
  content: {
    top: "15%",
    left: "8%",
    border: "1px solid gray",
    width: "85%",
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: "10px 50px",
  },
  overlay: {
    backgroundColor: "rgba(69, 90, 100, 0.7)",
  },
};
