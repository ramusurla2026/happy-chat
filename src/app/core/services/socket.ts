
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Socketservice {


  private socket?: Socket;



  connect(token: string) {

    if (this.socket?.connected) {

      console.log('Socket already connected');

      return;

    }


    // old socket cleanup
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
      'chat:message'
    );



    this.socket.on(
      'chat:message',
      callback
    );


  }


  disconnect() {

    if (!this.socket) {

      return;

    }

    this.socket.off(
      'chat:message'
    );

    this.socket.disconnect();

    this.socket = undefined;

  }



}
