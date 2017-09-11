/*=================================================================
 * The Method of get data of ROV whose data transported by SerialPort.
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
 * 文件：SerialPort.js
 *
 * 功能：存储 SerialHandler 模块。该模块针对该 ROV 的串口处理
 *  函数，即对串口模块 serialport 的二次封装；
 *===================================================
 */

// 串口方法
var Serialport = require("serialport");
// 数据分析方法（自定义模块）
var DataReader = require('./DataReader');

/*===================================================
 * 模块：SeralHandler
 *
 * 功能：针对该 ROV 的串口处理函数，即对串口模块 serialport
 *  的二次封装；
 *===================================================
 */
var SerialHandler = function (emitter) {
    // 设置事件发生器，事件由该对象其发生；
    var DataEmitter = emitter;

    /*=====================================================
     * 属性：portPath
     *
     * 功能：串口路径；
     *
     * 注：基本有两种模式：
     *   1. 测试模式：笔者使用 Linux 系统下的 socat 功能，输入命令如下：
     *    socat -d -d pty,raw,echo=0 pty,raw,echo=0
     *      则此时操作系统会生成一对虚拟串口。选取该对串口的某一个作为
     *  portPath 路径，即可发送 / 接收另一串口的数据；
     *   2. 实际模式：当插入串口 -> USB 设备后，在 Linux 系统下通常
     *  会出现文件 /dev/ttyUSB(x) ，此处的 (x) 为一个数字（通常为0）；
     *=====================================================
     */
    var portPath = '/dev/pts/11';
    // 波特率
    var baudrate = 115200;
    // 数据位
    var databits = 8;
    // 停止位
    var stopbits = 1;
    // 标志位，用于判断串口是否已经连接
    var serialConnected = false;

    // 串口连接对象
    var connection = new Serialport(
        portPath, {
            baudRate: baudrate,
            dataBits: databits,
            parity: 'none',
            stopBits: stopbits,
            flowControl: false
        }, false
    );

    // 自定义数据解析对象，并与顶层服务器的事件发生器绑定；
    var reader = new DataReader(emitter);


    /*=====================================================
     * 事件：open
     *
     * 所有者类型：serialport
     *
     * 功能：当该串口成功打开，则执行后面的回调函数；
     *      该处回调函数将标志位置为 true，并在终端显示提示信息；
     *=====================================================
     */
    connection.on('open', function(){
        serialConnected = true;
        console.log('Serial ' + portPath + " Success & Listening...");
        // var tmp_str = "Hello_World! at 8:00 pm";
        // connection.write(tmp_str);
    });

    /*=====================================================
     * 事件：close
     *
     * 所有者类型：serialport
     *
     * 功能：当该串口成功关闭，则执行后面的回调函数；
     *      该处回调函数将标志位置为 false，并在终端显示提示信息；
     *=====================================================
     */
    connection.on('close', function(data){
        console.log('Serial ' + portPath + " Closed.");
        serialConnected = false;
    });

    /*=====================================================
     * 事件：data
     *
     * 所有者类型：serialport
     *
     * 功能：当该串口成功接收到数据，则执行后面的回调函数；
     *      该处回调函数将收到的数据传递给数据解析对象 reader，并调用
     *  reader 的数据解析函数；
     *=====================================================
     */
    connection.on('data', function (data) {
        // console.log('Serial ' + portPath + "Data: " + data);
        var parseResult = reader.parseStatus(data);

    });


    /*=====================================================
     * 函数：write
     *
     * 功能：向该串口写入数据；
     *=====================================================
     */
    this.write = function(cmd){
        if(!serialConnected){
            // connection.write('memeda');
            console.log('Serial ' + portPath + " Write Error: Did't open the Serial!\n");
        }
        else{
            connection.write(cmd);
        }
    }
}

module.exports = SerialHandler;