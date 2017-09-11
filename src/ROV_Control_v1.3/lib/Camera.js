/*=================================================================
 * Run the mjpg-streamer in the ROV's Server.
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
 * 文件：Camera.js
 *
 * 功能：存储保存启动 mjpg-streamer 视频流的函数；
 *===================================================
 */

// 文件操作方法
var fs = require('fs');
// 终端交互方法
var spawn = require("child_process").spawn;

/*=====================================================
 * 函数：Camera
 *
 * 功能：通过 Javascript 脚本启动 mjpg-streamer 视频流；
 *=====================================================
 */
var Camera = function () {
    // 进程对象
    var process;

    //×××××××××××××××××××××××××××××××××××
    // 单独调试该模块时，用该部分被注释的代码
    //×××××××××××××××××××××××××××××××××××
    // var cmd = "../mjpg-streamer/mjpg_streamer"; // path til mjpg streamer
    // var videoDevicePath = "/dev/video0";
    // var inputPath = "../mjpg-streamer/input_uvc.so";
    // var outputPath = "../mjpg-streamer/output_http.so";
    // var wwwPath = "../mjpg-streamer/www"
    // var resolution = "640x480";
    // var framerate = 15;
    // var portNr = 3031;

    // mjpg-streamer 指令存储位置
    var cmd = "./mjpg-streamer/mjpg_streamer"; // path til mjpg streamer
    // 摄像机本机位置
    var videoDevicePath = "/dev/video0";
    // 输入所需库文件位置
    var inputPath = "./mjpg-streamer/input_uvc.so";
    // 输出所需库文件位置
    var outputPath = "./mjpg-streamer/output_http.so";
    // mjpg-streamer 所需 www 路径
    var wwwPath = "./mjpg-streamer/www"
    // 捕获视频流分辨率
    var resolution = "640x480";
    // 捕获视频流帧率
    var framerate = 15;
    // mjpg-streamer 服务端口号
    var portNr = 3031;
    // mjpg-streamer 模式
    // 注：isMJPG = true: 则视频流为 MJPG 格式（默认值）
    //    isMJPG = false:则视频流为 YUV 格式
    var formMode = "";
    var isMJPG = false;
    if(!isMJPG){
        formMode = " -y ";
    }
    // mjpg-streamer 指令输入参数
    // 例：假设终端运行路径就在 mjpg-streamer 所在路径，则执行指令如下：
    //    ./mjpg-streamer -i "./input_uvc.so -r 640x480 -f 15 -y" -o "./output_http.so -p 3031 -w ./www"
    var mjpgStreamerArgs = [
        '-i',		// input
        inputPath + " -r " + resolution + " -f " + framerate + formMode,
        '-o',		// output
        outputPath + " -p " + portNr + " -w " + wwwPath
    ];
    // 标志位，是否正在捕获视频流；
    var isCapturing = false;

    /*=====================================================
     * 函数：capture
     *
     * 功能：通过 JavaScript 脚本运行 mjpg-streamer；
     *=====================================================
     */
    this.capture = function(){
        fs.exists(videoDevicePath, function(exists) {
            if (!exists) {
                console.log("Could not find camera");
                return;
            }
        });
        isCapturing = true;
        process = spawn(cmd, mjpgStreamerArgs);
        console.log("started camera");
    };
}

module.exports = Camera;
