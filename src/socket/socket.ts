import io from "socket.io";
import {  } from "../db/database";
import { success } from "../lib/response";
import { Request, Response, NextFunction } from "express";
import fs from 'fs'
 class socketController {
  public socketData: any = {};
  public storedMsg: any = [];
  public allclient: any =[];
  public savedNotification: any;
  public socket:any
    
  constructor(){}



  async connectcsocket(httpServer: any) {
    const severSocketIO = io(httpServer);
    this.socket= severSocketIO
    severSocketIO.on("connection", (socket: any) => {
      console.log("a user connected");
      console.log("userdetails:", socket.handshake.query);
      let clientsCount = Object.keys(severSocketIO.sockets.connected).length;
      console.log("total client conneted", clientsCount);

      if (socket.handshake.query != undefined || socket.handshake.query != null) {
        let objInfo={}
        console.log("socket.handshake.query",socket.handshake.query)
        if(socket.handshake.query.domain == 'cc' && socket.handshake.query.userId != undefined){
           objInfo={domain:socket.handshake.query.domain, userId:socket.handshake.query.userId, socketId:socket.id}
           this.allclient.push(objInfo);
           this.removeDuplicateSocket(this.allclient, "socketId");
        }

        if(socket.handshake.query.domain == 'PWSC'  && socket.handshake.query.branch_id != undefined){
          objInfo={domain:socket.handshake.query.domain, branch_id:socket.handshake.query.branch_id, socketId:socket.id}
            this.allclient.push(objInfo);
            this.removeDuplicateSocket(this.allclient, "socketId");
        }
       
      }

    //   socket.on('info', function (data:any, callback:any) {
    //     console.log('data',data);
    //        let objInfo={}
    //     if(data.domain == 'cc' && data.userId){
    //        objInfo={domain:data.domain, userId:data.userId, socketId:socket.id}
    //        this.allclient.push(objInfo);
    //        this.removeDuplicateSocket(this.allclient, "socketId");
    //     }

    //     if(data.domain == 'PWSC' && data.branch_id){
    //       objInfo={domain:data.domain, branch_id:data.branch_id, socketId:socket.id}
    //       this.allclient.push(objInfo);
    //       this.removeDuplicateSocket(this.allclient, "socketId");
    //     }
    //     callback('info recived successfully in backend');
    // });


      socket.on("info", (data: any, callback:any) => {
        console.log("this is client info",data)
        let objInfo={}
        if(data.domain == 'cc' && data.userId){
           objInfo={domain:data.domain, userId:data.userId, socketId:socket.id}
           this.allclient.push(objInfo);
           this.removeDuplicateSocket(this.allclient, "socketId");
        }

        if(data.domain == 'PWSC' && data.branch_id){
          objInfo={domain:data.domain, branch_id:data.branch_id, socketId:socket.id}
          this.allclient.push(objInfo);
          this.removeDuplicateSocket(this.allclient, "socketId");
        }
        callback('info recived successfully in backend');
  
      });




      socket.on("sendOrderToBackend", (details: any) => {
        console.log("Received order from cc",details)
        this.sendOrderToPos(details.branch_id, details, this.allclient, severSocketIO)
      });

      // socket.on("sendComplaintToBackend", (details: any) => {
      //   console.log("Received complaints from cc",details)
      //   this.sendComplaintToPos(details.branch_id, details, this.allclient, severSocketIO)
      // });

      socket.on("sendComplaintToBackend", (data: any, callback:any) => {
        callback('complaints recived successfully in backend');
        console.log("complaint recived",data,)
        this.sendComplaintToPos(data[0].branch_id, data, this.allclient, severSocketIO)
      });




      socket.on("logout", (details: any) => {
        this.logout(details, socket.id);
      });

      


      socket.on("disconnect", (details: any) => {
        this.logout(details, socket.id);
      });
    });
  }

 
 

 public async sendbranchNotificationTest(toBranch_id:any,data: any) {
    console.log("sens to this user",toBranch_id)
    console.log("this.allclient",this.allclient)
  }





  sendOrderToPos(branch_id:any, data: any, clients: any,severSocketIO:any){
    console.log("sendOrderToPos this branch",branch_id)
    console.log("this.allclinet",this.allclient)
    let checkuserIsActive = clients.filter((data1: any) => {
      return data1.branch_id == parseInt(branch_id);
    });
    console.log("checkuserIsActive", checkuserIsActive);
    if (checkuserIsActive.length > 0) {
      checkuserIsActive.forEach((entry: any) => {
        let SocketId = entry.socketId;
        console.log("===SocketId", SocketId);
        severSocketIO.in(SocketId).emit("sendOrderToPos", data);
      });
    }
  }

  sendComplaintToPos(branch_id:any, data: any, clients: any,severSocketIO:any){
    console.log("sendComplaintToPos this branch",branch_id)
    console.log("this.allclinet",this.allclient)
    let checkuserIsActive = clients.filter((data1: any) => {
      return data1.branch_id == parseInt(branch_id);
    });
    console.log("checkuserIsActive", checkuserIsActive);
    if (checkuserIsActive.length > 0) {
      checkuserIsActive.forEach((entry: any) => {
        let SocketId = entry.socketId;
        console.log("===SocketId", SocketId);
        severSocketIO.in(SocketId).emit("sendComplaintToPos", data);
      });
    }
  }







  sendbranchNotification(toBranch_id:any,data: any, clients: any,severSocketIO:any) {
    console.log("sen to this user",toBranch_id)
    console.log("this.allclinet",this.allclient)
    let checkuserIsActive = clients.filter((data1: any) => {
      return data1.branch_id == parseInt(toBranch_id);
    });
    console.log("checkuserIsActive", checkuserIsActive);
    if (checkuserIsActive.length > 0) {
      checkuserIsActive.forEach((entry: any) => {
        let SocketId = entry.socketId;
        console.log("===data.length", data.length);
        console.log("===SocketId", SocketId);
        severSocketIO.in(SocketId).emit("sendBranchNotification", data);
      });
    } else {
      console.log("inside saved notification ", this.savedNotification);
      // let update = { storenotification: true };
      // const response = NotificationTable.update(update, {
      //   where: { notification_id: this.savedNotification },
      //   returning: true
      // });
    }
  }

  logout(details: any, socketId: any) {
    console.log("logout user", details, " socketId: ", socketId);
    console.log("all client before logout", this.allclient);
    let logoutFromAllclient = this.allclient.filter((data: any) => {
      return data.socketId != socketId;
    });
    this.allclient = logoutFromAllclient;
    // this.filewrite(this.allclient);
    console.log("allclient after logout", logoutFromAllclient);
  }

  removeDuplicateSocket(clients: any, socketId: any) {
    console.log("remove duplicate socketId")
    let newArray: any = [];
    let lookupObject: any = {};

    for (var i in clients) {
      lookupObject[clients[i][socketId]] = clients[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    this.allclient = newArray;
    // this.filewrite(this.allclient);
    console.log("all clients", this.allclient);
    return newArray;
  }

  // filewrite(clients:any){
  //   let json = JSON.stringify(clients); 
  //   fs.writeFile ("socketusers.json", json, function(err:any) {
  //     if (err) throw err;
  //     console.log('complete');
  //     }
  //   )
  // }
  

  async checkOnlineUsers(req: Request, res: Response, next: NextFunction) {
	
      fs.readFile('socketusers.json',function(err:any,content:any){
       let parseJson = JSON.parse(content);
       console.log("parseJson",parseJson)
       res.send(parseJson)
      })
		
	}
}
export default socketController