import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Message, newMessage } from 'src/app/model/message';
import Pusher from 'pusher-js';
import { environment } from 'src/app/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileCardComponent } from 'src/app/user/profile-card/profile-card.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserDTO } from 'src/app/model/user';


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
  pusher: Pusher
  channel: any;
  environment = environment;
  canSendMessage: boolean = true;
  skeletonLoadingCount = 10;
  channelName: string;
  loggedInUser: UserDTO;

  @ViewChild('chatField', { static: false }) chatField: ElementRef;
  @ViewChild('chatMessagesContainer', { static: false }) chatMessagesContainer: ElementRef;
  @ViewChild('messageSound') messageSound: ElementRef<HTMLAudioElement>;

  constructor (
    private message: MessageService,
    private user: UserService,
    private matDialog: MatDialog,
    private alertify: AlertifyService
  ) {
  }

  getLoopRange(){
    return new Array(this.skeletonLoadingCount);
  }

  getUserProfileImage(imageUrl: string) {
    if (imageUrl == '') {
      return '/assets/images/default-user.png';
    }
    return imageUrl;
  }

  chatMessagesProcessor() {
    if (!this.chatMessages || this.chatMessages.length === 0) {
      return;
    }
    const processedMessages: Message[] = [];
    let previousMessage: Message = this.chatMessages[0];
    if (!previousMessage.user1ProfilePictureUrl) {
      previousMessage.user1ProfilePictureUrl = '/assets/images/default-user.png';
    }

    for (let i = 1; i < this.chatMessages.length; i++) {
      const currentMessage: Message = this.chatMessages[i];
      if (!currentMessage.user1ProfilePictureUrl) {
        currentMessage.user1ProfilePictureUrl = '/assets/images/default-user.png';
      }
      if (previousMessage.user1DisplayName === currentMessage.user1DisplayName) {
        previousMessage.messageString += '\n' + currentMessage.messageString;
        previousMessage.timestamp = currentMessage.timestamp;
      } else {
        processedMessages.push(previousMessage);
        previousMessage = currentMessage;
      }
    }

    processedMessages.push(previousMessage);

    this.chatMessages = processedMessages;
  }

  sendMessage() {
    if (this.chatFieldMessage.length >= 200) {
      this.alertify.error('Your message is too long.');
      return;
    }
    if (this.canSendMessage && this.chatFieldMessage) {
      this.canSendMessage = false;
      const sendMessage: newMessage = {
        receiverUsername: this.chatUser.username,
        message: this.chatFieldMessage
      }
      this.message.sendMessage(sendMessage).subscribe((response: any) => {
        if (response == 201) {
          const msg: Message = {
            id: 999,
            user1Id: this.loggedInUser.id,
            user1DisplayName: this.loggedInUser.displayName == (undefined || null) ? this.loggedInUser.username : this.loggedInUser.displayName,
            user1ProfilePictureUrl: this.getUserProfileImage(this.loggedInUser.profileImageUrl),
            user2Id: this.chatUser.id,
            messageString: this.chatFieldMessage,
            timestamp: new Date(),
          }
          this.chatMessages.push(msg);
          this.chatFieldMessage = '';
          this.chatMessagesProcessor();
          this.scrollToBottom();
          this.canSendMessage = true;
        }
      });
    }
  }

  getChatMessages() {
    this.message.getMessagesForUsers(this.chatUser.username).subscribe((response: Message) => {
      if (Array.isArray(response)) {
        this.chatMessages = response;
      } else {
        this.chatMessages = [response];
      }
      this.scrollToBottom();
      this.chatMessagesProcessor();
    });
  }


  scrollToBottom() {
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

  focusOnChatField() {
    this.chatField?.nativeElement.focus();
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
      return messageDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  onFriendImage(userClicked: string) {
    const dialogRef = this.matDialog.open(ProfileCardComponent, {
      width: 'auto',
      maxWidth: '100vw'
    })
    dialogRef.componentInstance.cardClosed.subscribe(() => {
      dialogRef.close();
    });
    if (userClicked == this.chatUser.displayName || userClicked == this.chatUser.username) {
      this.user.raiseCurrentUserProfileCard(this.chatUser);
    } else {
      this.user.getLoggedInUser().subscribe((response: any) => {
        this.user.raiseCurrentUserProfileCard(response);
      })
    }

  }

  updatePusherConfiguration() {
    if (this.pusher) {
      this.pusher.unsubscribe(this.channelName);
      this.channel = null;

      this.channel = this.pusher.subscribe(this.channelName);
    this.channel.bind('my-event', (data: any) => {
      if (data.message.User1Id == this.chatUser.id) {
        const newMessage: Message = {
          id: data.message.Id,
          user1Id: data.message.User1Id,
          user1DisplayName: data.message.User1DisplayName,
          user1ProfilePictureUrl: data.message.User1ProfilePictureUrl,
          user2Id: this.loggedInUser.id,
          messageString: data.message.MessageString,
          timestamp: new Date(data.message.Timestamp)
        };
        if (newMessage.user1Id != this.loggedInUser.id) {
          this.chatMessages.push(newMessage);
        }
        this.messageSound.nativeElement.play();
        this.scrollToBottom();
        this.chatMessagesProcessor();
      }
    });

    }


  }

  ngOnInit() {
    this.pusher = new Pusher(this.environment.pusherKey, {
      cluster: this.environment.pusherCluster
    });
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));

    this.updatePusherChannelName();

    this.messageFieldPlaceholder = `Message ${this.chatUser.displayName}`;

    this.getChatMessages();

    this.updatePusherConfiguration();

    this.getChatMessages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatUser'] && changes['chatUser'].currentValue) {
      this.updatePusherChannelName();
      this.messageFieldPlaceholder = `Message ${this.chatUser.username}`;
      this.chatMessages = null;
      this.updatePusherConfiguration();
      this.getChatMessages();
      this.focusOnChatField();
    }
  }

  updatePusherChannelName() {
    this.channelName = `chat-channel-${this.chatUser.username}-${localStorage.getItem('userName')}`;
  }

  ngAfterViewInit(): void {
    this.focusOnChatField();
  }

  ngOnDestroy() {
    this.pusher.unsubscribe(this.channelName);
  }
}
