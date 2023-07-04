import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/model/message';


@Component({
  selector: 'app-friends-chat',
  templateUrl: './friends-chat.component.html',
  styleUrls: ['./friends-chat.component.css']
})
export class FriendsChatComponent implements OnChanges, AfterViewInit {
  friendsChatEnabled: boolean = true;
  @Input() chatUser: any;
  messageFieldPlaceholder: string;
  chatMessages: Message[];
  chatFieldMessage: string;
  token: string;

  @ViewChild('chatField', { static: false }) chatField: ElementRef;
  @ViewChild('chatMessagesContainer', { static: false }) chatMessagesContainer: ElementRef;

  constructor (
    private message: MessageService
  ) {
    this.token = localStorage.getItem('token');
  }

  chatMessagesProcessor() {

  }

  sendMessage() {
    this.message.sendMessage(this.token, this.chatUser.username, this.chatFieldMessage).subscribe((response: any) => {
      this.chatFieldMessage = '';
      this.chatMessages.push(response);
      this.scrollToBottom();
    })

  }

  getChatMessages() {
    this.message.getMessagesForUsers(this.token, this.chatUser.username).subscribe((response: Message) => {
      if (Array.isArray(response)) {
        this.chatMessages = response;
      } else {
        this.chatMessages = [response];
      }
      this.scrollToBottom();
    })
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

  focusOnChatField() {
    this.chatField.nativeElement.focus();
  }

  getTimePeriod(timestamp: string): string {
    const hour = new Date(timestamp).getHours();
    return hour < 12 ? 'AM' : 'PM';
  }

  getMessageDate(timestamp: string): string {
    const currentDate = new Date();
    const messageDate = new Date(timestamp);

    const isToday = this.isSameDate(currentDate, messageDate);
    const isYesterday = this.isSameDate(this.getPreviousDate(currentDate), messageDate);

    if (isToday) {
      return 'Today at';
    } else if (isYesterday) {
      return 'Yesterday at';
    } else {
      return messageDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  getPreviousDate(date: Date): Date {
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    return previousDate;
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.messageFieldPlaceholder = `Message ${this.chatUser.displayName}`;

    this.getChatMessages();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatUser'] && changes['chatUser'].currentValue) {
      this.messageFieldPlaceholder = `Message ${this.chatUser.username}`;
      this.getChatMessages();
      this.focusOnChatField()
    }
  }

  ngAfterViewInit(): void {
    this.focusOnChatField()
  }

}
