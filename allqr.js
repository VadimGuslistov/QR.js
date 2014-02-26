var non_webworker = (function (){

//=============================

/*
QR.js - Kenneth Lichtenberger 2014

optimised QR code reader for HTML5 utilising web workers

Unless in conflict with original license of derived or copied work this code is licensed for all to use and read under the terms of the MIT licence

------------------------
The MIT License (MIT)

Copyright (c)  2014 Kenneth Lichtenberger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 
*/


/*

This code was derived by Kenneth Lichtenberger from StackBlur 
The algo is the same - contains speed tweaks and is adapted to work with a 8bit Gray array


Creidt for the algo goes to:
------------------------------------------------------
StackBlur - a fast almost Gaussian Blur For Canvas

Author:        Mario Klingemann
Contact:     mario@quasimondo.com
Website:    http://www.quasimondo.com/StackBlurForCanvas
Twitter:    @quasimondo

/-----------------------------------------------------

StackBlur Copyright verbatim form org code:
------------------------------------------------------
Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS pgOVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXpgESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
/-----------------------------------------------------
*/

;var blurMachineGray=(function (){
//===============================

var mul_table = new Uint16Array([
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259]);
        
   
var shg_table = new Uint8Array([
         9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ]);



function blurMachineGray(width, height, radius){
    var div = radius + radius + 1
    var radiusPlus1  = radius + 1
    var stackStart = new BlurStack()
    var stack = stackStart
    var stackEnd
    var i = 1
    do{
        stack = stack.next = new BlurStack()
        stackEnd = ( i++ == radiusPlus1 )? stack:stackEnd
    }while(i < div)
    stack.next = stackStart
    this.sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) * 0.5
    this.mul_sum = mul_table[radius];
    this.shg_sum = shg_table[radius];
    this.radiusPlus1 = radiusPlus1
    this.stackStart= stackStart
    this.stackEnd = stackEnd
    this.widthMinus1 = width-1
    this.heightMinus1 = height -1
    this.width = width
    this.height = height
    this.pixels = new Uint8Array(width*height)
}
blurMachineGray.prototype = {
    blur:function(buff){
        this.pixels.set(buff)
        var x, y, i,  yp, yi, yw, sum,
        out_sum,
        in_sum,
        pg, bs,tmp;
    

    
    
        
        var stackIn ;
        var stackOut ;
    
        y = yw = yi = 0;
    
       
        do{
            i = in_sum = sum = 0;
    
            out_sum = this.radiusPlus1 * ( pg = this.pixels[yi] );
    
    
            sum += this.sumFactor * pg;
    
    
            stack = this.stackStart;

            do{
                stack.v = pg;
                stack = stack.next;
                i++
            }while(i < this.radiusPlus1)
            i = 1
            do{
    
                sum += ( stack.v = ( pg = this.pixels[yi + ( this.widthMinus1  + ((tmp = i - this.widthMinus1) & (tmp >> 31)) )])) * ( bs = this.radiusPlus1 - i );
    
                in_sum += pg;
    
                stack = stack.next;
                i++
            }while(i < this.radiusPlus1)
    
    
            stackIn = this.stackStart;
            stackOut = this.stackEnd;
            x=0
    
            do{
                this.pixels[yi]  = (sum * this.mul_sum) >> this.shg_sum;
    
    
                sum -= out_sum;
    
    
                out_sum -= stackIn.v;
    
    
    
                in_sum += ( stackIn.v = this.pixels[yw + ( this.widthMinus1  + ((tmp = (x + this.radiusPlus1 ) - this.widthMinus1) & (tmp >> 31)) )]);
    
    
                sum += in_sum;
    
    
                stackIn = stackIn.next;
    
                out_sum += ( pg = stackOut.v );
    
    
                in_sum -= pg;
    
    
                stackOut = stackOut.next;
    
                yi++;
                x++
            }while(x < this.width)
            yw += this.width;
            y++
        }while(y < this.height)
    
        x=0
    
        do{
            in_sum = sum = 0;
    
            yi = x;
            out_sum = this.radiusPlus1 * ( pg = this.pixels[yi]);
    
    
            sum += this.sumFactor * pg;
    
    
            stack = this.stackStart;
            i=0
            do{
                stack.v = pg;
                stack = stack.next;
                i++
            }while(i<this.radiusPlus1)
            
    
            yp = this.width;
    
            i=1
    
            do{
    
                sum += ( stack.v = ( pg = this.pixels[yp + x])) * ( bs = this.radiusPlus1 - i );
    
    
                in_sum += pg;
    
    
                stack = stack.next;
    
        
                yp += this.width^(this.width ^ (i-this.heightMinus1))&this.width;
    
                i++
            }while(i <this.radiusPlus1)
    
            yi = x;
            stackIn = this.stackStart;
            stackOut = this.stackEnd;
            y=0
            do{
                
                this.pixels[yi]   = (sum * this.mul_sum) >> this.shg_sum;
    
    
                sum -= out_sum;
    
    
                out_sum -= stackIn.v;
    
    
    
                sum += ( in_sum += ( stackIn.v = this.pixels[x + ( this.heightMinus1  + ((tmp = (y + this.radiusPlus1 ) - this.heightMinus1) & (tmp >> 31)) )*this.width]));
    
    
                stackIn = stackIn.next;
    
                out_sum += ( pg = stackOut.v );
    
    
                in_sum -= pg;
    
    
                stackOut = stackOut.next;
    
                yi += this.width;
                y++
            }while(y < this.height)
            x++
        }while(x < this.width)

    }
}


function BlurStack()
{
    this.v = 0
    this.next = null;
}
return blurMachineGray
//===============================

})();

//code below this line did not come from BlurStack

 /*
  
  the code below this line was derived from a port of ZXing to JavaScript by Lazar Laszlo
  Much of the code has been modified for speed and to fit well as a JavaScript library
  
  Copyright from org code:
  ----------------------------------------------
  Ported to JavaScript by Lazar Laszlo 2011 
  
  lazarsoft@gmail.com, www.lazarsoft.info
  

*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
  ----------------------------------------------

*/


var GridSampler = {};

GridSampler.checkAndNudgePoints=function( image,  points)
        {
            var width = qrcode.width;
            var height = qrcode.height;
            // Check and nudge points from start until we see some that are OK:
            var nudged = true;
            for (var offset = 0; offset < points.length && nudged; offset += 2)
            {
                var x = Math.floor (points[offset]);
                var y = Math.floor( points[offset + 1]);
                if (x < - 1 || x > width || y < - 1 || y > height)
                {
                    throw "Error.checkAndNudgePoints ";
                }
                nudged = false;
                if (x == - 1)
                {
                    points[offset] = 0.0;
                    nudged = true;
                }
                else if (x == width)
                {
                    points[offset] = width - 1;
                    nudged = true;
                }
                if (y == - 1)
                {
                    points[offset + 1] = 0.0;
                    nudged = true;
                }
                else if (y == height)
                {
                    points[offset + 1] = height - 1;
                    nudged = true;
                }
            }
            // Check and nudge points from end:
            nudged = true;
            for (var offset = points.length - 2; offset >= 0 && nudged; offset -= 2)
            {
                var x = Math.floor( points[offset]);
                var y = Math.floor( points[offset + 1]);
                if (x < - 1 || x > width || y < - 1 || y > height)
                {
                    throw "Error.checkAndNudgePoints ";
                }
                nudged = false;
                if (x == - 1)
                {
                    points[offset] = 0.0;
                    nudged = true;
                }
                else if (x == width)
                {
                    points[offset] = width - 1;
                    nudged = true;
                }
                if (y == - 1)
                {
                    points[offset + 1] = 0.0;
                    nudged = true;
                }
                else if (y == height)
                {
                    points[offset + 1] = height - 1;
                    nudged = true;
                }
            }
        }



GridSampler.sampleGrid3=function( image,  dimension,  transform)
        {
            var bits = new BitMatrix(dimension);
            var points = new Float32Array(dimension << 1);
            for (var y = 0; y < dimension; y++)
            {
                var max = points.length;
                var iValue =  y + 0.5;
                for (var x = 0; x < max; x += 2)
                {
                    points[x] =  (x >> 1) + 0.5;
                    points[x + 1] = iValue;
                }
                transform.transformPoints1(points);
                // Quick check to see if points transformed to something inside the image;
                // sufficient to check the endpoints
                GridSampler.checkAndNudgePoints(image, points);
               
                    for (var x = 0; x < max; x += 2)
                    {
                        var bit = image[Math.floor( points[x])+ qrcode.width* Math.floor( points[x + 1])];

                        //bits[x >> 1][ y]=bit;
                        if(bit)
                            bits.set_Renamed(x >> 1, y);
                    }
               
            }
            return bits;
        }

GridSampler.sampleGridx=function( image,  dimension,  p1ToX,  p1ToY,  p2ToX,  p2ToY,  p3ToX,  p3ToY,  p4ToX,  p4ToY,  p1FromX,  p1FromY,  p2FromX,  p2FromY,  p3FromX,  p3FromY,  p4FromX,  p4FromY)
{
    var transform = PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY);

    return GridSampler.sampleGrid3(image, dimension, transform);
}



function ECB(count,  dataCodewords)
{
    this.count = count;
    this.dataCodewords = dataCodewords;

  
    this.__defineGetter__("DataCodewords", function()
    {
        return this.dataCodewords;
    });
}

function ECBlocks( ecCodewordsPerBlock,  ecBlocks1,  ecBlocks2)
{
    var ecbArray
    var totalCodewords
    
    if(ecBlocks2){
        ecbArray = [ecBlocks1, ecBlocks2]
        totalCodewords = ecBlocks1.count * (ecBlocks1.dataCodewords + ecCodewordsPerBlock) + ecBlocks2.count * (ecBlocks2.dataCodewords + ecCodewordsPerBlock)
    }else{
        ecbArray = [ecBlocks1]
        totalCodewords = ecBlocks1.count * (ecBlocks1.dataCodewords + ecCodewordsPerBlock)
    }
        


    this.ecCodewordsPerBlock = ecCodewordsPerBlock|0;
    this.totalCodewords = totalCodewords|0
    this.ecBlocks = ecbArray
    

}

function Version( versionNumber,  alignmentPatternCenters,  ecBlocks1,  ecBlocks2,  ecBlocks3,  ecBlocks4)
{
    this.versionNumber = versionNumber|0;
    this.dimensionForVersion = (17 + 4 * versionNumber)|0
    this.alignmentPatternCenters = alignmentPatternCenters;
    this.ecBlocks = [ecBlocks1, ecBlocks2, ecBlocks3, ecBlocks4]
    this.functionPattern = {pattren:false} // wrap this in a obj so the hidden class dose not change when a pattern is made
    this.totalCodewords = ecBlocks1.totalCodewords;
    this.masks = {}
}

Version.prototype = {
    getMask:function (maskNum){
        var mask = this.masks[maskNum]
        if(mask) return mask
        this['buildDataMask'+maskNum]()
        return this.masks[maskNum]
    },
    setMask:function(maskNum,mask){
        // this seemingly unnecessary function is here due to the fact js objects in hash mode will force a function to de-optimise
        // therefore putting the setting in a separate function will isolate the de-optimization to a small point 
        this.masks[maskNum] = mask
    },
    buildDataMask0:function (){
        var bitMatrix = new BitMatrix(this.dimensionForVersion);
        var i = 0
        var j = 0
        var tmp

        //(i + j) mod 2 == 0
        do{
            if( -((i + j) & 0x01)>>31^-1 )bitMatrix.set_Renamed(j,i)
            
            j++
            tmp = (j-this.dimensionForVersion)>>31
            j &= tmp
            i += 1&(tmp^1)
        }while(i<this.dimensionForVersion)
        this.setMask(0,bitMatrix)
       
    },
    buildDataMask1:function (){
        var bitMatrix = new BitMatrix(this.dimensionForVersion);
        var i = 0
        var j = 0
        var tmp
        //(i + j) mod 2 == 0
        do{
            if( (-(i & 0x01)>>31^-1) )bitMatrix.set_Renamed(j,i)
            
            j++
            tmp = (j-this.dimensionForVersion)>>31
            j &= tmp
            i += 1&(tmp^1)
        }while(i<this.dimensionForVersion)
        
        this.setMask(1,bitMatrix)
    },
    buildDataMask2:function (){
        var bitMatrix = new BitMatrix(this.dimensionForVersion);
        var i = 0
        var j = 0
        var tmp
        // j % 3 == 0;
        do{
            if( (-(j % 3)>>31^-1) )bitMatrix.set_Renamed(j,i)
            
            j++
            tmp = (j-this.dimensionForVersion)>>31
            j &= tmp
            i += 1&(tmp^1)
        }while(i<this.dimensionForVersion)
        
        this.setMask(2,bitMatrix)
    },
    buildDataMask3:function (){
        var bitMatrix = new BitMatrix(this.dimensionForVersion);
        var i = 0
        var j = 0
        var tmp
        //  (i + j) % 3 == 0
        do{
            if( (-((i + j) % 3)>>31^-1) )bitMatrix.set_Renamed(j,i)
            
            j++
            tmp = (j-this.dimensionForVersion)>>31
            j &= tmp
            i += 1&(tmp^1)
        }while(i<this.dimensionForVersion)
        
        this.setMask(3,bitMatrix)
    },
    buildDataMask4:function (){
        var bitMatrix = new BitMatrix(this.dimensionForVersion);
        var i = 0
        var j = 0
        var tmp
        //(i/2 + j/3) % 2 == 0
        do{ // bit shift short-cuts can not be taken here ! X 0.3333333333 short-cuts can not be taken here 
            if( -(( (i>>1) + (j/3)|0) &0x01)>>31^-1 )bitMatrix.set_Renamed(j,i)
            
            j++
            tmp = (j-this.dimensionForVersion)>>31
            j &= tmp
            i += 1&(tmp^1)
        }while(i<this.dimensionForVersion)
        
        this.setMask(4,bitMatrix)
    },
    buildDataMask5:function (){
        var bitMatrix = new BitMatrix(this.dimensionForVersion);
        var i = 0
        var j = 0
        var tmp
        var tmp2
        // xy % 2 + xy % 3 == 0
        do{
            tmp2 = i*j
            if( (-((tmp2 & 0x01) + (tmp2 %3))>>31^-1) )bitMatrix.set_Renamed(j,i)
            
            j++
            tmp = (j-this.dimensionForVersion)>>31
            j &= tmp
            i += 1&(tmp^1)
        }while(i<this.dimensionForVersion)
        
        this.setMask(5,bitMatrix)
    },
    buildDataMask6:function (){
        var bitMatrix = new BitMatrix(this.dimensionForVersion);
        var i = 0
        var j = 0
        var tmp
        var tmp2
        // (xy % 2 + xy % 3) % 2 == 0
        do{
            tmp2 = i*j


            if( (-((((tmp2 & 0x01) + (tmp2 % 3)) & 0x01))>>31^-1) )bitMatrix.set_Renamed(j,i)  //  
            
            j++
            tmp = (j-this.dimensionForVersion)>>31
            j &= tmp
            i += 1&(tmp^1)
        }while(i<this.dimensionForVersion)
        
        this.setMask(6,bitMatrix)
    },
    buildDataMask7:function (){
        var bitMatrix = new BitMatrix(this.dimensionForVersion);
        var i = 0
        var j = 0
        var tmp
        //  ((x+y) % 2 + xy % 3) % 2 == 0
        do{



            if( (-( (( ((i+j) & 0x01) + ((i*j) % 3) ) & 0x01) )>>31^-1) )bitMatrix.set_Renamed(j,i)  
            
            j++
            tmp = (j-this.dimensionForVersion)>>31
            j &= tmp
            i += 1&(tmp^1)
        }while(i<this.dimensionForVersion)
        
        this.setMask(7,bitMatrix)
    },
    buildFunctionPattern:function(){
        if(this.functionPattern.pattren !== false){
            return this.functionPattern.pattren
        }
        var dimension = this.dimensionForVersion;
        var bitMatrix = new BitMatrix(dimension);

        // Top left finder pattern + separator + format
        bitMatrix.setRegion(0, 0, 9, 9);
        // Top right finder pattern + separator + format
        bitMatrix.setRegion(dimension - 8, 0, 8, 9);
        // Bottom left finder pattern + separator + format
        bitMatrix.setRegion(0, dimension - 8, 9, 8);

        // Alignment patterns
        var max = this.alignmentPatternCenters.length;
        for (var x = 0; x < max; x++)
        {
            var i = this.alignmentPatternCenters[x] - 2;
            for (var y = 0; y < max; y++)
            {
                if ((x == 0 && (y == 0 || y == max - 1)) || (x == max - 1 && y == 0))
                {
                    // No alignment patterns near the three finder paterns
                    continue;
                }
                bitMatrix.setRegion(this.alignmentPatternCenters[y] - 2, i, 5, 5);
            }
        }

        // Vertical timing pattern
        bitMatrix.setRegion(6, 9, 1, dimension - 17);
        // Horizontal timing pattern
        bitMatrix.setRegion(9, 6, dimension - 17, 1);

        if (this.versionNumber > 6)
        {
            // Version info, top right
            bitMatrix.setRegion(dimension - 11, 0, 3, 6);
            // Version info, bottom left
            bitMatrix.setRegion(0, dimension - 11, 6, 3);
        }
        this.functionPattern.pattren = bitMatrix
        return bitMatrix
    },
    getECBlocksForLevel:function( ecLevel){
        return this.ecBlocks[ecLevel.ordinal];
    }
}

Version.VERSION_DECODE_INFO = new Uint32Array([0x07C94, 0x085BC, 0x09A99, 0x0A4D3, 0x0BBF6, 0x0C762, 0x0D847, 0x0E60D, 0x0F928, 0x10B78, 0x1145D, 0x12A17, 0x13532, 0x149A6, 0x15683, 0x168C9, 0x177EC, 0x18EC4, 0x191E1, 0x1AFAB, 0x1B08E, 0x1CC1A, 0x1D33F, 0x1ED75, 0x1F250, 0x209D5, 0x216F0, 0x228BA, 0x2379F, 0x24B0B, 0x2542E, 0x26A64, 0x27541, 0x28C69]);

Version.VERSIONS = buildVersions();

Version.getVersionForNumber=function( versionNumber)
{
    if (versionNumber < 1 || versionNumber > 40)
    {
        throw "ArgumentException";
    }
    return Version.VERSIONS[versionNumber - 1];
}

Version.getProvisionalVersionForDimension=function(dimension)
{
    if (dimension % 4 != 1)
    {
        throw "Error getProvisionalVersionForDimension";
    }
    
        return Version.getVersionForNumber((dimension - 17) >> 2);
   
}

Version.decodeVersionInformation=function( versionBits)
{
    var bestDifference = 32;
    var bestVersion = 0;
    for (var i = 0; i < Version.VERSION_DECODE_INFO.length; i++)
    {
        var targetVersion = Version.VERSION_DECODE_INFO[i];
        // Do the version info bits match exactly? done.
        if (targetVersion == versionBits)
        {
            return this.getVersionForNumber(i + 7);
        }
        // Otherwise see if this is the closest to a real version info bit string
        // we have seen so far
        //var bitsDifference = FormatInformation.numBitsDiffering(versionBits, targetVersion);
        var bitsDifference = numBitsDiffering(versionBits, targetVersion);
        if (bitsDifference < bestDifference)
        {
            bestVersion = i + 7;
            bestDifference = bitsDifference;
        }
    }
    // We can tolerate up to 3 bits of error since no two version info codewords will
    // differ in less than 4 bits.
    if (bestDifference <= 3)
    {
        return this.getVersionForNumber(bestVersion);
    }
    // If we didn't find a close enough match, fail
    return null;
}

function buildVersions()
{
    return [
    new Version(1, new Uint8Array(0), new ECBlocks(7, new ECB(1, 19)), new ECBlocks(10, new ECB(1, 16)), new ECBlocks(13, new ECB(1, 13)), new ECBlocks(17, new ECB(1, 9))), 
    new Version(2, new Uint8Array([6, 18]), new ECBlocks(10, new ECB(1, 34)), new ECBlocks(16, new ECB(1, 28)), new ECBlocks(22, new ECB(1, 22)), new ECBlocks(28, new ECB(1, 16))), 
    new Version(3, new Uint8Array([6, 22]), new ECBlocks(15, new ECB(1, 55)), new ECBlocks(26, new ECB(1, 44)), new ECBlocks(18, new ECB(2, 17)), new ECBlocks(22, new ECB(2, 13))), 
    new Version(4, new Uint8Array([6, 26]), new ECBlocks(20, new ECB(1, 80)), new ECBlocks(18, new ECB(2, 32)), new ECBlocks(26, new ECB(2, 24)), new ECBlocks(16, new ECB(4, 9))), 
    new Version(5, new Uint8Array([6, 30]), new ECBlocks(26, new ECB(1, 108)), new ECBlocks(24, new ECB(2, 43)), new ECBlocks(18, new ECB(2, 15), new ECB(2, 16)), new ECBlocks(22, new ECB(2, 11), new ECB(2, 12))), 
    new Version(6, new Uint8Array([6, 34]), new ECBlocks(18, new ECB(2, 68)), new ECBlocks(16, new ECB(4, 27)), new ECBlocks(24, new ECB(4, 19)), new ECBlocks(28, new ECB(4, 15))), 
    new Version(7, new Uint8Array([6, 22, 38]), new ECBlocks(20, new ECB(2, 78)), new ECBlocks(18, new ECB(4, 31)), new ECBlocks(18, new ECB(2, 14), new ECB(4, 15)), new ECBlocks(26, new ECB(4, 13), new ECB(1, 14))), 
    new Version(8, new Uint8Array([6, 24, 42]), new ECBlocks(24, new ECB(2, 97)), new ECBlocks(22, new ECB(2, 38), new ECB(2, 39)), new ECBlocks(22, new ECB(4, 18), new ECB(2, 19)), new ECBlocks(26, new ECB(4, 14), new ECB(2, 15))), 
    new Version(9, new Uint8Array([6, 26, 46]), new ECBlocks(30, new ECB(2, 116)), new ECBlocks(22, new ECB(3, 36), new ECB(2, 37)), new ECBlocks(20, new ECB(4, 16), new ECB(4, 17)), new ECBlocks(24, new ECB(4, 12), new ECB(4, 13))), 
    new Version(10, new Uint8Array([6, 28, 50]), new ECBlocks(18, new ECB(2, 68), new ECB(2, 69)), new ECBlocks(26, new ECB(4, 43), new ECB(1, 44)), new ECBlocks(24, new ECB(6, 19), new ECB(2, 20)), new ECBlocks(28, new ECB(6, 15), new ECB(2, 16))), 
    new Version(11, new Uint8Array([6, 30, 54]), new ECBlocks(20, new ECB(4, 81)), new ECBlocks(30, new ECB(1, 50), new ECB(4, 51)), new ECBlocks(28, new ECB(4, 22), new ECB(4, 23)), new ECBlocks(24, new ECB(3, 12), new ECB(8, 13))), 
    new Version(12, new Uint8Array([6, 32, 58]), new ECBlocks(24, new ECB(2, 92), new ECB(2, 93)), new ECBlocks(22, new ECB(6, 36), new ECB(2, 37)), new ECBlocks(26, new ECB(4, 20), new ECB(6, 21)), new ECBlocks(28, new ECB(7, 14), new ECB(4, 15))), 
    new Version(13, new Uint8Array([6, 34, 62]), new ECBlocks(26, new ECB(4, 107)), new ECBlocks(22, new ECB(8, 37), new ECB(1, 38)), new ECBlocks(24, new ECB(8, 20), new ECB(4, 21)), new ECBlocks(22, new ECB(12, 11), new ECB(4, 12))), 
    new Version(14, new Uint8Array([6, 26, 46, 66]), new ECBlocks(30, new ECB(3, 115), new ECB(1, 116)), new ECBlocks(24, new ECB(4, 40), new ECB(5, 41)), new ECBlocks(20, new ECB(11, 16), new ECB(5, 17)), new ECBlocks(24, new ECB(11, 12), new ECB(5, 13))), 
    new Version(15, new Uint8Array([6, 26, 48, 70]), new ECBlocks(22, new ECB(5, 87), new ECB(1, 88)), new ECBlocks(24, new ECB(5, 41), new ECB(5, 42)), new ECBlocks(30, new ECB(5, 24), new ECB(7, 25)), new ECBlocks(24, new ECB(11, 12), new ECB(7, 13))), 
    new Version(16, new Uint8Array([6, 26, 50, 74]), new ECBlocks(24, new ECB(5, 98), new ECB(1, 99)), new ECBlocks(28, new ECB(7, 45), new ECB(3, 46)), new ECBlocks(24, new ECB(15, 19), new ECB(2, 20)), new ECBlocks(30, new ECB(3, 15), new ECB(13, 16))), 
    new Version(17, new Uint8Array([6, 30, 54, 78]), new ECBlocks(28, new ECB(1, 107), new ECB(5, 108)), new ECBlocks(28, new ECB(10, 46), new ECB(1, 47)), new ECBlocks(28, new ECB(1, 22), new ECB(15, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(17, 15))), 
    new Version(18, new Uint8Array([6, 30, 56, 82]), new ECBlocks(30, new ECB(5, 120), new ECB(1, 121)), new ECBlocks(26, new ECB(9, 43), new ECB(4, 44)), new ECBlocks(28, new ECB(17, 22), new ECB(1, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(19, 15))), 
    new Version(19, new Uint8Array([6, 30, 58, 86]), new ECBlocks(28, new ECB(3, 113), new ECB(4, 114)), new ECBlocks(26, new ECB(3, 44), new ECB(11, 45)), new ECBlocks(26, new ECB(17, 21), new ECB(4, 22)), new ECBlocks(26, new ECB(9, 13), new ECB(16, 14))), 
    new Version(20, new Uint8Array([6, 34, 62, 90]), new ECBlocks(28, new ECB(3, 107), new ECB(5, 108)), new ECBlocks(26, new ECB(3, 41), new ECB(13, 42)), new ECBlocks(30, new ECB(15, 24), new ECB(5, 25)), new ECBlocks(28, new ECB(15, 15), new ECB(10, 16))), 
    new Version(21, new Uint8Array([6, 28, 50, 72, 94]), new ECBlocks(28, new ECB(4, 116), new ECB(4, 117)), new ECBlocks(26, new ECB(17, 42)), new ECBlocks(28, new ECB(17, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(19, 16), new ECB(6, 17))), 
    new Version(22, new Uint8Array([6, 26, 50, 74, 98]), new ECBlocks(28, new ECB(2, 111), new ECB(7, 112)), new ECBlocks(28, new ECB(17, 46)), new ECBlocks(30, new ECB(7, 24), new ECB(16, 25)), new ECBlocks(24, new ECB(34, 13))), 
    new Version(23, new Uint8Array([6, 30, 54, 74, 102]), new ECBlocks(30, new ECB(4, 121), new ECB(5, 122)), new ECBlocks(28, new ECB(4, 47), new ECB(14, 48)), new ECBlocks(30, new ECB(11, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(16, 15), new ECB(14, 16))), 
    new Version(24, new Uint8Array([6, 28, 54, 80, 106]), new ECBlocks(30, new ECB(6, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(6, 45), new ECB(14, 46)), new ECBlocks(30, new ECB(11, 24), new ECB(16, 25)), new ECBlocks(30, new ECB(30, 16), new ECB(2, 17))), 
    new Version(25, new Uint8Array([6, 32, 58, 84, 110]), new ECBlocks(26, new ECB(8, 106), new ECB(4, 107)), new ECBlocks(28, new ECB(8, 47), new ECB(13, 48)), new ECBlocks(30, new ECB(7, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(13, 16))), 
    new Version(26, new Uint8Array([6, 30, 58, 86, 114]), new ECBlocks(28, new ECB(10, 114), new ECB(2, 115)), new ECBlocks(28, new ECB(19, 46), new ECB(4, 47)), new ECBlocks(28, new ECB(28, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(33, 16), new ECB(4, 17))), 
    new Version(27, new Uint8Array([6, 34, 62, 90, 118]), new ECBlocks(30, new ECB(8, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(22, 45), new ECB(3, 46)), new ECBlocks(30, new ECB(8, 23), new ECB(26, 24)), new ECBlocks(30, new ECB(12, 15),         new ECB(28, 16))),
    new Version(28, new Uint8Array([6, 26, 50, 74, 98, 122]), new ECBlocks(30, new ECB(3, 117), new ECB(10, 118)), new ECBlocks(28, new ECB(3, 45), new ECB(23, 46)), new ECBlocks(30, new ECB(4, 24), new ECB(31, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(31, 16))), 
    new Version(29, new Uint8Array([6, 30, 54, 78, 102, 126]), new ECBlocks(30, new ECB(7, 116), new ECB(7, 117)), new ECBlocks(28, new ECB(21, 45), new ECB(7, 46)), new ECBlocks(30, new ECB(1, 23), new ECB(37, 24)), new ECBlocks(30, new ECB(19, 15), new ECB(26, 16))), 
    new Version(30, new Uint8Array([6, 26, 52, 78, 104, 130]), new ECBlocks(30, new ECB(5, 115), new ECB(10, 116)), new ECBlocks(28, new ECB(19, 47), new ECB(10, 48)), new ECBlocks(30, new ECB(15, 24), new ECB(25, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(25, 16))), 
    new Version(31, new Uint8Array([6, 30, 56, 82, 108, 134]), new ECBlocks(30, new ECB(13, 115), new ECB(3, 116)), new ECBlocks(28, new ECB(2, 46), new ECB(29, 47)), new ECBlocks(30, new ECB(42, 24), new ECB(1, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(28, 16))), 
    new Version(32, new Uint8Array([6, 34, 60, 86, 112, 138]), new ECBlocks(30, new ECB(17, 115)), new ECBlocks(28, new ECB(10, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(10, 24), new ECB(35, 25)), new ECBlocks(30, new ECB(19, 15), new ECB(35, 16))), 
    new Version(33, new Uint8Array([6, 30, 58, 86, 114, 142]), new ECBlocks(30, new ECB(17, 115), new ECB(1, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(21, 47)), new ECBlocks(30, new ECB(29, 24), new ECB(19, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(46, 16))), 
    new Version(34, new Uint8Array([6, 34, 62, 90, 118, 146]), new ECBlocks(30, new ECB(13, 115), new ECB(6, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(44, 24), new ECB(7, 25)), new ECBlocks(30, new ECB(59, 16), new ECB(1, 17))), 
    new Version(35, new Uint8Array([6, 30, 54, 78, 102, 126, 150]), new ECBlocks(30, new ECB(12, 121), new ECB(7, 122)), new ECBlocks(28, new ECB(12, 47), new ECB(26, 48)), new ECBlocks(30, new ECB(39, 24), new ECB(14, 25)),new ECBlocks(30, new ECB(22, 15), new ECB(41, 16))), 
    new Version(36, new Uint8Array([6, 24, 50, 76, 102, 128, 154]), new ECBlocks(30, new ECB(6, 121), new ECB(14, 122)), new ECBlocks(28, new ECB(6, 47), new ECB(34, 48)), new ECBlocks(30, new ECB(46, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(2, 15), new ECB(64, 16))), 
    new Version(37, new Uint8Array([6, 28, 54, 80, 106, 132, 158]), new ECBlocks(30, new ECB(17, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(29, 46), new ECB(14, 47)), new ECBlocks(30, new ECB(49, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(24, 15), new ECB(46, 16))), 
    new Version(38, new Uint8Array([6, 32, 58, 84, 110, 136, 162]), new ECBlocks(30, new ECB(4, 122), new ECB(18, 123)), new ECBlocks(28, new ECB(13, 46), new ECB(32, 47)), new ECBlocks(30, new ECB(48, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(42, 15), new ECB(32, 16))), 
    new Version(39, new Uint8Array([6, 26, 54, 82, 110, 138, 166]), new ECBlocks(30, new ECB(20, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(40, 47), new ECB(7, 48)), new ECBlocks(30, new ECB(43, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(10, 15), new ECB(67, 16))), 
    new Version(40, new Uint8Array([6, 30, 58, 86, 114, 142, 170]), new ECBlocks(30, new ECB(19, 118), new ECB(6, 119)), new ECBlocks(28, new ECB(18, 47), new ECB(31, 48)), new ECBlocks(30, new ECB(34, 24), new ECB(34, 25)), new ECBlocks(30, new ECB(20, 15), new ECB(61, 16)))]
}



var FORMAT_INFO_MASK_QR = 0x5412;
var FORMAT_INFO_DECODE_LOOKUP = new Uint32Array([0x541200, 0x512501, 0x5E7C02, 0x5B4B03, 0x45F904, 0x40CE05, 0x4F9706, 0x4AA007, 0x77C408, 0x72F309, 0x7DAA0A, 0x789D0B, 0x662F0C, 0x63180D, 0x6C410E, 0x69760F, 0x168910, 0x13BE11, 0x1CE712, 0x19D013, 0x076214, 0x025515, 0x0D0C16, 0x083B17, 0x355F18, 0x306819, 0x3F311A, 0x3A061B, 0x24B41C, 0x21831D, 0x2EDA1E, 0x2BED1F])




function FormatInformation(formatInfo)
{
    this.errorCorrectionLevel = ErrorCorrectionLevel.forBits((formatInfo >> 3) & 0x03);
    this.dataMask =  (formatInfo & 0x07);

}




FormatInformation.fromMaskedFormatInfo=function( maskedFormatInfo,fail)
{
   // Find the int in FORMAT_INFO_DECODE_LOOKUP with fewest bits differing
	var bestDifference = 0xffffffff;
	var bestFormatInfo = 0;
	var decodeInfo,targetInfo
	var l = FORMAT_INFO_DECODE_LOOKUP.length
	var bitsDifference
	var i = 0
	do{
	   decodeInfo = targetInfo =  FORMAT_INFO_DECODE_LOOKUP[i++]
	   targetInfo = targetInfo >>> 8
	   decodeInfo = decodeInfo & 0xff
	   if (targetInfo == maskedFormatInfo){
			// Found an exact match
			return new FormatInformation(decodeInfo);
	   }
       bitsDifference = numBitsDiffering(maskedFormatInfo, targetInfo);
       if (bitsDifference < bestDifference){
			bestFormatInfo = decodeInfo;
			bestDifference = bitsDifference;
		}
	}while(i<l)
    // Hamming distance of the 32 masked codes is 7, by construction, so <= 3 bits
    // differing means we found a match
    if (bestDifference <= 3)
    {
        return new FormatInformation(bestFormatInfo);
    }
    if(fail){
        return null;
    }
    return FormatInformation.fromMaskedFormatInfo(maskedFormatInfo ^ FORMAT_INFO_MASK_QR,true)
    
}

    
function ErrorCorrectionLevel(ordinal,  bits)
{
	this.ordinal = ordinal;
	this.bits = bits;
}

ErrorCorrectionLevel.forBits=function( bits)
{
    var ret = ErrorCorrectionLevel.lvls[bits]
    if(!ret){
        throw "Invalid Error Correction Level"
    }
    return ret
}
ErrorCorrectionLevel.lvls = [
    new ErrorCorrectionLevel(1, 0x00), //M 
    new ErrorCorrectionLevel(0, 0x01), //L 
    new ErrorCorrectionLevel(3, 0x02), //H  
    new ErrorCorrectionLevel(2, 0x03)

]

function BitMatrix(dimension)
{
 
    var rowSize = dimension >> 5;
    if ((dimension & 31) != 0)
    {
        rowSize++;
    }
    this.dimension = dimension;
    // fix me it is belived that avoiding hitting the Arr will speed things up -- find out if this is actually true
    this.loaded = 0
    this.offset = 0

    
    this.rowSize = rowSize;
    this.bits = new Int32Array(rowSize * dimension);
    
    
}
BitMatrix.prototype = {
    load:function (x){
        this.bits[this.offset] = this.loaded
        this.loaded = this.bits[x]
        this.offset = x
    },
    get_Renamed:function( x,  y){
        var offset = y * this.rowSize + (x >> 5)
        if(offset != this.offset) this.load(offset)
        return this.loaded >>> (x & 31) & 1
    },
    set_Renamed:function( x,  y){
        var offset = y * this.rowSize + (x >> 5)
        if(offset != this.offset) this.load(offset)
        this.loaded |= 1 << (x & 31);
    },
    flip:function( x,  y){
        var offset = y * this.rowSize + (x >> 5)
        if(offset != this.offset) this.load(offset)
        this.loaded ^= 1 << (x & 31);
    },
    clear:function(){
        var l = this.bits.length
        var i = 0
        do{this.bits[i++]=0}while(i<l)
        this.loaded =0
        this.offset = 0
    },
    setRegion:function( left,  top,  width,  height){

        var right = left + width;
        var bottom = top + height;
        var y = top
        var x = left
        var offset,tmp,tmp2
        do{
            offset = y * this.rowSize + (x >> 5)
            if(offset != this.offset) this.load(offset)
            this.loaded |= 1 << (x & 31)
            // this avoids a nested loop - fix me - know if it was worth it
            x++
            tmp = (x-right)>>>31
            tmp2 = tmp^1
            x = (x ^ ((-tmp ^ x) & x)) | (left ^ ((-tmp2 ^ left) & left))
            y += tmp2
            ///////
            
        }while(y < bottom)
        
    },
    copyBit:function(x, y,  input) // it is assumed that a integer so large that it will get it sign bit set will not be passed here
    {
        var offset = y * this.rowSize + (x >> 5)
        if(offset != this.offset) this.load(offset)
        return (input << 1) | (this.loaded >>> (x & 31) & 1)
    },
    XOR_Matrix:function (b){
        this.load(0)
        var a = this.bits
        b = b.bits
        var l = a.length
        if(l != b.length) throw "Masking of a BitMatrix can only happen with a equal sized BitMatrix"
        var i = 0
        do{
            a[i] ^= b[i]
            i++
        }while(i<l)
        this.loaded = this.bits[0]
    }
    
}

function GF256Poly(field,  coefficients){    
    var coefficientsLength = coefficients.length;
    var _coefficients
    var firstNonZero
    var l
    var i
    if (coefficientsLength > 1 && coefficients[0] == 0){
        // Leading term must be non-zero for anything except the constant polynomial "0"
        firstNonZero = 1;
        while (firstNonZero < coefficientsLength && coefficients[firstNonZero] == 0){
            firstNonZero++;
        }
        
        if (firstNonZero == coefficientsLength){
            _coefficients = field.zero.coefficients;
        }
        else{
            l = coefficientsLength - firstNonZero
            i=0
            _coefficients = new Int32Array(l);
            do{_coefficients[i++] = coefficients[firstNonZero++]}while(i<l)
        }
    }else{
        _coefficients = coefficients;
    }
   
    this.field = field
    this.coefficients = _coefficients
    this.degree = _coefficients.length - 1
    
    
};

GF256Poly.prototype = {
    isZero:function (){
        return this.coefficients[0] == 0
    },
    getCoefficient:function( degree){
        return this.coefficients[this.degree - degree];
    },
    evaluateAt:function( a){
        var i,result,size
        if (a == 0)
        {
            // Just return the x^0 coefficient
            return this.coefficients[this.degree]
        }
        size = this.coefficients.length;
        if (a == 1)
        {
            // Just the sum of the coefficients
            result = 0;
            i = 0
            do{result ^=  this.coefficients[i++]}while(i<size)
            return result;
        }
        result = this.coefficients[0]
        i=1
        while(i<size){result = this.field.multiply(a, result) ^ this.coefficients[i++]}
        return result;
    },
    addOrSubtract:function( other){
        if (this.field != other.field)
        {
            throw "GF256Polys do not have same GF256 field"; // fix me can this happen in this code
        }
        if (this.isZero()){
            return other;
        }
        if (other.isZero()){
            return this;
        }
        var i,temp,sumDiff,lengthDiff
        var smallerCoefficients = this.coefficients;
        var largerCoefficients = other.coefficients;
        var smallerCoefficients_l = smallerCoefficients.length
        var largerCoefficients_l = largerCoefficients.length
        if (smallerCoefficients_l > largerCoefficients_l)
        {
            temp = smallerCoefficients;
            smallerCoefficients = largerCoefficients;
            largerCoefficients = temp;
            // XOR swap
            smallerCoefficients_l ^= largerCoefficients_l
            largerCoefficients_l ^= smallerCoefficients_l
            smallerCoefficients_l ^= largerCoefficients_l
            //---
            // fix me this swap avoids a 2nd call to length but is it faster than calling length a 2nd time - investigate
        }
        sumDiff = new Int32Array(largerCoefficients_l);
        lengthDiff = largerCoefficients_l - smallerCoefficients_l;
        // Copy high-order terms only found in higher-degree polynomial's coefficients

        i=0
        do{sumDiff[i]=largerCoefficients[i];i++}while(i<lengthDiff)
        i = lengthDiff
        do{sumDiff[i] = smallerCoefficients[i - lengthDiff] ^ largerCoefficients[i];i++}while(i < largerCoefficients_l)
        

        return new GF256Poly(this.field, sumDiff);
    },
    multiply1:function( other){
        if (this.field!=other.field)
        {
            throw "GF256Polys do not have same GF256 field"; // fix me - can this happen in this code
        }
        if (this.isZero() || other.isZero())
        {
            return this.field.zero;
        }
        var aCoefficients = this.coefficients;
        var aLength = aCoefficients.length;
        var bCoefficients = other.coefficients;
        var bLength = bCoefficients.length;
        var product = new Int32Array(aLength + bLength - 1);
        var i,j
        var aCoeff
        i=0
        do{
            aCoeff = aCoefficients[i]
            j=0
            do{product[i + j] ^=  this.field.multiply(aCoeff, bCoefficients[j]);j++}while(j < bLength)
            i++
        }while(i < aLength)
        return new GF256Poly(this.field, product);
    },
    multiply2:function( scalar){
        if (scalar == 0)
        {
            return this.field.zero;
        }
        if (scalar == 1)
        {
            return this;
        }
        var size = this.coefficients.length;
        var product = new Int32Array(size);
        var i=0
        do{product[i] = this.field.multiply(this.coefficients[i], scalar);i++}while(i<size)
        
        return new GF256Poly(this.field, product);
    },
    multiplyByMonomial:function( degree,  coefficient){
        if (degree < 0){
            throw "System.ArgumentException";
        }
        if (coefficient == 0){
            return this.field.zero;
        }
        var size = this.coefficients.length;
        var product = new Int32Array(size + degree);
        var i=0
        do{product[i] = this.field.multiply(this.coefficients[i], coefficient);i++}while(i<size)
        return new GF256Poly(this.field, product);
    },
    divide:function( other){
        if (this.field!=other.field)
        {
            throw "GF256Polys do not have same GF256 field"; // fix me can this happen in the QR code
        }
        if (other.isZero())
        {
            throw "Divide by 0";
        }

        var quotient = this.field.zero;
        var remainder = this;

        var denominatorLeadingTerm = other.getCoefficient(other.degree);
        var inverseDenominatorLeadingTerm = this.field.inverse(denominatorLeadingTerm);
        var degreeDifference,scale,iterationQuotient
        while (remainder.degree >= other.degree && !remainder.isZero()){
            degreeDifference = remainder.degree - other.degree;
            scale = this.field.multiply(remainder.getCoefficient(remainder.degree), inverseDenominatorLeadingTerm);
            term = other.multiplyByMonomial(degreeDifference, scale);
            iterationQuotient = this.field.buildMonomial(degreeDifference, scale);
            quotient = quotient.addOrSubtract(iterationQuotient);
            remainder = remainder.addOrSubtract(term);
        }

        return [quotient, remainder]
    }
};

function GF256( primitive)
{
    var expTable = new Int32Array(256);
    var logTable = new Int32Array(256);
    var x = 1
    var i = 0
    do{
        expTable[i] = x;
        logTable[x] = i;
        i++
        x <<= 1; // x = x * 2; we're assuming the generator alpha is 2
        //tmp = (x - 0x100)>>>31                      // <<-------------------------------------------------------------------
        //x = (x * tmp) | ((x ^ primitive) * (tmp^1)) // avoids a branch but is it faster than the branch - fix me Investigate
        if (x >= 256) {
            x = (x^primitive) &255 // this is how it is in the mainline zxing code but different than js port - fix me Investigate

        }
    
    }while(i<256)
    this.expTable = expTable
    this.logTable = logTable



    this.zero = new GF256Poly(this, GF256.zeroArr);
    this.one = new GF256Poly(this, GF256.oneArr);
       
}
GF256.prototype ={
     buildMonomial:function( degree,  coefficient){
        if (degree < 0)
        {
            throw "System.ArgumentException";
        }
        if (coefficient == 0)
        {
            return zero;
        }
        var coefficients = new Int32Array(degree + 1)
        coefficients[0] = coefficient
        return new GF256Poly(this, coefficients)
    },
    exp:function(a){
        return this.expTable[a];
    },
    log:function(a){
        if (a == 0)
        {
            throw "System.ArgumentException";
        }
        return this.logTable[a];
    },
    inverse:function( a){
        if (a == 0)
        {
            throw "System.ArithmeticException";
        }
        return this.expTable[256 - this.logTable[a]-1];
    },
    multiply:function( a,  b){
        if (a == 0 || b == 0)
        {
            return 0;
        }
        if (a == 1)
        {
            return b;
        }
        if (b == 1)
        {
            return a;
        }
        return this.expTable[(this.logTable[a] + this.logTable[b]) % 255]
    }    
}
GF256.zeroArr = new Int32Array([0])
GF256.oneArr = new Int32Array([1])


GF256.QR_CODE_FIELD = new GF256(0x011D);




function DataBlock(numDataCodewords,  numBlockCodewords){

    this.field = GF256.QR_CODE_FIELD 
    this.numDataCodewords = numDataCodewords
    this.codewords = new Uint8Array(numBlockCodewords)
    this.numECCodewords = numBlockCodewords - numDataCodewords
    this.numBlockCodewordsMinusOne = numBlockCodewords-1

}

DataBlock.prototype = {
    correct:function(){
            var poly = new GF256Poly(this.field, this.codewords)
            var twoS = this.numECCodewords
            var towSMinusOne = twoS-1
            var syndromeCoefficients = new Int32Array(twoS)
            var numBlockCodewordsMinusOne = this.numBlockCodewordsMinusOne
            var noError = true
            var _eval
            var i = 0
            do{
                // Thanks to sanfordsquires for this fix: // fix me is the sanfordsquires fix still in this code?
                _eval = poly.evaluateAt(this.field.exp(i));
                
                if (_eval != 0)
                {
                    syndromeCoefficients[towSMinusOne - i] = _eval;
                    noError = false
                }
                i++
            }while(i < twoS)
            if (noError) return // no errors found noting to do
            // correct errors if found
            var syndrome = new GF256Poly(this.field, syndromeCoefficients)
            var sigmaOmega = this.runEuclideanAlgorithm(this.field.buildMonomial(twoS, 1), syndrome, twoS)
  
            var errorLocations = this.findErrorLocations(sigmaOmega[0]);
            var errorMagnitudes = this.findErrorMagnitudes(sigmaOmega[1], errorLocations);
            var l = errorLocations.length
            i = 0
            var org,_new
            var hamming = 0
            do{
                var position = numBlockCodewordsMinusOne - this.field.log(errorLocations[i]);
                if (position < 0) throw "ReedSolomonException Bad error location"
                org = this.codewords[position]
                _new = (org ^ errorMagnitudes[i])


                 this.codewords[position] = _new
                i++
                
            }while(i<l)
 
    },

    runEuclideanAlgorithm:function( a,  b,  R){
        // Assume a's degree is >= b's
        var temp
        if (a.degree < b.degree)
        {
            temp = a;
            a = b;
            b = temp;
        }

        var rLast = a;
        var r = b;
        var tLast = this.field.zero;
        var t = this.field.one;
        var rDiv2 = R/2 
        // Run Euclidean algorithm until r's degree is less than R/2
        while (r.degree >=rDiv2)
        {
            var rLastLast = rLast;
            var tLastLast = tLast;
            rLast = r;
            tLast = t;

            // Divide rLastLast by rLast, with quotient in q and remainder in r
            if (rLast.isZero())
            {
                // Oops, Euclidean algorithm already terminated?
                throw "r_{i-1} was zero";
            }
            r = rLastLast;
            var q = this.field.zero;
            var denominatorLeadingTerm = rLast.getCoefficient(rLast.degree);
            var dltInverse = this.field.inverse(denominatorLeadingTerm);
            while (r.degree >= rLast.degree && !r.isZero())
            {
                var degreeDiff = r.degree - rLast.degree;
                var scale = this.field.multiply(r.getCoefficient(r.degree), dltInverse);
                q = q.addOrSubtract(this.field.buildMonomial(degreeDiff, scale));
                r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale));
            }

            t = q.multiply1(tLast).addOrSubtract(tLastLast);
             if (r.degree >= rLast.degree) {
                throw "Division algorithm failed to reduce polynomial?"
             }
        }

        var sigmaTildeAtZero = t.getCoefficient(0);
        if (sigmaTildeAtZero == 0)
        {
            throw "ReedSolomonException sigmaTilde(0) was zero";
        }

        var inverse = this.field.inverse(sigmaTildeAtZero);

        return [t.multiply2(inverse), r.multiply2(inverse)] // sigma  omega
    },
    findErrorLocations:function( errorLocator){
        // This is a direct application of Chien's search
        var numErrors = errorLocator.degree;
        if (numErrors == 1)
        {
            // shortcut
            return new Int32Array([errorLocator.getCoefficient(1)]);
        }
        var result = new Int32Array(numErrors);
        var e = 0;
        for (var i = 1; i < 256 && e < numErrors; i++)
        {
            if (errorLocator.evaluateAt(i) == 0)
            {
                result[e] = this.field.inverse(i);
                e++;
            }
        }
        if (e != numErrors)
        {
            throw "Error locator degree does not match number of roots";
        }
        return result;
    },
    findErrorMagnitudes:function( errorEvaluator,  errorLocations){
            // This is directly applying Forney's Formula
            var s = errorLocations.length;
            var result = new Int32Array(s);
            for (var i = 0; i < s; i++)
            {
                var xiInverse = this.field.inverse(errorLocations[i]);
                var denominator = 1;
                for (var j = 0; j < s; j++)
                {
                    if (i != j)
                    {
                        denominator = this.field.multiply(denominator,1 ^ this.field.multiply(errorLocations[j], xiInverse));
                        
                    }
                }
                result[i] = this.field.multiply(errorEvaluator.evaluateAt(xiInverse), this.field.inverse(denominator));

              
            }
            return result;
        }
    
}

/*
function DataBlocks(rawCodewords,  version,  ecLevel){
    if (rawCodewords.length != version.TotalCodewords)
    {
        throw "ArgumentException"; // fix me can this happen -- investigate 
    }
    var ecBlocks = version.getECBlocksForLevel(ecLevel);

    // First count the total number of data blocks
    var totalBlocks = 0;
    var result = new Array();
    var ecBlockArray = ecBlocks.ecBlocks;
    var l = ecBlockArray.length
    var i = 0
    do{
        
    }while(i<l)
    for (var i = 0; i < ecBlockArray.length; i++)
    {
        totalBlocks += ecBlockArray[i].count;
    }

    // Now establish DataBlocks of the appropriate size and number of data codewords
    var result = new Array();
    
    var numResultBlocks = 0;
    for (var j = 0; j < ecBlockArray.length; j++)
    {
        var ecBlock = ecBlockArray[j];
        for (var i = 0; i < ecBlock.count; i++)
        {
            var numDataCodewords = ecBlock.DataCodewords;
            var numBlockCodewords = ecBlocks.ecCodewordsPerBlock + numDataCodewords;
            result[numResultBlocks++] = new DataBlock(numDataCodewords, new Array(numBlockCodewords));
        }
    }

    // All blocks have the same amount of data, except that the last n
    // (where n may be 0) have 1 more byte. Figure out where these start.
    var shorterBlocksTotalCodewords = result[0].codewords.length;
    var longerBlocksStartAt = result.length - 1;
    while (longerBlocksStartAt >= 0)
    {
        var numCodewords = result[longerBlocksStartAt].codewords.length;
        if (numCodewords == shorterBlocksTotalCodewords)
        {
            break;
        }
        longerBlocksStartAt--;
    }
    longerBlocksStartAt++;

    var shorterBlocksNumDataCodewords = shorterBlocksTotalCodewords - ecBlocks.ecCodewordsPerBlock;
    // The last elements of result may be 1 element longer;
    // first fill out as many elements as all of them have
    var rawCodewordsOffset = 0;
    for (var i = 0; i < shorterBlocksNumDataCodewords; i++)
    {
        for (var j = 0; j < numResultBlocks; j++)
        {
            result[j].codewords[i] = rawCodewords[rawCodewordsOffset++];
        }
    }
    // Fill out the last data block in the longer ones
    for (var j = longerBlocksStartAt; j < numResultBlocks; j++)
    {
        result[j].codewords[shorterBlocksNumDataCodewords] = rawCodewords[rawCodewordsOffset++];
    }
    // Now add in error correction blocks
    var max = result[0].codewords.length;
    for (var i = shorterBlocksNumDataCodewords; i < max; i++)
    {
        for (var j = 0; j < numResultBlocks; j++)
        {
            var iOffset = j < longerBlocksStartAt?i:i + 1;
            result[j].codewords[iOffset] = rawCodewords[rawCodewordsOffset++];
        }
    }
    return result;

}
*/

DataBlock.getDataBlocks=function(rawCodewords,  version,  ecLevel)
{

    if (rawCodewords.length != version.totalCodewords)
    {
        throw "ArgumentException"; // fix me can this happen -- investigate 
    }

    // Figure out the number and size of data blocks used by this version and
    // error correction level
    var ecBlocks = version.getECBlocksForLevel(ecLevel)

    // First count the total number of data blocks

    var ecBlockArray = ecBlocks.ecBlocks


    // Now establish DataBlocks of the appropriate size and number of data codewords
    var result = new Array()
    var numResultBlocks=0;
    var count,ecBlock,numDataCodewords,numBlockCodewords
    var l = ecBlockArray.length
    var i
    var j = 0
    var tmp
    do{
        ecBlock = ecBlockArray[j++];
        count = ecBlock.count
        numResultBlocks+= count
        i=0
        do{
            i++
            numDataCodewords = ecBlock.DataCodewords;
            numBlockCodewords = ecBlocks.ecCodewordsPerBlock + numDataCodewords;
            result.push(new DataBlock(numDataCodewords,numBlockCodewords))
        }while(i<count)
    }while(j<l)

    // All blocks have the same amount of data, except that the last n
    // (where n may be 0) have 1 more byte. Figure out where these start.
    var shorterBlocksTotalCodewords = result[0].codewords.length;
    var longerBlocksStartAt = numResultBlocks - 1;
    while (longerBlocksStartAt >= 0)
    {
        numBlockCodewords = result[longerBlocksStartAt].codewords.length;
        if (numBlockCodewords == shorterBlocksTotalCodewords)
        {
            break;
        }
        longerBlocksStartAt--;
    }
    longerBlocksStartAt++;

    var shorterBlocksNumDataCodewords = shorterBlocksTotalCodewords - ecBlocks.ecCodewordsPerBlock;
    // The last elements of result may be 1 element longer;
    // first fill out as many elements as all of them have
    var rawCodewordsOffset = 0
    i=0
    j=0
    do{
        result[j].codewords[i] = rawCodewords[rawCodewordsOffset++];
        j++
        tmp = (j-numResultBlocks)>>>31
        j *= tmp
        i+= tmp^1
    }while( i < shorterBlocksNumDataCodewords)
    // Fill out the last data block in the longer ones
    
    for (j = longerBlocksStartAt; j < numResultBlocks; j++)
    {
        result[j].codewords[shorterBlocksNumDataCodewords] = rawCodewords[rawCodewordsOffset++];
    }
    // Now add in error correction blocks
    i = shorterBlocksNumDataCodewords
    j=0
    while(i < shorterBlocksTotalCodewords)
    {
        result[j].codewords[((j - longerBlocksStartAt)>>>31^1) + i] = rawCodewords[rawCodewordsOffset++];
        j++
        tmp = (j-numResultBlocks)>>>31
        j*=tmp
        i+=tmp^1

    }
    return result;
}
    
/*
  Ported to JavaScript by Lazar Laszlo 2011 
  
  lazarsoft@gmail.com, www.lazarsoft.info
  
*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// fix me maybe bitMatrix could grab more than one bit at a time? 

function BitMatrixParser(bitMatrix){
    var dimension = bitMatrix.dimension;
    if (dimension < 21 || (dimension & 0x03) != 1){
        throw "Error BitMatrixParser";
    }
    var parsedFormatInfo = BitMatrixParser.readFormatInformation(bitMatrix)
    var parsedVersion = BitMatrixParser.readVersion(bitMatrix)
    var codewords = BitMatrixParser.readCodewords(bitMatrix,parsedFormatInfo,parsedVersion)
    this.bitMatrix = bitMatrix; // fix me do we have nay need to hold on to this
    this.formatInfo = parsedFormatInfo
    this.version = parsedVersion
    this.codewords = codewords
     
    
}
BitMatrixParser.readFormatInformation = function(bits){
 
    // Read top-left format info bits
    var formatInfoBits = 0;
    for (var i = 0; i < 6; i++){
        formatInfoBits = bits.copyBit(i, 8, formatInfoBits);
    }
    // .. and skip a bit in the timing pattern ...
    formatInfoBits = bits.copyBit(7, 8, formatInfoBits);
    formatInfoBits = bits.copyBit(8, 8, formatInfoBits);
    formatInfoBits = bits.copyBit(8, 7, formatInfoBits);
    // .. and skip a bit in the timing pattern ...
    for (var j = 5; j >= 0; j--)
    {
        formatInfoBits = bits.copyBit(8, j, formatInfoBits);
    }

    var parsedFormatInfo = FormatInformation.fromMaskedFormatInfo(formatInfoBits);
    if (parsedFormatInfo != null)
    {
        return parsedFormatInfo;
    }

    // Hmm, failed. Try the top-right/bottom-left pattern
    var dimension = bits.dimension;
    formatInfoBits = 0;
    var iMin = dimension - 8;
    for (var i = dimension - 1; i >= iMin; i--)
    {
        formatInfoBits = bits.copyBit(i, 8, formatInfoBits);
    }
    for (var j = dimension - 7; j < dimension; j++)
    {
        formatInfoBits = bits.copyBit(8, j, formatInfoBits);
    }

    parsedFormatInfo = FormatInformation.fromMaskedFormatInfo(formatInfoBits);
    if (parsedFormatInfo != null)
    {
        return parsedFormatInfo;
    }
    throw "Error readFormatInformation";    
}

BitMatrixParser.readVersion=function(bits){
    var dimension = bits.dimension

    var provisionalVersion = (dimension - 17) >> 2
    if (provisionalVersion <= 6)
    {
        return Version.getVersionForNumber(provisionalVersion);
    }

    // Read top-right version info: 3 wide by 6 tall
    var versionBits = 0
    var ijMin = dimension - 11
    for (var j = 5; j >= 0; j--)
    {
        for (var i = dimension - 9; i >= ijMin; i--)
        {
            versionBits = bits.copyBit(i, j, versionBits);
        }
    }

    var parsedVersion = Version.decodeVersionInformation(versionBits);
    if (parsedVersion != null && parsedVersion.dimensionForVersion == dimension)
    {
        return parsedVersion;
    }

    // Hmm, failed. Try bottom left: 6 wide by 3 tall
    versionBits = 0;
    for (var i = 5; i >= 0; i--)
    {
        for (var j = dimension - 9; j >= ijMin; j--)
        {
            versionBits = bits.copyBit(i, j, versionBits);
        }
    }

    parsedVersion = Version.decodeVersionInformation(versionBits);
    if (parsedVersion != null && parsedVersion.dimensionForVersion == dimension)
    {
        return parsedVersion;
    }
    throw "Error readVersion";
} 
BitMatrixParser.readCodewords=function(bits,formatInfo,version){


    // Get the data mask for the format used in this QR Code. This will exclude
    // some bits from reading as we wind through the bit matrix.

    bits.XOR_Matrix(version.getMask(formatInfo.dataMask))

    var dimension = bits.dimension;


    var functionPattern = version.buildFunctionPattern();

    var readingUp = 1;
    var result = new Uint8Array(version.totalCodewords);
    var resultOffset = 0;
    var currentByte = 0;
    var bitsRead = 0;
    // Read columns in pairs, from right to left
    for (var j = dimension - 1; j > 0; j -= 2)
    {
       
        if (j == 6)
        {
            // Skip whole column with vertical alignment pattern;
            // saves time and makes the other code proceed more cleanly
            j--;
        }
        // Read alternatingly from bottom to top then top to bottom
        for (var count = 0; count < dimension; count++)
        {
            var i = readingUp?dimension - 1 - count:count;
            for (var col = 0; col < 2; col++)
            {
                // Ignore bits covered by the function pattern
                if (!functionPattern.get_Renamed(j - col, i))
                {
                    // Read a bit
                    bitsRead++;
                    currentByte = bits.copyBit(j - col, i,currentByte)
                    
                    // If we've made a whole byte, save it off
                    if (bitsRead == 8)
                    {
                        result[resultOffset++] =  currentByte;
                        bitsRead = 0;
                        currentByte = 0;
                    }
                }
            }
        }
        readingUp ^= 1; // readingUp = !readingUp; // switch directions
    }
    if (resultOffset != version.totalCodewords)
    {
        throw "Error readCodewords";
    }
    return result;
}

function Decoder(bits){
    var parser = new BitMatrixParser(bits);
    var ecLevel = parser.formatInfo.errorCorrectionLevel;
    var version = parser.version;
    

    // Read codewords
    var codewords = parser.codewords;

    // Separate into data blocks
    var dataBlocks = DataBlock.getDataBlocks(codewords, version, ecLevel);

    var totalBytes = 0;
    var i = 0
    var l =dataBlocks.length
    var cur
    do{
        cur = dataBlocks[i++]
        cur.correct()
         
       
        totalBytes += cur.numDataCodewords;
    }while(i<l)

    this.versionNumber = version.versionNumber
    this.ecBits = ecLevel.bits
    this.totalBytes = totalBytes
    this.dataBlocks = dataBlocks
    this.resultBytes = new Uint8Array(totalBytes);
    
}
Decoder.prototype = {
    decode:function (){
        var i
        var i
        var i2
        var l = this.dataBlocks.length

        // fix me maybe a data block could decode its self
        var dataBlock
        var resultOffset = 0
        var codewordBytes
        var numDataCodewords
        i=0
        do{
            dataBlock = this.dataBlocks[i++]
            codewordBytes = dataBlock.codewords
            numDataCodewords = dataBlock.numDataCodewords

            i2=0
            do{this.resultBytes[resultOffset++] = codewordBytes[i2++]}while(i2<numDataCodewords)
        }while(i<l)
        
        
        return  new QRCodeDataBlockReader(this.resultBytes, this.versionNumber, this.ecBits);

    }
    
    
}




function PerspectiveTransform( a11,  a21,  a31,  a12,  a22,  a32,  a13,  a23,  a33)
{
    this.a11 = a11;
    this.a12 = a12;
    this.a13 = a13;
    this.a21 = a21;
    this.a22 = a22;
    this.a23 = a23;
    this.a31 = a31;
    this.a32 = a32;
    this.a33 = a33;
    this.transformPoints1=function( points)
        {
            var max = points.length;
            var a11 = this.a11;
            var a12 = this.a12;
            var a13 = this.a13;
            var a21 = this.a21;
            var a22 = this.a22;
            var a23 = this.a23;
            var a31 = this.a31;
            var a32 = this.a32;
            var a33 = this.a33;
            for (var i = 0; i < max; i += 2)
            {
                var x = points[i];
                var y = points[i + 1];
                var denominatorInverse = 1/(a13 * x + a23 * y + a33);
                points[i] = (a11 * x + a21 * y + a31) *denominatorInverse;
                points[i + 1] = (a12 * x + a22 * y + a32) *denominatorInverse;
            }
        }
    this. transformPoints2=function(xValues, yValues)
        {
            var n = xValues.length;
            for (var i = 0; i < n; i++)
            {
                var x = xValues[i];
                var y = yValues[i];
                var denominatorInverse = 1/(this.a13 * x + this.a23 * y + this.a33)
                xValues[i] = (this.a11 * x + this.a21 * y + this.a31) *denominatorInverse;
                yValues[i] = (this.a12 * x + this.a22 * y + this.a32) *denominatorInverse;
            }
        }

    this.buildAdjoint=function()
        {
            // Adjoint is the transpose of the cofactor matrix:
            return new PerspectiveTransform(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21);
        }
    this.times=function( other)
        {
            return new PerspectiveTransform(this.a11 * other.a11 + this.a21 * other.a12 + this.a31 * other.a13, this.a11 * other.a21 + this.a21 * other.a22 + this.a31 * other.a23, this.a11 * other.a31 + this.a21 * other.a32 + this.a31 * other.a33, this.a12 * other.a11 + this.a22 * other.a12 + this.a32 * other.a13, this.a12 * other.a21 + this.a22 * other.a22 + this.a32 * other.a23, this.a12 * other.a31 + this.a22 * other.a32 + this.a32 * other.a33, this.a13 * other.a11 + this.a23 * other.a12 +this.a33 * other.a13, this.a13 * other.a21 + this.a23 * other.a22 + this.a33 * other.a23, this.a13 * other.a31 + this.a23 * other.a32 + this.a33 * other.a33);
        }

}

PerspectiveTransform.quadrilateralToQuadrilateral=function( x0,  y0,  x1,  y1,  x2,  y2,  x3,  y3,  x0p,  y0p,  x1p,  y1p,  x2p,  y2p,  x3p,  y3p)
{

    var qToS = this.quadrilateralToSquare(x0, y0, x1, y1, x2, y2, x3, y3);
    var sToQ = this.squareToQuadrilateral(x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p);
    return sToQ.times(qToS);
}

PerspectiveTransform.squareToQuadrilateral=function( x0,  y0,  x1,  y1,  x2,  y2,  x3,  y3)
{
    var dy2 = y3 - y2;
    var dy3 = y0 - y1 + y2 - y3;
    if (dy2 == 0.0 && dy3 == 0.0)
    {
        return new PerspectiveTransform(x1 - x0, x2 - x1, x0, y1 - y0, y2 - y1, y0, 0.0, 0.0, 1.0);
    }
    else
    {
         var dx1 = x1 - x2;
         var dx2 = x3 - x2;
         var dx3 = x0 - x1 + x2 - x3;
         var dy1 = y1 - y2;
         var denominatorInverse = 1/(dx1 * dy2 - dx2 * dy1)
         var a13 = (dx3 * dy2 - dx2 * dy3) *denominatorInverse;
         var a23 = (dx1 * dy3 - dx3 * dy1) *denominatorInverse;
        return new PerspectiveTransform(x1 - x0 + a13 * x1, x3 - x0 + a23 * x3, x0, y1 - y0 + a13 * y1, y3 - y0 + a23 * y3, y0, a13, a23, 1.0);
    }
}

PerspectiveTransform.quadrilateralToSquare=function( x0,  y0,  x1,  y1,  x2,  y2,  x3,  y3)
{
    // Here, the adjoint serves as the inverse:
    return this.squareToQuadrilateral(x0, y0, x1, y1, x2, y2, x3, y3).buildAdjoint();
}

function DetectorResult(bits,  points)
{
    this.bits = bits;
    this.points = points;
}


function Detector(image)
{
    this.image=image;
    this.resultPointCallback = null;

    this.sizeOfBlackWhiteBlackRun=function( fromX,  fromY,  toX,  toY)
        {
            // Mild variant of Bresenham's algorithm;
            // see http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
            var steep = Math.abs(toY - fromY) > Math.abs(toX - fromX);
            if (steep)
            {
                var temp = fromX;
                fromX = fromY;
                fromY = temp;
                temp = toX;
                toX = toY;
                toY = temp;
            }

            var dx = Math.abs(toX - fromX);
            var dy = Math.abs(toY - fromY);
            var error = - dx >> 1;
            var ystep = fromY < toY?1:- 1;
            var xstep = fromX < toX?1:- 1;
            var state = 0; // In black pixels, looking for white, first or second time
            for (var x = fromX, y = fromY; x != toX; x += xstep)
            {

                var realX = steep?y:x;
                var realY = steep?x:y;
                if (state == 1)
                {
                    // In white pixels, looking for black
                    if (this.image[realX + realY*qrcode.width])
                    {
                        state++;
                    }
                }
                else
                {
                    if (!this.image[realX + realY*qrcode.width])
                    {
                        state++;
                    }
                }

                if (state == 3)
                {
                    // Found black, white, black, and stumbled back onto white; done
                    var diffX = x - fromX;
                    var diffY = y - fromY;
                    return  Math.sqrt( (diffX * diffX + diffY * diffY));
                }
                error += dy;
                if (error > 0)
                {
                    if (y == toY)
                    {
                        break;
                    }
                    y += ystep;
                    error -= dx;
                }
            }
            var diffX2 = toX - fromX;
            var diffY2 = toY - fromY;
            return  Math.sqrt( (diffX2 * diffX2 + diffY2 * diffY2));
        }


    this.sizeOfBlackWhiteBlackRunBothWays=function( fromX,  fromY,  toX,  toY)
        {

            var result = this.sizeOfBlackWhiteBlackRun(fromX, fromY, toX, toY);

            // Now count other way -- don't run off image though of course
            var scale = 1.0;
            var otherToX = fromX - (toX - fromX);
            if (otherToX < 0)
            {
                scale =  fromX /  (fromX - otherToX);
                otherToX = 0;
            }
            else if (otherToX >= qrcode.width)
            {
                scale =  (qrcode.width - 1 - fromX) /  (otherToX - fromX);
                otherToX = qrcode.width - 1;
            }
            var otherToY = Math.floor (fromY - (toY - fromY) * scale);

            scale = 1.0;
            if (otherToY < 0)
            {
                scale =  fromY /  (fromY - otherToY);
                otherToY = 0;
            }
            else if (otherToY >= qrcode.height)
            {
                scale =  (qrcode.height - 1 - fromY) /  (otherToY - fromY);
                otherToY = qrcode.height - 1;
            }
            otherToX = Math.floor (fromX + (otherToX - fromX) * scale);

            result += this.sizeOfBlackWhiteBlackRun(fromX, fromY, otherToX, otherToY);
            return result - 1.0; // -1 because we counted the middle pixel twice
        }



    this.calculateModuleSizeOneWay=function( pattern,  otherPattern)
        {
            var moduleSizeEst1 = this.sizeOfBlackWhiteBlackRunBothWays(pattern.X, pattern.Y, otherPattern.X, otherPattern.Y);
            var moduleSizeEst2 = this.sizeOfBlackWhiteBlackRunBothWays(otherPattern.X, otherPattern.Y, pattern.X, pattern.Y);
            if (isNaN(moduleSizeEst1))
            {
                return moduleSizeEst2 *0.142857143 // div by 7
            }
            if (isNaN(moduleSizeEst2))
            {
                return moduleSizeEst1 *0.142857143 // div by 7
            }
            // fix me can 2 NAN be happen here
            // Average them, and divide by 7 since we've counted the width of 3 black modules,
            // and 1 white and 1 black module on either side. Ergo, divide sum by 14.
            return (moduleSizeEst1 + moduleSizeEst2) * 0.071428571 // div by 14
        }


    this.calculateModuleSize=function( topLeft,  topRight,  bottomLeft)
        {
            // Take the average
            return (this.calculateModuleSizeOneWay(topLeft, topRight) + this.calculateModuleSizeOneWay(topLeft, bottomLeft)) *0.5 // div by 2
        }


    this.computeDimension=function( topLeft,  topRight,  bottomLeft,  moduleSize)
        {

            var tltrCentersDimension = Math.round(topLeft.distance(topRight) / moduleSize);
            var tlblCentersDimension = Math.round(topLeft.distance(bottomLeft) / moduleSize);
            var dimension = ((tltrCentersDimension + tlblCentersDimension) >> 1) + 7;
            switch (dimension & 0x03)
            {

                // mod 4
                case 0: 
                    dimension++;
                    break;
                    // 1? do nothing

                case 2: 
                    dimension--;
                    break;

                case 3: 
                    throw "Error";
                }
            return dimension;
        }

    this.findAlignmentInRegion=function( overallEstModuleSize,  estAlignmentX,  estAlignmentY,  allowanceFactor)
        {
            // Look for an alignment pattern (3 modules in size) around where it
            // should be
            var allowance = Math.floor (allowanceFactor * overallEstModuleSize);
            var alignmentAreaLeftX = Math.max(0, estAlignmentX - allowance);
            var alignmentAreaRightX = Math.min(qrcode.width - 1, estAlignmentX + allowance);
            
            if (alignmentAreaRightX - alignmentAreaLeftX < overallEstModuleSize * 3)
            {
                return null
            }

            var alignmentAreaTopY = Math.max(0, estAlignmentY - allowance);
            var alignmentAreaBottomY = Math.min(qrcode.height - 1, estAlignmentY + allowance);

            var alignmentFinder = new AlignmentPatternFinder(this.image, alignmentAreaLeftX, alignmentAreaTopY, alignmentAreaRightX - alignmentAreaLeftX, alignmentAreaBottomY - alignmentAreaTopY, overallEstModuleSize, this.resultPointCallback);
            return alignmentFinder.find();
        }

    this.createTransform=function( topLeft,  topRight,  bottomLeft, alignmentPattern, dimension)
        {
            var dimMinusThree =  dimension - 3.5;
            var bottomRightX;
            var bottomRightY;
            var sourceBottomRightX;
            var sourceBottomRightY;
            if (alignmentPattern != null)
            {
                bottomRightX = alignmentPattern.X;
                bottomRightY = alignmentPattern.Y;
                sourceBottomRightX = sourceBottomRightY = dimMinusThree - 3.0;
            }
            else
            {
                // Don't have an alignment pattern, just make up the bottom-right point
                bottomRightX = (topRight.X - topLeft.X) + bottomLeft.X;
                bottomRightY = (topRight.Y - topLeft.Y) + bottomLeft.Y;
                sourceBottomRightX = sourceBottomRightY = dimMinusThree;
            }

            var transform = PerspectiveTransform.quadrilateralToQuadrilateral(3.5, 3.5, dimMinusThree, 3.5, sourceBottomRightX, sourceBottomRightY, 3.5, dimMinusThree, topLeft.X, topLeft.Y, topRight.X, topRight.Y, bottomRightX, bottomRightY, bottomLeft.X, bottomLeft.Y);

            return transform;
        }        

    this.sampleGrid=function( image,  transform,  dimension)
        {

            var sampler = GridSampler;
            return sampler.sampleGrid3(image, dimension, transform);
        }

    this.processFinderPatternInfo = function( info)
        {

            var topLeft = info.topLeft;
            var topRight = info.topRight;
            var bottomLeft = info.bottomLeft;

            var moduleSize = this.calculateModuleSize(topLeft, topRight, bottomLeft);
            if (moduleSize < 1.0)
            {
                throw "moduleSize is too small";
            }
            var dimension = this.computeDimension(topLeft, topRight, bottomLeft, moduleSize);
            var provisionalVersion = Version.getProvisionalVersionForDimension(dimension);
            var modulesBetweenFPCenters = provisionalVersion.dimensionForVersion - 7;

            var alignmentPattern;
            // Anything above version 1 has an alignment pattern
            if (provisionalVersion.alignmentPatternCenters.length > 0)
            {

                // Guess where a "bottom right" finder pattern would have been
                var bottomRightX = topRight.X - topLeft.X + bottomLeft.X;
                var bottomRightY = topRight.Y - topLeft.Y + bottomLeft.Y;

                // Estimate that alignment pattern is closer by 3 modules
                // from "bottom right" to known top left location
                var correctionToTopLeft = 1.0 - 3.0 /  modulesBetweenFPCenters;
                var estAlignmentX = Math.floor (topLeft.X + correctionToTopLeft * (bottomRightX - topLeft.X));
                var estAlignmentY = Math.floor (topLeft.Y + correctionToTopLeft * (bottomRightY - topLeft.Y));

                // Kind of arbitrary -- expand search radius before giving up

                var i = 4
                alignmentPattern = this.findAlignmentInRegion(moduleSize, estAlignmentX, estAlignmentY,  i);
                // fix me re enabled commented out code by returning null on a error
                // it works better idono 
                // check the code in zxing and see what they are doing here
                //do{
                    //try
                    //{
                        //alignmentPattern = this.findAlignmentInRegion(moduleSize, estAlignmentX, estAlignmentY,  i);
                        
                    //}
                    //catch (re)
                    //{
                        // try next round
                    //}
                    //i <<= 1 
                //}while(alignmentPattern !== null && i<16)
                if(alignmentPattern === null){
                    throw "Couldn't find enough alignment patterns";
                }
                // If we didn't find alignment pattern... well try anyway without it
            }

            var transform = this.createTransform(topLeft, topRight, bottomLeft, alignmentPattern, dimension);

            var bits = this.sampleGrid(this.image, transform, dimension);

            var points;
            if (alignmentPattern == null)
            {
                points = [bottomLeft, topLeft, topRight];
            }
            else
            {
                points = [bottomLeft, topLeft, topRight, alignmentPattern];
            }
            return new DetectorResult(bits, points);
        }



    this.detect=function()
    {
        var info =  new FinderPatternFinder().findFinderPattern(this.image);

        return this.processFinderPatternInfo(info); 
    }
}


var qrcode = {};

qrcode.width = 0;
qrcode.height = 0;
qrcode.qrCodeSymbol = null;
qrcode.debug = false;
qrcode.maxImgSize = 1024*1024;

qrcode.sizeOfDataLengthInfo =  [  [ 10, 9, 8, 8 ],  [ 12, 11, 16, 10 ],  [ 14, 13, 16, 12 ] ];




qrcode.decode_utf8 = function ( s )
{
    /*if(qrcode.isUrl(s))
        return qrcode.decode_url(s);
    else
    */
        return s; // fix me WAT 
}

qrcode.process = function(image,w,h){


        qrcode.width = w
        qrcode.height = h
        //var image = qrcode.grayScaleToBitmap(qrcode.grayscale(buff));

       
        
        
        var d = new Detector(image).detect()

        var decoder = new Decoder( d.bits )
        
       
        
        var reader = decoder.decode();
        var data = reader.DataByte;
        var str="";
        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<data[i].length;j++)
                str+=String.fromCharCode(data[i][j]);
        }
        


        
        return qrcode.decode_utf8(str);

    
   
}












var MIN_SKIP = 3;
var MAX_MODULES = 57;
var INVERSE_MAX_MODULESx4 = 0.004385965
var INTEGER_MATH_SHIFT = 8;
var CENTER_QUORUM = 2;

qrcode.orderBestPatterns=function(patterns){
    var a,b,c,tmp
    a =  patterns[0]
    b =  patterns[1]
    c =  patterns[2]
    // Find distances between pattern centers
    var zeroOneDistance = a.intDistance(b)
    var oneTwoDistance  = b.intDistance(c)
    var zeroTwoDistance = a.intDistance(c)


    // Assume one closest to other two is B; A and C will just be guesses at first
    if (oneTwoDistance >= zeroOneDistance && oneTwoDistance >= zeroTwoDistance){
        tmp = a
        a = b
        b = tmp

    }
    else if (!(zeroTwoDistance >= oneTwoDistance && zeroTwoDistance >= zeroOneDistance)){
        tmp = b
        b = c
        c = tmp
    }

    // Use cross product to figure out whether A and C are correct or flipped.
    // This asks whether BC x BA has a positive z component, which is the arrangement
    // we want for A, B, C. If it's negative, then we've got it flipped around and
    // should swap A and C.
    if (qrPattern.crossProductZ(a, b, c) < 0.0){
        tmp = a;
        a = c;
        c = tmp;
    }

    patterns[0] = a;
    patterns[1] = b;
    patterns[2] = c;
}


function qrPattern(posX, posY,  estimatedModuleSize)
{
    this.x=posX;
    this.y=posY;
    this.count = 1;
    this.estimatedModuleSize = estimatedModuleSize;
    this.X = posX|0
    this.Y = posY|0
    this.estimatedModuleSizeInverse = 1/estimatedModuleSize
  
}
qrPattern.prototype = {
    aboutEquals:function( moduleSize,  i,  j){
        var moduleSizeDiff
        if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize)
        {
            var moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize);
            return moduleSizeDiff <= 1.0 || moduleSizeDiff * this.estimatedModuleSizeInverse  <= 1.0;
        }
        return false;
    },
    distance:function(b){
        var x = this.x - b.x
        var y = this.y - b.y
        return Math.sqrt(x*x+y*y)
    },
    intDistance:function(b){
        var x = this.X-b.X
        var y = this.Y-b.Y
        return Math.sqrt(x*x+y*y)
    }
    
    
}
qrPattern.crossProductZ = function( a,  b,  c){
    return ((c.x - b.x) * (a.y - b.y)) - ((c.y - b.y) * (a.x - b.y));
}

function FinderPatternInfo(patternCenters)
{
    this.bottomLeft = patternCenters[0];
    this.topLeft = patternCenters[1];
    this.topRight = patternCenters[2]; 
}

function FinderPatternFinder()
{
    this.image=null;
    this.possibleCenters = [];
    this.hasSkipped = false;
    this.crossCheckStateCount = new Uint16Array(5);
    this.resultPointCallback = null;

    this.__defineGetter__("CrossCheckStateCount", function()
    {
        this.crossCheckStateCount[0] = 0;
        this.crossCheckStateCount[1] = 0;
        this.crossCheckStateCount[2] = 0;
        this.crossCheckStateCount[3] = 0;
        this.crossCheckStateCount[4] = 0;
        return this.crossCheckStateCount;
    }); 

    this.foundPatternCross=function( stateCount)
        {
            var totalModuleSize = 0;
            for (var i = 0; i < 5; i++)
            {
                var count = stateCount[i];
                if (count == 0)
                {
                    return false;
                }
                totalModuleSize += count;
            }
            if (totalModuleSize < 7)
            {
                return false;
            }
            var moduleSize = Math.floor((totalModuleSize << INTEGER_MATH_SHIFT) *0.142857143); // div by 7
            var maxVariance = Math.floor(moduleSize >>1); // div by 2
            // Allow less than 50% variance from 1-1-3-1-1 proportions
            return Math.abs(moduleSize - (stateCount[0] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[1] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(3 * moduleSize - (stateCount[2] << INTEGER_MATH_SHIFT)) < 3 * maxVariance && Math.abs(moduleSize - (stateCount[3] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[4] << INTEGER_MATH_SHIFT)) < maxVariance;
        }
    this.centerFromEnd=function( stateCount,  end)
        {
            return  (end - stateCount[4] - stateCount[3]) - stateCount[2] * 0.5; // div by 2
        }
    this.crossCheckVertical=function( startI,  centerJ,  maxCount,  originalStateCountTotal)
        {
            var image = this.image;

            var maxI = qrcode.height;
            var stateCount = this.CrossCheckStateCount;

            // Start counting up from center
            var i = startI;
            while (i >= 0 && image[centerJ + i*qrcode.width])
            {
                stateCount[2]++;
                i--;
            }
            if (i < 0)
            {
                return NaN;
            }
            while (i >= 0 && !image[centerJ +i*qrcode.width] && stateCount[1] <= maxCount)
            {
                stateCount[1]++;
                i--;
            }
            // If already too many modules in this state or ran off the edge:
            if (i < 0 || stateCount[1] > maxCount)
            {
                return NaN;
            }
            while (i >= 0 && image[centerJ + i*qrcode.width] && stateCount[0] <= maxCount)
            {
                stateCount[0]++;
                i--;
            }
            if (stateCount[0] > maxCount)
            {
                return NaN;
            }

            // Now also count down from center
            i = startI + 1;
            while (i < maxI && image[centerJ +i*qrcode.width])
            {
                stateCount[2]++;
                i++;
            }
            if (i == maxI)
            {
                return NaN;
            }
            while (i < maxI && !image[centerJ + i*qrcode.width] && stateCount[3] < maxCount)
            {
                stateCount[3]++;
                i++;
            }
            if (i == maxI || stateCount[3] >= maxCount)
            {
                return NaN;
            }
            while (i < maxI && image[centerJ + i*qrcode.width] && stateCount[4] < maxCount)
            {
                stateCount[4]++;
                i++;
            }
            if (stateCount[4] >= maxCount)
            {
                return NaN;
            }

            // If we found a finder-pattern-like section, but its size is more than 40% different than
            // the original, assume it's a false positive
            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
            if (5 * Math.abs(stateCountTotal - originalStateCountTotal) >= 2 * originalStateCountTotal)
            {
                return NaN;
            }

            return this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount, i):NaN;
        }
    this.crossCheckHorizontal=function( startJ,  centerI,  maxCount, originalStateCountTotal)
        {
            var image = this.image;

            var maxJ = qrcode.width;
            var stateCount = this.CrossCheckStateCount;

            var j = startJ;
            while (j >= 0 && image[j+ centerI*qrcode.width])
            {
                stateCount[2]++;
                j--;
            }
            if (j < 0)
            {
                return NaN;
            }
            while (j >= 0 && !image[j+ centerI*qrcode.width] && stateCount[1] <= maxCount)
            {
                stateCount[1]++;
                j--;
            }
            if (j < 0 || stateCount[1] > maxCount)
            {
                return NaN;
            }
            while (j >= 0 && image[j+ centerI*qrcode.width] && stateCount[0] <= maxCount)
            {
                stateCount[0]++;
                j--;
            }
            if (stateCount[0] > maxCount)
            {
                return NaN;
            }

            j = startJ + 1;
            while (j < maxJ && image[j+ centerI*qrcode.width])
            {
                stateCount[2]++;
                j++;
            }
            if (j == maxJ)
            {
                return NaN;
            }
            while (j < maxJ && !image[j+ centerI*qrcode.width] && stateCount[3] < maxCount)
            {
                stateCount[3]++;
                j++;
            }
            if (j == maxJ || stateCount[3] >= maxCount)
            {
                return NaN;
            }
            while (j < maxJ && image[j+ centerI*qrcode.width] && stateCount[4] < maxCount)
            {
                stateCount[4]++;
                j++;
            }
            if (stateCount[4] >= maxCount)
            {
                return NaN;
            }

            // If we found a finder-pattern-like section, but its size is significantly different than
            // the original, assume it's a false positive
            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
            if (5 * Math.abs(stateCountTotal - originalStateCountTotal) >= originalStateCountTotal)
            {
                return NaN;
            }

            return this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount, j):NaN;
        }
    this.handlePossibleCenter=function( stateCount,  i,  j)
        {
            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
            var centerJ = this.centerFromEnd(stateCount, j); //float
            var centerI = this.crossCheckVertical(i, Math.floor( centerJ), stateCount[2], stateCountTotal); //float
            if (!isNaN(centerI))
            {
                // Re-cross check
                centerJ = this.crossCheckHorizontal(Math.floor( centerJ), Math.floor( centerI), stateCount[2], stateCountTotal);
                if (!isNaN(centerJ))
                {
                    var estimatedModuleSize =   stateCountTotal *0.142857143; // div by 7
                    var found = false;
                    var max = this.possibleCenters.length;
                    for (var index = 0; index < max; index++)
                    {
                        var center = this.possibleCenters[index];
                        // Look for about the same center and module size:
                        if (center.aboutEquals(estimatedModuleSize, centerI, centerJ))
                        {
                            center.count++;
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                    {
                        var point = new qrPattern(centerJ, centerI, estimatedModuleSize);
                        this.possibleCenters.push(point);
                    }
                    return true;
                }
            }
            return false;
        }

    this.selectBestPatterns=function()
        {

            var startSize = this.possibleCenters.length;
            if (startSize < 3)
            {
                // Couldn't find enough finder patterns
                throw "Couldn't find enough finder patterns";
            }

            // Filter outlier possibilities whose module size is too different
            if (startSize > 3)
            {
                // But we can only afford to do so if we have at least 4 possibilities to choose from
                var totalModuleSize = 0.0;
                var square = 0.0;
                for (var i = 0; i < startSize; i++)
                {
                    var    centerValue=this.possibleCenters[i].estimatedModuleSize;
                    totalModuleSize += centerValue;
                    square += (centerValue * centerValue);
                }
                var average = totalModuleSize /  startSize;
                this.possibleCenters.sort(function(center1,center2) {
                      var a=Math.abs(center2.estimatedModuleSize - average);
                      var b=Math.abs(center1.estimatedModuleSize - average);
                      return ((a-b)>>31)^((b-a)>>>31)
                      
                    });

                var stdDev = Math.sqrt(square / startSize - average * average);
                var limit = Math.max(0.2 * average, stdDev);
                for (var i = 0; i < this.possibleCenters.length && this.possibleCenters.length > 3; i++)
                {
                    var pattern =  this.possibleCenters[i];

                    if (Math.abs(pattern.estimatedModuleSize - average) > limit)
                    {
                        this.possibleCenters.splice(i,1);

                        i--;
                    }
                }
            }

            if (this.possibleCenters.length > 3)
            {
                // Credit for putting a sort function here goes to Jaron Viëtor
                // https://github.com/Thulinma
                // Throw away all but those first size candidate points we found.
                
                this.possibleCenters.sort(function(a, b){return ((b.count-a.count)>>31)^((a.count-b.count)>>>31)});
            }

            return [this.possibleCenters[0],  this.possibleCenters[1],  this.possibleCenters[2]]
        }

    this.findRowSkip=function()
        {
            var max = this.possibleCenters.length;
            if (max <= 1)
            {
                return 0;
            }
            var firstConfirmedCenter = null;
            for (var i = 0; i < max; i++)
            {
                var center =  this.possibleCenters[i];
                if (center.count >= CENTER_QUORUM)
                {
                    if (firstConfirmedCenter == null)
                    {
                        firstConfirmedCenter = center;
                    }
                    else
                    {
                        // We have two confirmed centers
                        // How far down can we skip before resuming looking for the next
                        // pattern? In the worst case, only the difference between the
                        // difference in the x / y coordinates of the two centers.
                        // This is the case where you find top left last.
                        this.hasSkipped = true;
                        return (Math.abs(firstConfirmedCenter.x - center.x) - Math.abs(firstConfirmedCenter.y - center.y)) >>1; // Math.floor(x/2)
                    }
                }
            }
            return 0;
        }

    this.haveMultiplyConfirmedCenters=function()
        {
            var confirmedCount = 0;
            var totalModuleSize = 0.0;
            var max = this.possibleCenters.length;
            for (var i = 0; i < max; i++)
            {
                var pattern =  this.possibleCenters[i];
                if (pattern.count >= CENTER_QUORUM)
                {
                    confirmedCount++;
                    totalModuleSize += pattern.estimatedModuleSize;
                }
            }
            if (confirmedCount < 3)
            {
                return false;
            }
            // OK, we have at least 3 confirmed centers, but, it's possible that one is a "false positive"
            // and that we need to keep looking. We detect this by asking if the estimated module sizes
            // vary too much. We arbitrarily say that when the total deviation from average exceeds
            // 5% of the total module size estimates, it's too much.
            var average = totalModuleSize / max;
            var totalDeviation = 0.0;
            for (var i = 0; i < max; i++)
            {
                pattern = this.possibleCenters[i];
                totalDeviation += Math.abs(pattern.estimatedModuleSize - average);
            }
            return totalDeviation <= 0.05 * totalModuleSize;
        }

    this.findFinderPattern = function(image){
        var tryHarder = false;
        this.image=image;
        var maxI = qrcode.height;
        var maxJ = qrcode.width;
        var iSkip = Math.floor((3 * maxI) * INVERSE_MAX_MODULESx4);
        if (iSkip < MIN_SKIP || tryHarder)
        {
                iSkip = MIN_SKIP;
        }

        var done = false;
        var stateCount = new Uint16Array(5);
        for (var i = iSkip - 1; i < maxI && !done; i += iSkip)
        {
            // Get a row of black/white values
            stateCount[0] = 0;
            stateCount[1] = 0;
            stateCount[2] = 0;
            stateCount[3] = 0;
            stateCount[4] = 0;
            var currentState = 0;
            for (var j = 0; j < maxJ; j++)
            {
                if (image[j+i*qrcode.width] )
                {
                    // Black pixel
                    if ((currentState & 1) == 1)
                    {
                        // Counting white pixels
                        currentState++;
                    }
                    stateCount[currentState]++;
                }
                else
                {
                    // White pixel
                    if ((currentState & 1) == 0)
                    {
                        // Counting black pixels
                        if (currentState == 4)
                        {
                            // A winner?
                            if (this.foundPatternCross(stateCount))
                            {
                                // Yes
                                var confirmed = this.handlePossibleCenter(stateCount, i, j);
                                if (confirmed)
                                {
                                    // Start examining every other line. Checking each line turned out to be too
                                    // expensive and didn't improve performance.
                                    iSkip = 2;
                                    if (this.hasSkipped)
                                    {
                                        done = this.haveMultiplyConfirmedCenters();
                                    }
                                    else
                                    {
                                        var rowSkip = this.findRowSkip();
                                        if (rowSkip > stateCount[2])
                                        {
                                            // Skip rows between row of lower confirmed center
                                            // and top of presumed third confirmed center
                                            // but back up a bit to get a full chance of detecting
                                            // it, entire width of center of finder pattern

                                            // Skip by rowSkip, but back off by stateCount[2] (size of last center
                                            // of pattern we saw) to be conservative, and also back off by iSkip which
                                            // is about to be re-added
                                            i += rowSkip - stateCount[2] - iSkip;
                                            j = maxJ - 1;
                                        }
                                    }
                                }
                                else
                                {
                                    // Advance to next black pixel
                                    do 
                                    {
                                        j++;
                                    }
                                    while (j < maxJ && !image[j + i*qrcode.width]);
                                    j--; // back up to that last white pixel
                                }
                                // Clear state to start looking again
                                currentState = 0;
                                stateCount[0] = 0;
                                stateCount[1] = 0;
                                stateCount[2] = 0;
                                stateCount[3] = 0;
                                stateCount[4] = 0;
                            }
                            else
                            {
                                // No, shift counts back by two
                                stateCount[0] = stateCount[2];
                                stateCount[1] = stateCount[3];
                                stateCount[2] = stateCount[4];
                                stateCount[3] = 1;
                                stateCount[4] = 0;
                                currentState = 3;
                            }
                        }
                        else
                        {
                            stateCount[++currentState]++;
                        }
                    }
                    else
                    {
                        // Counting white pixels
                        stateCount[currentState]++;
                    }
                }
            }
            if (this.foundPatternCross(stateCount))
            {
                var confirmed = this.handlePossibleCenter(stateCount, i, maxJ);
                if (confirmed)
                {
                    iSkip = stateCount[0];
                    if (this.hasSkipped)
                    {
                        // Found a third one
                        done = haveMultiplyConfirmedCenters();
                    }
                }
            }
        }

        var patternInfo = this.selectBestPatterns();
        qrcode.orderBestPatterns(patternInfo);

        return new FinderPatternInfo(patternInfo);
    };
}




function AlignmentPatternFinder( image,  startX,  startY,  width,  height,  moduleSize,  resultPointCallback)
{
    this.image = image;
    this.possibleCenters = new Array();
    this.startX = startX;
    this.startY = startY;
    this.width = width;
    this.height = height;
    this.moduleSize = moduleSize;
    this.crossCheckStateCount = new Uint16Array(3);
    this.resultPointCallback = resultPointCallback;

    this.centerFromEnd=function(stateCount,  end)
        {
            return  (end - stateCount[2]) - stateCount[1] * 0.5; // div by 2
        }
    this.foundPatternCross = function(stateCount)
        {
            var moduleSize = this.moduleSize;
            var maxVariance = moduleSize * 0.5; // div by 2
            for (var i = 0; i < 3; i++)
            {
                if (Math.abs(moduleSize - stateCount[i]) >= maxVariance)
                {
                    return false;
                }
            }
            return true;
        }

    this.crossCheckVertical=function( startI,  centerJ,  maxCount,  originalStateCountTotal)
        {
            var image = this.image;

            var maxI = qrcode.height;
            var stateCount = this.crossCheckStateCount;
            stateCount[0] = 0;
            stateCount[1] = 0;
            stateCount[2] = 0;

            // Start counting up from center
            var i = startI;
            while (i >= 0 && image[centerJ + i*qrcode.width] && stateCount[1] <= maxCount)
            {
                stateCount[1]++;
                i--;
            }
            // If already too many modules in this state or ran off the edge:
            if (i < 0 || stateCount[1] > maxCount)
            {
                return NaN;
            }
            while (i >= 0 && !image[centerJ + i*qrcode.width] && stateCount[0] <= maxCount)
            {
                stateCount[0]++;
                i--;
            }
            if (stateCount[0] > maxCount)
            {
                return NaN;
            }

            // Now also count down from center
            i = startI + 1;
            while (i < maxI && image[centerJ + i*qrcode.width] && stateCount[1] <= maxCount)
            {
                stateCount[1]++;
                i++;
            }
            if (i == maxI || stateCount[1] > maxCount)
            {
                return NaN;
            }
            while (i < maxI && !image[centerJ + i*qrcode.width] && stateCount[2] <= maxCount)
            {
                stateCount[2]++;
                i++;
            }
            if (stateCount[2] > maxCount)
            {
                return NaN;
            }

            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2];
            if (5 * Math.abs(stateCountTotal - originalStateCountTotal) >= 2 * originalStateCountTotal)
            {
                return NaN;
            }

            return this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount, i):NaN;
        }

    this.handlePossibleCenter=function( stateCount,  i,  j)
        {
            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2];
            var centerJ = this.centerFromEnd(stateCount, j);
            var centerI = this.crossCheckVertical(i, Math.floor (centerJ), stateCount[1] << 1, stateCountTotal); //  2 * stateCount[1]
            if (!isNaN(centerI))
            {
                var estimatedModuleSize = (stateCount[0] + stateCount[1] + stateCount[2]) * 0.333333333 // div by 3
                var max = this.possibleCenters.length;
                for (var index = 0; index < max; index++)
                {
                    var center =  this.possibleCenters[index];
                    // Look for about the same center and module size:
                    if (center.aboutEquals(estimatedModuleSize, centerI, centerJ))
                    {
                        return new qrPattern(centerJ, centerI, estimatedModuleSize);
                    }
                }
                // Hadn't found this before; save it
                var point = new qrPattern(centerJ, centerI, estimatedModuleSize);
                this.possibleCenters.push(point);
    
            }
            return null;
        }

    this.find = function()
    {
            var startX = this.startX;
            var height = this.height;
            var maxJ = startX + width;
            var middleI = startY + (height >> 1);
            // We are looking for black/white/black modules in 1:1:1 ratio;
            // this tracks the number of black/white/black modules seen so far
            var stateCount = new Uint16Array(3);
            for (var iGen = 0; iGen < height; iGen++)
            {
                // Search from middle outwards
                var i = middleI + ((iGen & 0x01) == 0?((iGen + 1) >> 1):- ((iGen + 1) >> 1));
                stateCount[0] = 0;
                stateCount[1] = 0;
                stateCount[2] = 0;
                var j = startX;
                // Burn off leading white pixels before anything else; if we start in the middle of
                // a white run, it doesn't make sense to count its length, since we don't know if the
                // white run continued to the left of the start point
                while (j < maxJ && !image[j + qrcode.width* i])
                {
                    j++;
                }
                var currentState = 0;
                while (j < maxJ)
                {
                    if (image[j + i*qrcode.width])
                    {
                        // Black pixel
                        if (currentState == 1)
                        {
                            // Counting black pixels
                            stateCount[currentState]++;
                        }
                        else
                        {
                            // Counting white pixels
                            if (currentState == 2)
                            {
                                // A winner?
                                if (this.foundPatternCross(stateCount))
                                {
                                    // Yes
                                    var confirmed = this.handlePossibleCenter(stateCount, i, j);
                                    if (confirmed != null)
                                    {
                                        return confirmed;
                                    }
                                }
                                stateCount[0] = stateCount[2];
                                stateCount[1] = 1;
                                stateCount[2] = 0;
                                currentState = 1;
                            }
                            else
                            {
                                stateCount[++currentState]++;
                            }
                        }
                    }
                    else
                    {
                        // White pixel
                        if (currentState == 1)
                        {
                            // Counting black pixels
                            currentState++;
                        }
                        stateCount[currentState]++;
                    }
                    j++;
                }
                if (this.foundPatternCross(stateCount))
                {
                    var confirmed = this.handlePossibleCenter(stateCount, i, maxJ);
                    if (confirmed != null)
                    {
                        return confirmed;
                    }
                }
            }

            // Hmm, nothing we saw was observed and confirmed twice. If we had
            // any guess at all, return it.
            if (!(this.possibleCenters.length == 0))
            {
                return  this.possibleCenters[0];
            }
            return null

        }

}


function QRCodeDataBlockReader(blocks,  version,  numErrorCorrectionCode)
{
    this.blockPointer = 0;
    this.bitPointer = 7;
    this.dataLength = 0;
    this.blocks = blocks;
    this.numErrorCorrectionCode = numErrorCorrectionCode;
    if (version <= 9)
        this.dataLengthMode = 0;
    else if (version >= 10 && version <= 26)
        this.dataLengthMode = 1;
    else if (version >= 27 && version <= 40)
        this.dataLengthMode = 2;

    this.getNextBits = function( numBits)
        {            
            var bits = 0;
            if (numBits < this.bitPointer + 1)
            {
                // next word fits into current data block
                var mask = 0;
                for (var i = 0; i < numBits; i++)
                {
                    mask += (1 << i);
                }
                mask <<= (this.bitPointer - numBits + 1);

                bits = (this.blocks[this.blockPointer] & mask) >> (this.bitPointer - numBits + 1);
                this.bitPointer -= numBits;
                return bits;
            }
            else if (numBits < this.bitPointer + 1 + 8)
            {
                // next word crosses 2 data blocks
                var mask1 = 0;
                for (var i = 0; i < this.bitPointer + 1; i++)
                {
                    mask1 += (1 << i);
                }
                bits = (this.blocks[this.blockPointer] & mask1) << (numBits - (this.bitPointer + 1));
                this.blockPointer++;
                bits += ((this.blocks[this.blockPointer]) >> (8 - (numBits - (this.bitPointer + 1))));

                this.bitPointer = this.bitPointer - numBits % 8;
                if (this.bitPointer < 0)
                {
                    this.bitPointer = 8 + this.bitPointer;
                }
                return bits;
            }
            else if (numBits < this.bitPointer + 1 + 16)
            {
                // next word crosses 3 data blocks
                var mask1 = 0; // mask of first block
                var mask3 = 0; // mask of 3rd block
                //bitPointer + 1 : number of bits of the 1st block
                //8 : number of the 2nd block (note that use already 8bits because next word uses 3 data blocks)
                //numBits - (bitPointer + 1 + 8) : number of bits of the 3rd block 
                for (var i = 0; i < this.bitPointer + 1; i++)
                {
                    mask1 += (1 << i);
                }
                var bitsFirstBlock = (this.blocks[this.blockPointer] & mask1) << (numBits - (this.bitPointer + 1));
                this.blockPointer++;

                var bitsSecondBlock = this.blocks[this.blockPointer] << (numBits - (this.bitPointer + 1 + 8));
                this.blockPointer++;

                for (var i = 0; i < numBits - (this.bitPointer + 1 + 8); i++)
                {
                    mask3 += (1 << i);
                }
                mask3 <<= 8 - (numBits - (this.bitPointer + 1 + 8));
                var bitsThirdBlock = (this.blocks[this.blockPointer] & mask3) >> (8 - (numBits - (this.bitPointer + 1 + 8)));

                bits = bitsFirstBlock + bitsSecondBlock + bitsThirdBlock;
                this.bitPointer = this.bitPointer - (numBits - 8) % 8;
                if (this.bitPointer < 0)
                {
                    this.bitPointer = 8 + this.bitPointer;
                }
                return bits;
            }
            else
            {
                return 0;
            }
        }
    this.NextMode=function()
    {
        if ((this.blockPointer > this.blocks.length - this.numErrorCorrectionCode - 2))
            return 0;
        else
            return this.getNextBits(4);
    }
    this.getDataLength=function( modeIndicator)
        {
            var index = 0;
            while (true)
            {
                if ((modeIndicator >> index) == 1)
                    break;
                index++;
            }

            return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][index]);
        }
    this.getRomanAndFigureString=function( dataLength)
        {
            var length = dataLength;
            var intData = 0;
            var strData = "";
            var tableRomanAndFigure = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '$', '%', '*', '+', '-', '.', '/', ':');
            do 
            {
                if (length > 1)
                {
                    intData = this.getNextBits(11);
                    var firstLetter = Math.floor(intData *0.022222222); // div by 45
                    var secondLetter = intData % 45;
                    strData += tableRomanAndFigure[firstLetter];
                    strData += tableRomanAndFigure[secondLetter];
                    length -= 2;
                }
                else if (length == 1)
                {
                    intData = this.getNextBits(6);
                    strData += tableRomanAndFigure[intData];
                    length -= 1;
                }
            }
            while (length > 0);

            return strData;
        }
    this.getFigureString=function( dataLength)
        {
            var length = dataLength;
            var intData = 0;
            var strData = "";
            do 
            {
                if (length >= 3)
                {
                    intData = this.getNextBits(10);
                    if (intData < 100)
                        strData += "0";
                    if (intData < 10)
                        strData += "0";
                    length -= 3;
                }
                else if (length == 2)
                {
                    intData = this.getNextBits(7);
                    if (intData < 10)
                        strData += "0";
                    length -= 2;
                }
                else if (length == 1)
                {
                    intData = this.getNextBits(4);
                    length -= 1;
                }
                strData += intData;
            }
            while (length > 0);

            return strData;
        }
    this.get8bitByteArray=function( dataLength)
        {
            var length = dataLength;
            var intData = 0;
            var output = new Array();

            do 
            {
                intData = this.getNextBits(8);
                output.push( intData);
                length--;
            }
            while (length > 0);
            return output;
        }
    this.getKanjiString=function( dataLength)
        {
            var length = dataLength;
            var intData = 0;
            var unicodeString = "";
            do 
            {
                intData = getNextBits(13);
                var lowerByte = intData % 0xC0;
                var higherByte = intData *0.005208333333333333; // div by 0xC0

                var tempWord = (higherByte << 8) + lowerByte;
                var shiftjisWord = 0;
                if (tempWord + 0x8140 <= 0x9FFC)
                {
                    // between 8140 - 9FFC on Shift_JIS character set
                    shiftjisWord = tempWord + 0x8140;
                }
                else
                {
                    // between E040 - EBBF on Shift_JIS character set
                    shiftjisWord = tempWord + 0xC140;
                }

               
                unicodeString += String.fromCharCode(shiftjisWord);
                length--;
            }
            while (length > 0);


            return unicodeString;
        }

    this.__defineGetter__("DataByte", function()
    {
        var output = new Array();
        var MODE_NUMBER = 1;
        var MODE_ROMAN_AND_NUMBER = 2;
        var MODE_8BIT_BYTE = 4;
        var MODE_KANJI = 8;
        var dataLength
        do 
                    {
                        var mode = this.NextMode();
                        //canvas.println("mode: " + mode);
                        if (mode == 0)
                        {
                            if (output.length > 0)
                                break;
                            else
                                throw "Empty data block";
                        }
                        //if (mode != 1 && mode != 2 && mode != 4 && mode != 8)
                        //    break;
                        //}
                        if (mode != MODE_NUMBER && mode != MODE_ROMAN_AND_NUMBER && mode != MODE_8BIT_BYTE && mode != MODE_KANJI)
                        {
                            /*                    canvas.println("Invalid mode: " + mode);
                            mode = guessMode(mode);
                            canvas.println("Guessed mode: " + mode); */
                            throw "Invalid mode: " + mode + " in (block:" + this.blockPointer + " bit:" + this.bitPointer + ")";
                        }
                        dataLength = this.getDataLength(mode);
                        if (dataLength < 1)
                            throw "Invalid data length: " + dataLength;
                        //canvas.println("length: " + dataLength);
                        switch (mode)
                        {

                            case MODE_NUMBER: 
                                //canvas.println("Mode: Figure");
                                var temp_str = this.getFigureString(dataLength);
                                var ta = new Array(temp_str.length);
                                for(var j=0;j<temp_str.length;j++)
                                    ta[j]=temp_str.charCodeAt(j);
                                output.push(ta);
                                break;

                            case MODE_ROMAN_AND_NUMBER: 
                                //canvas.println("Mode: Roman&Figure");
                                var temp_str = this.getRomanAndFigureString(dataLength);
                                var ta = new Array(temp_str.length);
                                for(var j=0;j<temp_str.length;j++)
                                    ta[j]=temp_str.charCodeAt(j);
                                output.push(ta );
                                //output.Write(SystemUtils.ToByteArray(temp_sbyteArray2), 0, temp_sbyteArray2.Length);
                                break;

                            case MODE_8BIT_BYTE: 
                                //canvas.println("Mode: 8bit Byte");
                                //sbyte[] temp_sbyteArray3;
                                var temp_sbyteArray3 = this.get8bitByteArray(dataLength);
                                output.push(temp_sbyteArray3);
                                //output.Write(SystemUtils.ToByteArray(temp_sbyteArray3), 0, temp_sbyteArray3.Length);
                                break;

                            case MODE_KANJI: 
                                //canvas.println("Mode: Kanji");
                                //sbyte[] temp_sbyteArray4;
                                //temp_sbyteArray4 = SystemUtils.ToSByteArray(SystemUtils.ToByteArray(getKanjiString(dataLength)));
                                //output.Write(SystemUtils.ToByteArray(temp_sbyteArray4), 0, temp_sbyteArray4.Length);
                                var temp_str = this.getKanjiString(dataLength);
                                output.push(temp_str);
                                break;
                            }
                        //            
                        //canvas.println("DataLength: " + dataLength);
                        //Console.out.println(dataString);
                    }
                    while (true);
        return output;
    });
}

/*
Code below this line is by Kenneth Lichtenberger with no credit due unless noted
*/


function numBitsDiffering(a,b){

    // Count bits with ultra fast method
    // see http://graphics.stanford.edu/~seander/bithacks.html
    a = a ^ b // now 2nd half has 1 bit exactly where its bit differs with b's
    a = a - ((a >> 1) & 0x55555555); 
    a = (a & 0x33333333) + ((a >> 2) & 0x33333333); 
    return (((a + (a >> 4) & 0xF0F0F0F) * 0x1010101) >> 24)
    
}

function ECMA_QR_Image(middleLength,numSqrtArea,areaWidth,areaHeight,w,h){
    var length = (w*h)|0
    var img = new Uint8Array(length)
    this.middleLength = middleLength|0
    this.length = length
    this.width = w|0
    this.height = h|0
    this.endX = (areaWidth*numSqrtArea)|0
    this.yLen =  (w*areaHeight)|0
    this.areaHeightXWidth = (areaHeight*w)|0
    this.numSqrtArea= numSqrtArea|0
    this.numSqrtAreaPlus1 = (numSqrtArea+1)|0
    this.areaWidth=areaWidth|0
    this.areaHeight = areaHeight|0
    this.image = img
    this.bits =  new Uint8Array(length)
    this.middle = new Uint16Array(middleLength)
    this.blurDiffMachine = new blurDiffMachine(img,2,4,w,h)

}
ECMA_QR_Image.prototype = {
    doBinary:function(buff,diff){
        
        var dx
        var _min,_minPlus1
        var _max
        var tmp
        var _1per
        var point
        var cur,pix
        var dark,light
        var areaPoint1,areaPoint2,areaPoint3
        var numSqrtAreaPoint 
        var yEnd
        this.blurDiffMachine.doDiff()
        areaPoint2 = areaPoint1 = numSqrtAreaPoint = 0
        do{
             dx  = 0
            _max = this.middle[numSqrtAreaPoint]
            _min = _max >>> 8
            _max = _max & 0xff
            _minPlus1 = _min+1
            _1per = 1/((_max-_min)*0.01)

            areaPoint3 = areaPoint2
            yEnd = this.yLen + areaPoint2
            do{
                point = areaPoint1 + dx + areaPoint3
                cur = this.blurDiffMachine.diff[point]
                pix = this.image[point]

                dark = (dark=_min-pix,(dark+(tmp=dark>>31) ^ tmp))*_1per|0
                light = (light=_max-pix,(light+(tmp=light>>31) ^ tmp))*_1per|0
                tmp = cur>>31
                this.bits[point] = 1
                this.bits[point] = ( (pix-_minPlus1)>>31 | ((30-light)>>31 & tmp ) | (dark-41)>>31 &  (tmp^-1) )&1
              
                dx++
                tmp = (dx-this.areaWidth)>>31
                dx &= tmp
                areaPoint3 += this.width&(tmp^-1)
                //-----------------
            }while(areaPoint3<yEnd)
             /*
            this code will increment ax and ay to loop x y blocks 
            */
            areaPoint1 += this.areaWidth
            tmp = (areaPoint1-this.endX)>>31
            areaPoint1 &= tmp
            tmp ^= -1
            numSqrtAreaPoint += this.numSqrtAreaPlus1&tmp
            areaPoint2 += this.areaHeightXWidth&tmp
            //-----------------
        }while(numSqrtAreaPoint<this.middleLength)

       
    }
}

function ECMA_QR(w,h){
    var numSqrtArea = 6;
    var numSqrtAreaX = 1/numSqrtArea
    var areaWidth = (w * numSqrtAreaX)|0
    var areaHeight = (h * numSqrtAreaX)|0
    var middle_l = numSqrtArea*numSqrtArea|0
    var length = (w*h)|0
    this.middleLength = middle_l
    this.length = length
    this.width = w|0
    this.height = h|0
    this.endX = (areaWidth*numSqrtArea)|0
    this.yLen =  (w*areaHeight)|0
    this.areaHeightXWidth = (areaHeight*w)|0
    this.numSqrtArea= numSqrtArea|0
    this.numSqrtAreaPlus1 = (numSqrtArea+1)|0
    this.areaWidth = areaWidth|0
    this.areaHeight = areaHeight|0
    this.image1 = new ECMA_QR_Image(middle_l,numSqrtArea,areaWidth,areaHeight,w,h)
    this.image2 = new ECMA_QR_Image(middle_l,numSqrtArea,areaWidth,areaHeight,w,h)
    this.count = new Int32Array(256)
    this.zeroCount = new Int32Array(256)
}
ECMA_QR.prototype = {
    processCanvasRGB:function (imageData){
        var image = new Uint32Array(imageData.buffer)
        var point
        var r,b,g
        var _min,_max,_min1,_max1,_min2,_max2
        var max_c
        var min_c
        var tmp,tmp2,tmp3
        var _mid
        var upper1,upper2,lower1,lower2
        var upper_val1,upper_val2
        var lower_val1,lower_val2
        var i,l
        var cur
        var upper_set,upper_other,lower_set,lower_other,upperX,lowerX

        var areaPoint1,areaPoint2,areaPoint3,dx
        var numSqrtAreaPoint 
        var yEnd

        
        areaPoint2 = areaPoint1 = numSqrtAreaPoint = 0
        do{
            
            _min = 0xFF
            _max = 0
            _min1= _min2 = 255.01
            _max1 = _max2 = 0.01
            // zero out count with a static empty array
            // this is faster than making a new  one and faster then zeroing it out in js
            this.count.set(this.zeroCount) 
            dx  = 0

            areaPoint3 = areaPoint2
            yEnd = this.yLen + areaPoint2
            do{
                point = areaPoint1 + dx + areaPoint3
                cur = image[point];
                r = (cur>>>16)&0xff
                b = (cur>>>8)&0xff
                g = cur&0xff
                ///------------------------
                tmp = (tmp=r-b) & (tmp >> 31)
                max_c = r - tmp                 //----Max for a int of 32 bits or less
                min_c = b + tmp                 //----min for a int of 32 bits or less
                max_c = max_c - ((tmp=max_c - g) & (tmp >> 31))             //----Max for a int of 32 bits or less
                min_c = g + ((tmp=min_c - g ) & (tmp >> 31))                //----min for a int of 32 bits or less
                /// max and min  of r g and b ^^^^^^^^^^^^^^^^^^
                ///------------------------ 
                   
                cur = (max_c+min_c)>>1 // avg
                
                this.image1.image[point]= cur
                this.count[cur]++
    
                _max = _max - ((tmp  = _max - cur) & (tmp >> 31)) //----Max for a int of 32 bits or less
                
                _min = cur + ((tmp = _min - cur) & (tmp >> 31)) //----min for a int of 32 bits or less
                
                
                _max1 = (_max1<cur) ? (_max1*3+cur)*0.25:_max1
                _min1 = (_min1>cur) ? (_min1*3+cur)*0.25:_min1
                
                /*
                this code will increment dx and dy to loop x y blocks 
                */
                dx++
                tmp = (dx-this.areaWidth)>>31
                dx &= tmp
                areaPoint3 += this.width&(tmp^-1)
                //-----------------
            }while(areaPoint3<yEnd)
            this.image1.middle[numSqrtAreaPoint] =  (_min1<<8) | _max1
            
            _mid = (_max - _min)>>1
            
            upper_val1=upper_val2=upper1=upper2=lower1=lower2=0
            
            i = _min
            
            do{
                cur = this.count[i]
                tmp = upper1 - cur
                tmp2 = tmp>>31
                upper1 = upper1 - (tmp & tmp2) //----max for a int of 32 bits or less 
                tmp = tmp2^-1
                upper_val1 = (i&tmp2) | (upper_val1&tmp)
                cur &= tmp // if the first passed make sure the 2nd fails 
                   
                   
                tmp = upper2 - cur
                tmp2 = tmp>>31
                upper2 = upper2 - (tmp & tmp2) //----max for a int of 32 bits or less 
            	upper_val2 = (i&tmp2) | (upper_val2&(tmp2^-1))
                i++
            }while(i<_mid)
            
            i = _mid
            l = _max+1
            do{
                cur = this.count[i]
                tmp = lower1 - cur
                tmp2 = tmp>>31
                lower1 = lower1 - (tmp & tmp2) //----max for a int of 32 bits or less 
                tmp = tmp2^-1
                lower_val1 = (i&tmp2)|(lower_val1&tmp)
                cur &=tmp // if the first passed make sure the 2nd fails 
                   
                tmp = lower2  - cur
                tmp2 = tmp>>31
                lower2 = lower2 - (tmp & tmp2) //----max for a int of 32 bits or less 
            	lower_val2 = (i&tmp2)|(lower_val2&(tmp2^-1))
                  
                
                i++
            }while(i<l)
    
            
            tmp = ((tmp  = upper_val2 - upper_val1) & (tmp >> 31))
            upper_set = upper_val1 + tmp  //----min for a int of 32 bits or less   
            upper_other = upper_val2 - tmp
            
            
            lower_other = lower_val2 + ((tmp = lower_val1-lower_val2) & (tmp >> 31))
            
            upperX = upper_set/upper_other
            lowerX = 254/lower_other 
            
            areaPoint3 = areaPoint2
            dx  = 0
              
            do{
                point = areaPoint1 + dx + areaPoint3
                cur = this.image1.image[point]
    
    
                if(cur >= upper_set && cur <= upper_other){
                    cur = upper_set
                } else if(cur <= _mid){
                    cur = (cur * upperX)|0
                }else if(cur >= lower_other ){
                    cur = 255
                } else{
                    cur = (cur * lowerX)|0
                }
    
               
                
                 
                _max2 = (_max2<cur) ? (_max2*3+cur)*0.25:_max2
                _min2 = (_min2>cur) ? (_min2*3+cur)*0.25:_min2
                
                this.image2.image[point] = cur
    
                /*
                this code will increment dx and dy to loop x y blocks 
                */
                dx++
                tmp = (dx-this.areaWidth)>>31
                dx &= tmp
                areaPoint3 += this.width&(tmp^-1)
                //-----------------
            }while(areaPoint3<yEnd)
            this.image2.middle[numSqrtAreaPoint] = (_min2<<8) | _max2
      
            
            /*
            this code will increment ax and ay to loop x y blocks 
            */
            areaPoint1 += this.areaWidth
            tmp = (areaPoint1-this.endX)>>31
            areaPoint1 &= tmp
            tmp ^= -1
            numSqrtAreaPoint += this.numSqrtAreaPlus1&tmp
            areaPoint2 += this.areaHeightXWidth&tmp
            //-----------------
        }while(numSqrtAreaPoint<this.middleLength)

    }
}
ECMA_QR.items = {}
ECMA_QR.forWidthHeight= function(w,h){
    var k = (w<<16|h).toString(16)
    var qr = this.items[k]
    if(!qr){
        qr = new ECMA_QR(w,h)
        this.items[k] = qr
    }
    return qr
}





function bits_to_canvas_buff(buff){
    var _c = new Uint8Array(buff.length*4)
    var c = new Uint32Array(_c.buffer)
    var i = 0
    var l = buff.length

    do{
        if(buff[i]){
            c[i] = 0xFF000000
        } else {
            c[i] = 0xFFFFFFFF

        }

        i++
    }while(i<l)
    return _c
}

function gray_to_canvas_buff(buff){
    var _c = new Uint8Array(buff.length*4)
    var c = new Int32Array(_c.buffer)
    var i = 0
    var l = buff.length
    var cur
    do{
        cur = buff[i]
        c[i] = (0xFF<<24)|(cur<<16)|(cur<<8)|cur
        i++
    }while(i<l)
    return _c
}






function blurDiffMachine(img,r1,r2,w,h){
    var l = img.length|0
   
    this.l = l
    this.diff = new Int16Array(l)
    this.img = img
    this.g1 =  new blurMachineGray(w,h,r1)
    this.g2 = new blurMachineGray(w,h,r2)
    
}
blurDiffMachine.prototype = {
    doDiff:function(){
        var i = 0
        this.g1.blur(this.img)
        this.g2.blur(this.img)
        do{
            this.diff[i] = this.g1.pixels[i] - this.g2.pixels[i]
            i++
        }while(i<this.l)
    }
}



function non_webworker(dat,w,h){
  var qr = ECMA_QR.forWidthHeight(w,h)
  var dat
  var start = new Date();
  var i = 0
  do{
      qr.processCanvasRGB(dat)
      qr.image1.doBinary()
      qr.image2.doBinary()
      i++
  }while(i<30)
  console.log(new Date() - start + ' fin')
  return
}

var ended={isEnded:false,count:0,sum:0,bd:null}
addEventListener('message', function(e) {
  if(ended.isEnded) return
  var w = e.data.w
  var h = e.data.h
  qrcode.width = w
  qrcode.height = h
  var start1 = new Date
  
  //postMessage(gray_to_canvas_buff(gray_from_canvas2(e.data.buff)))
  function post(bits){
      var ret
      var start2 = new Date()
      try{

          ret = qrcode.process(bits,w,h)
          ended.count++
          ended.sum+= new Date() - start1
          console.log(new Date() - start2 + ' fin')
          console.log(new Date() - start1 + ' fin all')
          console.log((ended.sum/ended.count) + ' avg')
          ended.isEnded = true
          postMessage(ret)
          //var test1 = (ret == "6JKeKYJ4SGrK4h1xwT3MJ6TfyGfn1kK57QuMJED5ap5NmDqViqaEZwGrRqhimZuXAFKUrM6vrKvNR4pRCicmCwBXo7AC2DWeWrNPCJGpTKzuCYZUHVvhX62aYpYWGLAABmJRGc97M6RQHsonR4fn2y7J2fHtEybAVevX")
          //var test2 = (ret == "MXp8FodxoKZcLsQt9NpG94nUWoQk133Qo6cyNPTzjtq7udUP563u9VoKV9VAjH88fGbVZfjNimg5DHpAQwCGZCkbsrdFvnRguYsL7KveEf9tyx6UPaU3gk3pYUMgPWmzNTEqCN8MPsajrr8pxSfvWAfz5uLRtiqNpgQV3ayWguDw2Yc2UsAvA6sadhL55KQzVzS43WRYqMShNy47wv4v6UwYa3qhT3QRCMqrf3AobW3av5EzpvyWzq4FFJkSvGH7nCBptSgXTBvgdL12qmAez6iPkiFtDT2pdVpE4qSi5TEGcDpRttWXRH4ZFX3uUntJrgLBmTAE")          
          /*if(test1 || test2){
              console.log('found')
              

          }else {
              console.log('bad Data')
              ended.isEnded = ture
              //self.close()
          }     */   

          //postMessage(ret)
          
          //self.close()
        } catch(e){
            ended.count++
            ended.sum+= new Date() - start1
            //console.log(new Date() - start2 + ' 2')
            console.log(e)
            console.log(e.stack)
            
        }
       // console.log(Object.keys(self))
  }

  

  var qr = ECMA_QR.forWidthHeight(w,h)



  qr.processCanvasRGB(e.data.buff)
  qr.image1.doBinary()
  qr.image2.doBinary()
  post(qr.image1.bits)
  post(qr.image2.bits)
  postMessage(bits_to_canvas_buff(qr.image2.bits))


  return
 
  

 
  
  
}, false);

//=============================
return non_webworker
})();