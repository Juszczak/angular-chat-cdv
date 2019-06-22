import { Component, OnInit } from '@angular/core';
import { connect } from 'socket.io-client';
import { Message } from './message';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  public messages: Message[] = [];
  
  public authorId: string = 'anonymous';

  private socket: SocketIOClient.Socket;
  private readonly eventType: string = 'chat message';

  public ngOnInit(): void {
    const socketUrl: string = 'https://socket-chat-server-zbqlbrimfj.now.sh';

    this.socket = connect(socketUrl, {
      transports: ['websocket'],
      reconnection: true
    });

    this.socket.on(this.eventType, (message: Message) => {
      console.log(message);
      this.messages.push(message);
    });
  }

  public handleEnter($event: KeyboardEvent): void {
    let textarea: HTMLTextAreaElement;
    let message: string;

    // $event.target: EventTarget
    textarea = $event.target as HTMLTextAreaElement;

    // textarea.value: string
    message = textarea.value;    

    // send message
    this.sendMessage(message);

    // clear textarea
    textarea.value = '';
  }

  public sendMessage(text: string): void {
    let message: Message;

    message = {
      text: text,
      authorId: this.authorId,
      timestamp: Date.now() // aktualny timestamp
    };

    this.socket.emit(this.eventType, message);
  }

  public setName(name: string): void {
    if (name.length) {
      this.authorId = name;
    } else {
      this.authorId = 'anonymous';
    }
  }
}