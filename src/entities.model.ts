import { IsString } from 'class-validator';

export class Message {
	@IsString()
	id: string = undefined as any;

	@IsString()
	contents: string = undefined as any;
}

export class MessageDTO {
	@IsString()
	contents: string = undefined as any;
}

