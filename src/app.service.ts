import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { Message, MessageDTO } from './entities.model';

@Injectable()
export class AppService {
	private _messages: Message[];

	constructor() {
		try {
			this._messages = JSON.parse(readFileSync('db.json').toString()) as Message[];
		} catch {
			this._messages = [];
			writeFileSync('db.json', '[]');
		}
	}

	public getMessages(): Message[] {
		return this._messages;
	}

	public createMessage(data: MessageDTO): Message[] {
		this._messages.push({ id: randomUUID(), ...data });
		this._sync();

		return this._messages;
	}

	private _sync(): void {
		writeFileSync('db.json', JSON.stringify(this._messages));
	}
}

