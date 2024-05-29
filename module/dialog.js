export class Dialog {
	constructor(title, elem, callback) {
		this.title = title;
		this.content = elem;
		this.callback = callback;

		this.container = document.createElement("div");
		this.container.style = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0,0,0,0.5);
		z-index: 10;
		font-family: system-ui;`
		this.shadow = this.container.attachShadow({ mode: "open" });

		this.popDialog();
	}

	popDialog() {
		let style = document.createElement("style");
		style.innerHTML = `
			.main{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				margin: auto;
				display: flex;
				padding: 20px;
				flex-direction: column;
				justify-content: center;
				width: 60%;
				height: fit-content;
				max-width: 100vw;
				min-width: 300px;
				border-radius: 20px;
				background-color: #eee;
				z-index: 11;
			}
			.buttons{
				display: flex;
				justify-content: space-evenly;
				margin-top: 10px;
			}
			.cancel,
			.submit{
				width: 100%;
				font-size: 20px;
			}`
		this.shadow.appendChild(style);
		
		let dialog_main = document.createElement("div");
		dialog_main.classList.add("main");
		let dialog_title = document.createElement("h1");
		dialog_title.textContent = this.title;
		dialog_main.appendChild(dialog_title);
		let dialog_content = this.content;
		dialog_main.appendChild(dialog_content);
		let dialog_buttons = document.createElement("div");
		dialog_buttons.classList.add("buttons");
		let dialog_cancel = document.createElement("button");
		dialog_cancel.classList.add("cancel");
		dialog_cancel.textContent = "戻る";
		dialog_buttons.appendChild(dialog_cancel);
		let dialog_submit = document.createElement("button");
		dialog_submit.classList.add("submit");
		dialog_submit.textContent = "決定";
		dialog_buttons.appendChild(dialog_submit);
		dialog_main.appendChild(dialog_buttons);
		
		this.shadow.appendChild(dialog_main);
		document.body.appendChild(this.container);

		dialog_cancel.addEventListener("click", () => {
			this.closeDialog();
		});
		dialog_submit.addEventListener("click", () => {
			this.callback();
			this.closeDialog();
		});
	}

	closeDialog() {
		this.container.remove();
	}
}