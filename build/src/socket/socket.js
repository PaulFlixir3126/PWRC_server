"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const fs_1 = __importDefault(require("fs"));
class socketController {
    constructor() {
        this.socketData = {};
        this.storedMsg = [];
        this.allclient = [];
    }
    connectcsocket(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            const severSocketIO = socket_io_1.default(httpServer);
            this.socket = severSocketIO;
            severSocketIO.on("connection", (socket) => {
                console.log("a user connected");
                console.log("userdetails:", socket.handshake.query);
                let clientsCount = Object.keys(severSocketIO.sockets.connected).length;
                console.log("total client conneted", clientsCount);
                if (socket.handshake.query != undefined || socket.handshake.query != null) {
                    let objInfo = {};
                    console.log("socket.handshake.query", socket.handshake.query);
                    if (socket.handshake.query.domain == 'cc' && socket.handshake.query.userId != undefined) {
                        objInfo = { domain: socket.handshake.query.domain, userId: socket.handshake.query.userId, socketId: socket.id };
                        this.allclient.push(objInfo);
                        this.removeDuplicateSocket(this.allclient, "socketId");
                    }
                    if (socket.handshake.query.domain == 'PWSC' && socket.handshake.query.branch_id != undefined) {
                        objInfo = { domain: socket.handshake.query.domain, branch_id: socket.handshake.query.branch_id, socketId: socket.id };
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
                socket.on("info", (data, callback) => {
                    console.log("this is client info", data);
                    let objInfo = {};
                    if (data.domain == 'cc' && data.userId) {
                        objInfo = { domain: data.domain, userId: data.userId, socketId: socket.id };
                        this.allclient.push(objInfo);
                        this.removeDuplicateSocket(this.allclient, "socketId");
                    }
                    if (data.domain == 'PWSC' && data.branch_id) {
                        objInfo = { domain: data.domain, branch_id: data.branch_id, socketId: socket.id };
                        this.allclient.push(objInfo);
                        this.removeDuplicateSocket(this.allclient, "socketId");
                    }
                    callback('info recived successfully in backend');
                });
                socket.on("sendOrderToBackend", (details) => {
                    console.log("Received order from cc", details);
                    this.sendOrderToPos(details.branch_id, details, this.allclient, severSocketIO);
                });
                // socket.on("sendComplaintToBackend", (details: any) => {
                //   console.log("Received complaints from cc",details)
                //   this.sendComplaintToPos(details.branch_id, details, this.allclient, severSocketIO)
                // });
                socket.on("sendComplaintToBackend", (data, callback) => {
                    callback('complaints recived successfully in backend');
                    console.log("complaint recived", data);
                    this.sendComplaintToPos(data[0].branch_id, data, this.allclient, severSocketIO);
                });
                socket.on("logout", (details) => {
                    this.logout(details, socket.id);
                });
                socket.on("disconnect", (details) => {
                    this.logout(details, socket.id);
                });
            });
        });
    }
    sendbranchNotificationTest(toBranch_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("sens to this user", toBranch_id);
            console.log("this.allclient", this.allclient);
        });
    }
    sendOrderToPos(branch_id, data, clients, severSocketIO) {
        console.log("sendOrderToPos this branch", branch_id);
        console.log("this.allclinet", this.allclient);
        let checkuserIsActive = clients.filter((data1) => {
            return data1.branch_id == parseInt(branch_id);
        });
        console.log("checkuserIsActive", checkuserIsActive);
        if (checkuserIsActive.length > 0) {
            checkuserIsActive.forEach((entry) => {
                let SocketId = entry.socketId;
                console.log("===SocketId", SocketId);
                severSocketIO.in(SocketId).emit("sendOrderToPos", data);
            });
        }
    }
    sendComplaintToPos(branch_id, data, clients, severSocketIO) {
        console.log("sendComplaintToPos this branch", branch_id);
        console.log("this.allclinet", this.allclient);
        let checkuserIsActive = clients.filter((data1) => {
            return data1.branch_id == parseInt(branch_id);
        });
        console.log("checkuserIsActive", checkuserIsActive);
        if (checkuserIsActive.length > 0) {
            checkuserIsActive.forEach((entry) => {
                let SocketId = entry.socketId;
                console.log("===SocketId", SocketId);
                severSocketIO.in(SocketId).emit("sendComplaintToPos", data);
            });
        }
    }
    sendbranchNotification(toBranch_id, data, clients, severSocketIO) {
        console.log("sen to this user", toBranch_id);
        console.log("this.allclinet", this.allclient);
        let checkuserIsActive = clients.filter((data1) => {
            return data1.branch_id == parseInt(toBranch_id);
        });
        console.log("checkuserIsActive", checkuserIsActive);
        if (checkuserIsActive.length > 0) {
            checkuserIsActive.forEach((entry) => {
                let SocketId = entry.socketId;
                console.log("===data.length", data.length);
                console.log("===SocketId", SocketId);
                severSocketIO.in(SocketId).emit("sendBranchNotification", data);
            });
        }
        else {
            console.log("inside saved notification ", this.savedNotification);
            // let update = { storenotification: true };
            // const response = NotificationTable.update(update, {
            //   where: { notification_id: this.savedNotification },
            //   returning: true
            // });
        }
    }
    logout(details, socketId) {
        console.log("logout user", details, " socketId: ", socketId);
        console.log("all client before logout", this.allclient);
        let logoutFromAllclient = this.allclient.filter((data) => {
            return data.socketId != socketId;
        });
        this.allclient = logoutFromAllclient;
        // this.filewrite(this.allclient);
        console.log("allclient after logout", logoutFromAllclient);
    }
    removeDuplicateSocket(clients, socketId) {
        console.log("remove duplicate socketId");
        let newArray = [];
        let lookupObject = {};
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
    checkOnlineUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.readFile('socketusers.json', function (err, content) {
                let parseJson = JSON.parse(content);
                console.log("parseJson", parseJson);
                res.send(parseJson);
            });
        });
    }
}
exports.default = socketController;
//# sourceMappingURL=socket.js.map