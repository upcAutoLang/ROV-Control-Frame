/*=================================================================
 * Parse the raw data which transport by serialport and get useful data
 * from the raw data.
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
 * 文件：DataReader.js
 *
 * 功能：存储 DataReader 模块。该模块对传入的数据进行分析解算；
 *===================================================
 */

var EventEmitter = require('events').EventEmitter;

/*===================================================
 * 模块：DataReader
 *
 * 参数：
 *   emitter: 绑定上一级的事件发生器；
 *
 * 功能：对传入的数据进行分析解算；
 *===================================================
 */
var DataReader = function (emitter) {
    // 事件发生器
    var reader = emitter;
    // 原始传入的数据
    var rawData;

    /*=====================================================
     * 函数：parseStatus
     *
     * 参数：
     *   src: 输入原始数据；
     *
     * 功能：对传入的数据进行分析解算；
     *
     * 注：
     *   该函数在当前的框架构建过程中，只是简单的在控制台打印原始信息，
     * 并将原始信息回传给串口；
     *   待后续的与下位机通讯协议确定后，则需要继续添加具体的数据解析函数；
     *=====================================================
     */
    reader.parseStatus = function(src) {
        rawData = src;
        console.log("DataReader source: " + rawData);
        reader.emit('SerialData', rawData);

        return src;
    }

    return reader;
};

module.exports = DataReader;