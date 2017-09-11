/*=================================================================
 * Run the ROV's Server to Control the ROV & get its Information by
 * enter the correct website (correct IP & port number).
 *
 * Copyright (C) 2017 Chandler Geng. All rights reserved.
 *
 *     This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published
 * by the Free Software Foundation; either version 2 of the License, or (at
 * your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 *     You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc., 59
 * Temple Place, Suite 330, Boston, MA 02111-1307 USA
===================================================================
*/

/*===================================================
 * Version:
 *   v1.0: 实现了socket.io通信，即模拟了ROV服务端与陆上客户
 *   端的通信；
 *   v1.1: 把socket.io通信运用到自己的工程商，实现了自己的ROV
 *   服务端与陆上客户端的通信连接；（网页输入"ROV IP地址 +
 *   端口号3000"）
 *   v1.2: 实现了服务器端自动启动运行 mjpg-streamer 功能；
 *===================================================
 */

// 服务器端对象
var app = require('express')();
// http 对象
var http = require('http').Server(app);
// socket.io 对象
var io = require('socket.io')(http);
// 路径对象
var path = require('path');
// 事件发生器
var EventEmitter = require('events').EventEmitter;

// mjpg-streamer 捕获图像方法
var Camera = require('./lib/Camera');
// 串口处理方法
var serialHandler = require('./lib/SerialPort');

// 设置事件发生器，事件由该对象其发生；
var DataEmitter = new EventEmitter();
// 串口对象
var serialport = new serialHandler(DataEmitter);

/*=====================================================
 * 事件：SerialData
 *
 * 所有者类型：EventEmitter
 *
 * 功能：接收从串口端读取的数据；
 *      此处是模仿下位机 (如Arduino) 向服务器端 (即ROV) 传送
 *  串口数据，即模仿执行机构与服务器的信息交互；
 *      当前只完成了串口原始数据的读取，后续等到具体通讯协议确定后，
 *  需要加入各种对数据的解析函数。
 *=====================================================
 */
DataEmitter.on('SerialData', function(data){
    console.log('App Receive: ' + data);
});

// 设置端口号根目录网页路径；
// 例如此处设置：http://localhost:3000/ 的页面，即为该项目根目录下的 index.html 页面
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

/*=====================================================
 * 事件：connection
 *
 * 所有者类型：socket.io
 *
 * 功能：当存在连接，且该连接链接到了该 socket 对象 (IP, 端口号匹配)
 *   则执行后面的回调函数；
 *      该处回调函数内部存入了其他的回调函数，即在该 socket 对象与
 *   连接到其他对象的前提下，才会执行其他的回调函数；
 *
 * 注：
 *      假设 ROV 的 IP 为：192.168.1.100，则局域网段下的浏览器
 *   访问：http://192.168.1.100:3000，即可启动该 socket 对象，
 *   并运行其回调函数；
 *=====================================================
 */
io.on('connection', function(socket){
    // 局域网段访问该服务器所在 IP 的该端口时，则服务器端的终端显示提示信息；
    console.log('a user connected');

    /*=====================================================
     * 事件：disconnect
     *
     * 所有者类型：socket.io
     *
     * 功能：当该连接与该 socket 对象断开，则执行后面的回调函数；
     *      该处回调函数在服务器终端输出用户断线的提示；
     *=====================================================
     */
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    /*=====================================================
     * 事件：client-send
     *
     * 所有者类型：socket.io
     *
     * 功能：当该 socket 对象监控收到来自客户端浏览器页面发来的 client-send
     *  信号时，运行该回调函数；
     *      该处回调函数只是简单的在服务器终端输出收到的信息，并将收到
     *  的信息通过发送 server-send 信号回传给客户端浏览器（此处只是为
     *  了测试服务器与客户端的连接功能，还待加入后续的具体功能）；
     *=====================================================
     */
    socket.on('client-send', function(msg){
        console.log('Command: ' + msg);

        io.emit('server-send', "Server's Info: " + msg);
    });
});

// mjpg-streamer 摄像头方法
var cam = new Camera();
// 捕获 mjpg-streamer 视频流
cam.capture();

// 设置该服务器运行端口为 3000
app.set('port', process.env.PORT || 3000);

// 监听服务器端口，如果成功开启端口并运行服务，则在服务器终端输出相关信息；
var server = http.listen(app.get('port'), function() {
    console.log('start at port: ' + server.address().port);
});