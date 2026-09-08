
// import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
// import { environment } from 'src/environments/environment';


// @Injectable({
//   providedIn: 'root',
// })
// export class Socketservice {


//   private socket?: Socket;



//   connect(token: string) {

//     if (this.socket?.connected) {

//       console.log('Socket already connected');

//       return;

//     }


//     // old socket cleanup
//     if (this.socket) {

//       this.socket.removeAllListeners();

//       this.socket.disconnect();

//     }



//     this.socket = io(
//       environment.socketUrl,
//       {

//         auth: {
//           token: token
//         },

//         transports: ['websocket']

//       }
//     );



//     this.socket.on(
//       'connect',
//       () => {

//         console.log(
//           'Socket connected:',
//           this.socket?.id
//         );

//       }
//     );



//     this.socket.on(
//       'disconnect',
//       () => {

//         console.log(
//           'Socket disconnected'
//         );

//       }
//     );



//     this.socket.on(
//       'connect_error',
//       (err) => {

//         console.log(
//           'Socket error:',
//           err.message
//         );

//       }
//     );


//   }






//   onMessage(callback: any) {


//     if (!this.socket) {

//       console.log(
//         'Socket not initialized'
//       );

//       return;

//     }


//     this.socket.off(
//       'chat:message'
//     );



//     this.socket.on(
//       'chat:message',
//       callback
//     );


//   }


//   disconnect() {

//     if (!this.socket) {

//       return;

//     }

//     this.socket.off(
//       'chat:message'
//     );

//     this.socket.disconnect();

//     this.socket = undefined;

//   }



// }


import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Messagenotification } from './messagenotification';

@Injectable({
  providedIn: 'root',
})
export class Socketservice {

  private socket?: Socket;

  constructor(
    private notificationService: Messagenotification
  ) { }

  connect(token: string) {

    // Already connected
    if (this.socket?.connected) {

      console.log('Socket already connected');

      return;

    }

    // Old socket cleanup
    if (this.socket) {

      this.socket.removeAllListeners();
      this.socket.disconnect();

    }

    this.socket = io(
      environment.socketUrl,
      {
        auth: {
          token: token
        },

        transports: ['websocket']
      }
    );

    this.socket.on(
      'connect',
      () => {

        console.log(
          'Socket connected:',
          this.socket?.id
        );

      }
    );


    // =====================================
    // GLOBAL NEW MESSAGE LISTENER
    // =====================================

    this.socket.on(
      'chat:message',
      (socketData: any) => {

        const newMessage = socketData?.message;

        if (!newMessage) {
          return;
        }

        console.log(
          'Global new message:',
          newMessage
        );


        // Sender nenu kaakapothe notification
        const myId = this.getMyUserId();

        if (
          newMessage.sender?.id &&
          newMessage.sender.id !== myId
        ) {

          const conversationId =
            newMessage.conversationId;

          if (conversationId) {

            this.notificationService.increase(
              conversationId
            );

          }

        }

      }
    );


    this.socket.on(
      'disconnect',
      () => {

        console.log(
          'Socket disconnected'
        );

      }
    );


    this.socket.on(
      'connect_error',
      (err) => {

        console.log(
          'Socket error:',
          err.message
        );

      }
    );

  }


  onMessage(callback: any) {

    if (!this.socket) {

      console.log(
        'Socket not initialized'
      );

      return;

    }

    this.socket.off(
      'chat:message',
      callback
    );

    this.socket.on(
      'chat:message',
      callback
    );

  }


  private getMyUserId(): string {

    const token = localStorage.getItem('accessToken');

    if (!token) {
      return '';
    }

    try {

      const payload = token.split('.')[1];

      return JSON.parse(
        atob(payload)
      ).id;

    } catch {

      return '';

    }

  }


  disconnect() {

    if (!this.socket) {
      return;
    }

    this.socket.removeAllListeners();

    this.socket.disconnect();

    this.socket = undefined;

  }

}

