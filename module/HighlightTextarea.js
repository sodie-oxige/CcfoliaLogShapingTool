import hljs from '/highlight/highlight.min.js';
import css from '/highlight/css.min.js';

export class HighlightTextarea {
	constructor(elem) {
		this.element = elem;
		this.language = elem.getAttribute("highlight");
		this.createDOM();
	}

	createDOM() {
		this.display = document.createElement("div");
		this.display.classList.add("hilight_display");
		this.shadow = this.display.attachShadow({ mode: 'open' });
		this.element.before(this.display);

		let zindex = window.getComputedStyle(this.element).zIndex;
		this.tabsize = Number(window.getComputedStyle(this.element).tabSize);

		this.element.style.zIndex = zindex + 1;
		this.element.style.color = "transparent";
		this.element.style.backgroundColor = "transparent";
		this.element.style.caretColor = "black";
		this.onresize();

		hljs.registerLanguage('css', css);
		this.shadow_pre = document.createElement("pre");
		this.shadow_code = document.createElement("code");
		this.shadow_code.classList.add("language-" + this.language);
		this.shadow_pre.appendChild(this.shadow_code);
		this.shadow.appendChild(this.shadow_pre);
		let style = document.createElement("style");
		style.innerHTML = `
			pre{
				box-sizing: border-box;
				margin: 0;
				padding: ${window.getComputedStyle(this.element).paddingTop} 0 ${window.getComputedStyle(this.element).paddingBottom} 0;
				padding-bottom: calc(${window.getComputedStyle(this.element).paddingBottom} + 1em);
				height: 100%;
				overflow: auto;
				scrollbar-width: none;
			}
			code{
				padding: 0 ${window.getComputedStyle(this.element).paddingRight} 0 ${window.getComputedStyle(this.element).paddingLeft}!important;
				min-height: 100%;
				font-family: ${window.getComputedStyle(this.element).fontFamily};
				line-height: ${window.getComputedStyle(this.element).lineHeight};
				tab-size: ${this.tabsize};
				background-image: repeating-linear-gradient(to bottom, white 0, white 1.2em, #f8f8f8 1.2em, #f8f8f8 2.4em)!important;
				scrollbar-width: none;
			}
		`
		this.shadow.appendChild(style);

		let highlight_style = document.createElement("link");
		highlight_style.id = "highlight_style";
		highlight_style.setAttribute("href", "/highlight/github.min.css");
		highlight_style.setAttribute("rel", "stylesheet");
		highlight_style.setAttribute("type", "text/css");
		this.shadow.appendChild(highlight_style);

		this.element.addEventListener("input", () => {
			this.oninput();
		})
		this.element.addEventListener("scroll", () => {
			this.onscroll();
		})
		window.addEventListener("resize", () => {
			this.onresize();
		})
	}

	oninput() {
		this.shadow_code.textContent = this.element.value;
		this.shadow_code.removeAttribute("data-highlighted");
		hljs.highlightElement(this.shadow_code);
	}

	onscroll() {
		this.shadow_pre.scrollTop = this.element.scrollTop;
		this.shadow_code.scrollLeft = this.element.scrollLeft;
	}

	onresize() {
		let zindex = window.getComputedStyle(this.element).zIndex;
		if (zindex == "auto") zindex = 0;
		let elemRect = this.element.getBoundingClientRect();
		this.display.style = `
			position: absolute;
			margin: ${window.getComputedStyle(this.element).margin};
			top: ${this.element.offsetTop}px;
			left: ${this.element.offsetLeft}px;
			width: ${elemRect.width}px;
			height: ${elemRect.height}px;
			z-index: ${zindex};
			border: ${window.getComputedStyle(this.element).border};
		`
	}
}
