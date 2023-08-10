import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Message, MessageDTO } from './entities.model';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	public getPage(): string {
		return `
		<html data-theme="dark">
			<head>
				<title>Ocean</title>
				<link rel="stylesheet" href="https://mypico.jasonxu.dev/min">
				<style>
				body {
					padding-top: var(--block-spacing-vertical);
				}
				</style>
				<script>
				let messages = ${JSON.stringify(this.appService.getMessages())};

				function renderMessage(msg) {
					const container = document.createElement('article');
					const text = document.createElement('p');

					text.textContent = msg.contents;

					container.appendChild(text);

					return container;
				}

				function render() {
					return messages.map((msg) => renderMessage(msg));
				}
				</script>
			</head>
			<body class="container">
				<section id="head">
					<h1>When life gives you an ocean, throw in a message in a bottle</h1>
				</section>
				<section id="messages"></section>
				<section id="new">
					<input type="text" onkeyup="onKeyPress(event)" placeholder="New Message">
				</section>
				<script>
				const container = document.getElementById('messages');

				function rerender() {
					container.replaceChildren(...render());
				}

				function onKeyPress(evt) {
					if (evt.key === 'Enter') {
						fetch('/api/messages', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ contents: evt.target.value })
						})
							.then((res) => res.json())
							.then((data) => {
								messages = data;
								evt.target.value = '';
								rerender();
							});
					}
				}

				function sync() {
					fetch('/api/messages')
						.then((res) => res.json())
						.then((data) => {
							messages = data;
							rerender();
						});
				}

				rerender();

				let refetchInterval = null;
				if (document.visibilityState === 'visible') {
					refetchInterval = setInterval(() => {
						sync();
					}, 5000);
				}

				document.addEventListener('visibilitychange', () => {
					if (document.visibilityState === 'visible') {
						sync();
						refetchInterval = setInterval(() => {
							sync();
						}, 5000);
					} else {
						clearInterval(refetchInterval);
						refetchInterval = null;
					}
				});
				</script>
			</body>
		</html>
		`;
	}

	@Get('/api/messages')
	public getMessages(): Message[] {
		return this.appService.getMessages();
	}

	@Post('/api/messages')
	public createMessage(@Body() data: MessageDTO): Message[] {
		return this.appService.createMessage(data);
	}
}

