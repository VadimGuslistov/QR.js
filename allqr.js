(function (){

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

;stackBlurGray=(function (){
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





function stackBlurGray(buff,width, height, radius )
{
    if ( isNaN(radius) || radius < 1 ) return;
    radius |= 0;

    var pixels = new Uint8Array(buff)        
    var x, y, i, p, yp, yi, yw, sum,
    out_sum,
    in_sum,
    pg, bs;

    var div = radius + radius + 1;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) * 0.5;

    var stackStart = new BlurStack();
    var stack = stackStart;
    var stackEnd
    i = 1
    do{
        stack = stack.next = new BlurStack();
        if ( i++ == radiusPlus1 ) stackEnd = stack;
    }while(i < div)
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;

    yw = yi = 0;

    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    y=0
    do{
        in_sum = sum = 0;

        out_sum = radiusPlus1 * ( pg = pixels[yi] );


        sum += sumFactor * pg;


        stack = stackStart;
        i = 0
        do{
            stack.v = pg;
            stack = stack.next;
            i++
        }while(i < radiusPlus1)
        i = 1
        do{
            p = yi + ( widthMinus1 < i ? widthMinus1 : i );
            sum += ( stack.v = ( pg = pixels[p])) * ( bs = radiusPlus1 - i );

            in_sum += pg;

            stack = stack.next;
            i++
        }while(i < radiusPlus1)


        stackIn = stackStart;
        stackOut = stackEnd;
        x=0

        do{
            pixels[yi]   = (sum * mul_sum) >> shg_sum;


            sum -= out_sum;


            out_sum -= stackIn.v;


            p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) );

            in_sum += ( stackIn.v = pixels[p]);


            sum += in_sum;


            stackIn = stackIn.next;

            out_sum += ( pg = stackOut.v );


            in_sum -= pg;


            stackOut = stackOut.next;

            yi++;
            x++
        }while(x < width)
        yw += width;
        y++
    }while(y < height)

    x=0

    do{
        in_sum = sum = 0;

        yi = x;
        out_sum = radiusPlus1 * ( pg = pixels[yi]);


        sum += sumFactor * pg;


        stack = stackStart;

        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.v = pg;
            stack = stack.next;
        }

        yp = width;

        i=1

        do{
            yi = ( yp + x );

            sum += ( stack.v = ( pg = pixels[yi])) * ( bs = radiusPlus1 - i );


            in_sum += pg;


            stack = stack.next;

            if( i < heightMinus1 )
            {
                yp += width;
            }
            i++
        }while(i <= radius)

        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        y=0
        do{
            p = yi;
            pixels[p]   = (sum * mul_sum) >> shg_sum;


            sum -= out_sum;


            out_sum -= stackIn.v;


            p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width ));

            sum += ( in_sum += ( stackIn.v = pixels[p]));


            stackIn = stackIn.next;

            out_sum += ( pg = stackOut.v );


            in_sum -= pg;


            stackOut = stackOut.next;

            yi += width;
            y++
        }while(y < height)
        x++
    }while(x < width)
    return pixels


}

function BlurStack()
{
    this.v = 0
    this.next = null;
}
return stackBlurGray
//===============================

})();

//code below this line did not come from BlurStack

//code below this line did not come from BlurStack

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


GridSampler = {};

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
            var points = new Array(dimension << 1);
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
                try
                {
                    for (var x = 0; x < max; x += 2)
                    {
                        var xpoint = (Math.floor( points[x]) * 4) + (Math.floor( points[x + 1]) * qrcode.width * 4);
                        var bit = image[Math.floor( points[x])+ qrcode.width* Math.floor( points[x + 1])];

                        //bits[x >> 1][ y]=bit;
                        if(bit)
                            bits.set_Renamed(x >> 1, y);
                    }
                }
                catch ( aioobe)
                {
                    // This feels wrong, but, sometimes if the finder patterns are misidentified, the resulting
                    // transform gets "twisted" such that it maps a straight line of points to a set of points
                    // whose endpoints are in bounds, but others are not. There is probably some mathematical
                    // way to detect this about the transformation that I don't know yet.
                    // This results in an ugly runtime exception despite our clever checks above -- can't have
                    // that. We could check each point's coordinates but that feels duplicative. We settle for
                    // catching and wrapping ArrayIndexOutOfBoundsException.
                    throw "Error.checkAndNudgePoints";
                }
            }
            return bits;
        }

GridSampler.sampleGridx=function( image,  dimension,  p1ToX,  p1ToY,  p2ToX,  p2ToY,  p3ToX,  p3ToY,  p4ToX,  p4ToY,  p1FromX,  p1FromY,  p2FromX,  p2FromY,  p3FromX,  p3FromY,  p4FromX,  p4FromY)
{
    var transform = PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY);

    return GridSampler.sampleGrid3(image, dimension, transform);
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



function ECB(count,  dataCodewords)
{
    this.count = count;
    this.dataCodewords = dataCodewords;

    this.__defineGetter__("Count", function()
    {
        return this.count;
    });
    this.__defineGetter__("DataCodewords", function()
    {
        return this.dataCodewords;
    });
}

function ECBlocks( ecCodewordsPerBlock,  ecBlocks1,  ecBlocks2)
{
    this.ecCodewordsPerBlock = ecCodewordsPerBlock;
    if(ecBlocks2)
        this.ecBlocks = new Array(ecBlocks1, ecBlocks2);
    else
        this.ecBlocks = new Array(ecBlocks1);

    this.__defineGetter__("ECCodewordsPerBlock", function()
    {
        return this.ecCodewordsPerBlock;
    });

    this.__defineGetter__("TotalECCodewords", function()
    {
        return  this.ecCodewordsPerBlock * this.NumBlocks;
    });

    this.__defineGetter__("NumBlocks", function()
    {
        var total = 0;
        for (var i = 0; i < this.ecBlocks.length; i++)
        {
            total += this.ecBlocks[i].length;
        }
        return total;
    });

    this.getECBlocks=function()
            {
                return this.ecBlocks;
            }
}

function Version( versionNumber,  alignmentPatternCenters,  ecBlocks1,  ecBlocks2,  ecBlocks3,  ecBlocks4)
{
    this.versionNumber = versionNumber;
    this.alignmentPatternCenters = alignmentPatternCenters;
    this.ecBlocks = new Array(ecBlocks1, ecBlocks2, ecBlocks3, ecBlocks4);

    var total = 0;
    var ecCodewords = ecBlocks1.ECCodewordsPerBlock;
    var ecbArray = ecBlocks1.getECBlocks();
    for (var i = 0; i < ecbArray.length; i++)
    {
        var ecBlock = ecbArray[i];
        total += ecBlock.Count * (ecBlock.DataCodewords + ecCodewords);
    }
    this.totalCodewords = total;

    this.__defineGetter__("VersionNumber", function()
    {
        return  this.versionNumber;
    });

    this.__defineGetter__("AlignmentPatternCenters", function()
    {
        return  this.alignmentPatternCenters;
    });
    this.__defineGetter__("TotalCodewords", function()
    {
        return  this.totalCodewords;
    });
    this.__defineGetter__("DimensionForVersion", function()
    {
        return  17 + 4 * this.versionNumber;
    });

    this.buildFunctionPattern=function()
        {
            var dimension = this.DimensionForVersion;
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

            return bitMatrix;
        }
    this.getECBlocksForLevel=function( ecLevel)
    {
        return this.ecBlocks[ecLevel.ordinal()];
    }
}

Version.VERSION_DECODE_INFO = new Array(0x07C94, 0x085BC, 0x09A99, 0x0A4D3, 0x0BBF6, 0x0C762, 0x0D847, 0x0E60D, 0x0F928, 0x10B78, 0x1145D, 0x12A17, 0x13532, 0x149A6, 0x15683, 0x168C9, 0x177EC, 0x18EC4, 0x191E1, 0x1AFAB, 0x1B08E, 0x1CC1A, 0x1D33F, 0x1ED75, 0x1F250, 0x209D5, 0x216F0, 0x228BA, 0x2379F, 0x24B0B, 0x2542E, 0x26A64, 0x27541, 0x28C69);

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
    try
    {
        return Version.getVersionForNumber((dimension - 17) >> 2);
    }
    catch ( iae)
    {
        throw "Error getVersionForNumber";
    }
}

Version.decodeVersionInformation=function( versionBits)
{
    var bestDifference = 0xffffffff;
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
    return new Array(new Version(1, new Array(), new ECBlocks(7, new ECB(1, 19)), new ECBlocks(10, new ECB(1, 16)), new ECBlocks(13, new ECB(1, 13)), new ECBlocks(17, new ECB(1, 9))), 
    new Version(2, new Array(6, 18), new ECBlocks(10, new ECB(1, 34)), new ECBlocks(16, new ECB(1, 28)), new ECBlocks(22, new ECB(1, 22)), new ECBlocks(28, new ECB(1, 16))), 
    new Version(3, new Array(6, 22), new ECBlocks(15, new ECB(1, 55)), new ECBlocks(26, new ECB(1, 44)), new ECBlocks(18, new ECB(2, 17)), new ECBlocks(22, new ECB(2, 13))), 
    new Version(4, new Array(6, 26), new ECBlocks(20, new ECB(1, 80)), new ECBlocks(18, new ECB(2, 32)), new ECBlocks(26, new ECB(2, 24)), new ECBlocks(16, new ECB(4, 9))), 
    new Version(5, new Array(6, 30), new ECBlocks(26, new ECB(1, 108)), new ECBlocks(24, new ECB(2, 43)), new ECBlocks(18, new ECB(2, 15), new ECB(2, 16)), new ECBlocks(22, new ECB(2, 11), new ECB(2, 12))), 
    new Version(6, new Array(6, 34), new ECBlocks(18, new ECB(2, 68)), new ECBlocks(16, new ECB(4, 27)), new ECBlocks(24, new ECB(4, 19)), new ECBlocks(28, new ECB(4, 15))), 
    new Version(7, new Array(6, 22, 38), new ECBlocks(20, new ECB(2, 78)), new ECBlocks(18, new ECB(4, 31)), new ECBlocks(18, new ECB(2, 14), new ECB(4, 15)), new ECBlocks(26, new ECB(4, 13), new ECB(1, 14))), 
    new Version(8, new Array(6, 24, 42), new ECBlocks(24, new ECB(2, 97)), new ECBlocks(22, new ECB(2, 38), new ECB(2, 39)), new ECBlocks(22, new ECB(4, 18), new ECB(2, 19)), new ECBlocks(26, new ECB(4, 14), new ECB(2, 15))), 
    new Version(9, new Array(6, 26, 46), new ECBlocks(30, new ECB(2, 116)), new ECBlocks(22, new ECB(3, 36), new ECB(2, 37)), new ECBlocks(20, new ECB(4, 16), new ECB(4, 17)), new ECBlocks(24, new ECB(4, 12), new ECB(4, 13))), 
    new Version(10, new Array(6, 28, 50), new ECBlocks(18, new ECB(2, 68), new ECB(2, 69)), new ECBlocks(26, new ECB(4, 43), new ECB(1, 44)), new ECBlocks(24, new ECB(6, 19), new ECB(2, 20)), new ECBlocks(28, new ECB(6, 15), new ECB(2, 16))), 
    new Version(11, new Array(6, 30, 54), new ECBlocks(20, new ECB(4, 81)), new ECBlocks(30, new ECB(1, 50), new ECB(4, 51)), new ECBlocks(28, new ECB(4, 22), new ECB(4, 23)), new ECBlocks(24, new ECB(3, 12), new ECB(8, 13))), 
    new Version(12, new Array(6, 32, 58), new ECBlocks(24, new ECB(2, 92), new ECB(2, 93)), new ECBlocks(22, new ECB(6, 36), new ECB(2, 37)), new ECBlocks(26, new ECB(4, 20), new ECB(6, 21)), new ECBlocks(28, new ECB(7, 14), new ECB(4, 15))), 
    new Version(13, new Array(6, 34, 62), new ECBlocks(26, new ECB(4, 107)), new ECBlocks(22, new ECB(8, 37), new ECB(1, 38)), new ECBlocks(24, new ECB(8, 20), new ECB(4, 21)), new ECBlocks(22, new ECB(12, 11), new ECB(4, 12))), 
    new Version(14, new Array(6, 26, 46, 66), new ECBlocks(30, new ECB(3, 115), new ECB(1, 116)), new ECBlocks(24, new ECB(4, 40), new ECB(5, 41)), new ECBlocks(20, new ECB(11, 16), new ECB(5, 17)), new ECBlocks(24, new ECB(11, 12), new ECB(5, 13))), 
    new Version(15, new Array(6, 26, 48, 70), new ECBlocks(22, new ECB(5, 87), new ECB(1, 88)), new ECBlocks(24, new ECB(5, 41), new ECB(5, 42)), new ECBlocks(30, new ECB(5, 24), new ECB(7, 25)), new ECBlocks(24, new ECB(11, 12), new ECB(7, 13))), 
    new Version(16, new Array(6, 26, 50, 74), new ECBlocks(24, new ECB(5, 98), new ECB(1, 99)), new ECBlocks(28, new ECB(7, 45), new ECB(3, 46)), new ECBlocks(24, new ECB(15, 19), new ECB(2, 20)), new ECBlocks(30, new ECB(3, 15), new ECB(13, 16))), 
    new Version(17, new Array(6, 30, 54, 78), new ECBlocks(28, new ECB(1, 107), new ECB(5, 108)), new ECBlocks(28, new ECB(10, 46), new ECB(1, 47)), new ECBlocks(28, new ECB(1, 22), new ECB(15, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(17, 15))), 
    new Version(18, new Array(6, 30, 56, 82), new ECBlocks(30, new ECB(5, 120), new ECB(1, 121)), new ECBlocks(26, new ECB(9, 43), new ECB(4, 44)), new ECBlocks(28, new ECB(17, 22), new ECB(1, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(19, 15))), 
    new Version(19, new Array(6, 30, 58, 86), new ECBlocks(28, new ECB(3, 113), new ECB(4, 114)), new ECBlocks(26, new ECB(3, 44), new ECB(11, 45)), new ECBlocks(26, new ECB(17, 21), new ECB(4, 22)), new ECBlocks(26, new ECB(9, 13), new ECB(16, 14))), 
    new Version(20, new Array(6, 34, 62, 90), new ECBlocks(28, new ECB(3, 107), new ECB(5, 108)), new ECBlocks(26, new ECB(3, 41), new ECB(13, 42)), new ECBlocks(30, new ECB(15, 24), new ECB(5, 25)), new ECBlocks(28, new ECB(15, 15), new ECB(10, 16))), 
    new Version(21, new Array(6, 28, 50, 72, 94), new ECBlocks(28, new ECB(4, 116), new ECB(4, 117)), new ECBlocks(26, new ECB(17, 42)), new ECBlocks(28, new ECB(17, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(19, 16), new ECB(6, 17))), 
    new Version(22, new Array(6, 26, 50, 74, 98), new ECBlocks(28, new ECB(2, 111), new ECB(7, 112)), new ECBlocks(28, new ECB(17, 46)), new ECBlocks(30, new ECB(7, 24), new ECB(16, 25)), new ECBlocks(24, new ECB(34, 13))), 
    new Version(23, new Array(6, 30, 54, 74, 102), new ECBlocks(30, new ECB(4, 121), new ECB(5, 122)), new ECBlocks(28, new ECB(4, 47), new ECB(14, 48)), new ECBlocks(30, new ECB(11, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(16, 15), new ECB(14, 16))), 
    new Version(24, new Array(6, 28, 54, 80, 106), new ECBlocks(30, new ECB(6, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(6, 45), new ECB(14, 46)), new ECBlocks(30, new ECB(11, 24), new ECB(16, 25)), new ECBlocks(30, new ECB(30, 16), new ECB(2, 17))), 
    new Version(25, new Array(6, 32, 58, 84, 110), new ECBlocks(26, new ECB(8, 106), new ECB(4, 107)), new ECBlocks(28, new ECB(8, 47), new ECB(13, 48)), new ECBlocks(30, new ECB(7, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(13, 16))), 
    new Version(26, new Array(6, 30, 58, 86, 114), new ECBlocks(28, new ECB(10, 114), new ECB(2, 115)), new ECBlocks(28, new ECB(19, 46), new ECB(4, 47)), new ECBlocks(28, new ECB(28, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(33, 16), new ECB(4, 17))), 
    new Version(27, new Array(6, 34, 62, 90, 118), new ECBlocks(30, new ECB(8, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(22, 45), new ECB(3, 46)), new ECBlocks(30, new ECB(8, 23), new ECB(26, 24)), new ECBlocks(30, new ECB(12, 15),         new ECB(28, 16))),
    new Version(28, new Array(6, 26, 50, 74, 98, 122), new ECBlocks(30, new ECB(3, 117), new ECB(10, 118)), new ECBlocks(28, new ECB(3, 45), new ECB(23, 46)), new ECBlocks(30, new ECB(4, 24), new ECB(31, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(31, 16))), 
    new Version(29, new Array(6, 30, 54, 78, 102, 126), new ECBlocks(30, new ECB(7, 116), new ECB(7, 117)), new ECBlocks(28, new ECB(21, 45), new ECB(7, 46)), new ECBlocks(30, new ECB(1, 23), new ECB(37, 24)), new ECBlocks(30, new ECB(19, 15), new ECB(26, 16))), 
    new Version(30, new Array(6, 26, 52, 78, 104, 130), new ECBlocks(30, new ECB(5, 115), new ECB(10, 116)), new ECBlocks(28, new ECB(19, 47), new ECB(10, 48)), new ECBlocks(30, new ECB(15, 24), new ECB(25, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(25, 16))), 
    new Version(31, new Array(6, 30, 56, 82, 108, 134), new ECBlocks(30, new ECB(13, 115), new ECB(3, 116)), new ECBlocks(28, new ECB(2, 46), new ECB(29, 47)), new ECBlocks(30, new ECB(42, 24), new ECB(1, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(28, 16))), 
    new Version(32, new Array(6, 34, 60, 86, 112, 138), new ECBlocks(30, new ECB(17, 115)), new ECBlocks(28, new ECB(10, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(10, 24), new ECB(35, 25)), new ECBlocks(30, new ECB(19, 15), new ECB(35, 16))), 
    new Version(33, new Array(6, 30, 58, 86, 114, 142), new ECBlocks(30, new ECB(17, 115), new ECB(1, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(21, 47)), new ECBlocks(30, new ECB(29, 24), new ECB(19, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(46, 16))), 
    new Version(34, new Array(6, 34, 62, 90, 118, 146), new ECBlocks(30, new ECB(13, 115), new ECB(6, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(44, 24), new ECB(7, 25)), new ECBlocks(30, new ECB(59, 16), new ECB(1, 17))), 
    new Version(35, new Array(6, 30, 54, 78, 102, 126, 150), new ECBlocks(30, new ECB(12, 121), new ECB(7, 122)), new ECBlocks(28, new ECB(12, 47), new ECB(26, 48)), new ECBlocks(30, new ECB(39, 24), new ECB(14, 25)),new ECBlocks(30, new ECB(22, 15), new ECB(41, 16))), 
    new Version(36, new Array(6, 24, 50, 76, 102, 128, 154), new ECBlocks(30, new ECB(6, 121), new ECB(14, 122)), new ECBlocks(28, new ECB(6, 47), new ECB(34, 48)), new ECBlocks(30, new ECB(46, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(2, 15), new ECB(64, 16))), 
    new Version(37, new Array(6, 28, 54, 80, 106, 132, 158), new ECBlocks(30, new ECB(17, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(29, 46), new ECB(14, 47)), new ECBlocks(30, new ECB(49, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(24, 15), new ECB(46, 16))), 
    new Version(38, new Array(6, 32, 58, 84, 110, 136, 162), new ECBlocks(30, new ECB(4, 122), new ECB(18, 123)), new ECBlocks(28, new ECB(13, 46), new ECB(32, 47)), new ECBlocks(30, new ECB(48, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(42, 15), new ECB(32, 16))), 
    new Version(39, new Array(6, 26, 54, 82, 110, 138, 166), new ECBlocks(30, new ECB(20, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(40, 47), new ECB(7, 48)), new ECBlocks(30, new ECB(43, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(10, 15), new ECB(67, 16))), 
    new Version(40, new Array(6, 30, 58, 86, 114, 142, 170), new ECBlocks(30, new ECB(19, 118), new ECB(6, 119)), new ECBlocks(28, new ECB(18, 47), new ECB(31, 48)), new ECBlocks(30, new ECB(34, 24), new ECB(34, 25)), new ECBlocks(30, new ECB(20, 15), new ECB(61, 16))));
}/*
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




var FORMAT_INFO_MASK_QR = 0x5412;
var FORMAT_INFO_DECODE_LOOKUP = new Array(new Array(0x5412, 0x00), new Array(0x5125, 0x01), new Array(0x5E7C, 0x02), new Array(0x5B4B, 0x03), new Array(0x45F9, 0x04), new Array(0x40CE, 0x05), new Array(0x4F97, 0x06), new Array(0x4AA0, 0x07), new Array(0x77C4, 0x08), new Array(0x72F3, 0x09), new Array(0x7DAA, 0x0A), new Array(0x789D, 0x0B), new Array(0x662F, 0x0C), new Array(0x6318, 0x0D), new Array(0x6C41, 0x0E), new Array(0x6976, 0x0F), new Array(0x1689, 0x10), new Array(0x13BE, 0x11), new Array(0x1CE7, 0x12), new Array(0x19D0, 0x13), new Array(0x0762, 0x14), new Array(0x0255, 0x15), new Array(0x0D0C, 0x16), new Array(0x083B, 0x17), new Array(0x355F, 0x18), new Array(0x3068, 0x19), new Array(0x3F31, 0x1A), new Array(0x3A06, 0x1B), new Array(0x24B4, 0x1C), new Array(0x2183, 0x1D), new Array(0x2EDA, 0x1E), new Array(0x2BED, 0x1F));
var BITS_SET_IN_HALF_BYTE = new Array(0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4);


function FormatInformation(formatInfo)
{
    this.errorCorrectionLevel = ErrorCorrectionLevel.forBits((formatInfo >> 3) & 0x03);
    this.dataMask =  (formatInfo & 0x07);

    this.__defineGetter__("ErrorCorrectionLevel", function()
    {
        return this.errorCorrectionLevel;
    });
    this.__defineGetter__("DataMask", function()
    {
        return this.dataMask;
    });
    this.GetHashCode=function()
    {
        return (this.errorCorrectionLevel.ordinal() << 3) |  dataMask;
    }
    this.Equals=function( o)
    {
        var other =  o;
        return this.errorCorrectionLevel == other.errorCorrectionLevel && this.dataMask == other.dataMask;
    }
}

FormatInformation.numBitsDiffering=function( a,  b)
{
    a ^= b; // a now has a 1 bit exactly where its bit differs with b's
    // Count bits set quickly with a series of lookups:
    return BITS_SET_IN_HALF_BYTE[a & 0x0F] + BITS_SET_IN_HALF_BYTE[(URShift(a, 4) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 8) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 12) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 16) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 20) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 24) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 28) & 0x0F)];
}

FormatInformation.decodeFormatInformation=function( maskedFormatInfo)
{
    var formatInfo = FormatInformation.doDecodeFormatInformation(maskedFormatInfo);
    if (formatInfo != null)
    {
        return formatInfo;
    }
    // Should return null, but, some QR codes apparently
    // do not mask this info. Try again by actually masking the pattern
    // first
    return FormatInformation.doDecodeFormatInformation(maskedFormatInfo ^ FORMAT_INFO_MASK_QR);
}
FormatInformation.doDecodeFormatInformation=function( maskedFormatInfo)
{
    // Find the int in FORMAT_INFO_DECODE_LOOKUP with fewest bits differing
    var bestDifference = 0xffffffff;
    var bestFormatInfo = 0;
    for (var i = 0; i < FORMAT_INFO_DECODE_LOOKUP.length; i++)
    {
        var decodeInfo = FORMAT_INFO_DECODE_LOOKUP[i];
        var targetInfo = decodeInfo[0];
        if (targetInfo == maskedFormatInfo)
        {
            // Found an exact match
            return new FormatInformation(decodeInfo[1]);
        }
        //var bitsDifference = this.numBitsDiffering(maskedFormatInfo, targetInfo);
        var bitsDifference = numBitsDiffering(maskedFormatInfo, targetInfo);
        if (bitsDifference < bestDifference)
        {
            bestFormatInfo = decodeInfo[1];
            bestDifference = bitsDifference;
        }
    }
    // Hamming distance of the 32 masked codes is 7, by construction, so <= 3 bits
    // differing means we found a match
    if (bestDifference <= 3)
    {
        return new FormatInformation(bestFormatInfo);
    }
    return null;
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


function ErrorCorrectionLevel(ordinal,  bits, name)
{
    this.ordinal_Renamed_Field = ordinal;
    this.bits = bits;
    this.name = name;
    this.__defineGetter__("Bits", function()
    {
        return this.bits;
    });
    this.__defineGetter__("Name", function()
    {
        return this.name;
    });
    this.ordinal=function()
    {
        return this.ordinal_Renamed_Field;
    }
}

ErrorCorrectionLevel.forBits=function( bits)
{
    if (bits < 0 || bits >= FOR_BITS.length)
    {
        throw "ArgumentException";
    }
    return FOR_BITS[bits];
}

var L = new ErrorCorrectionLevel(0, 0x01, "L");
var M = new ErrorCorrectionLevel(1, 0x00, "M");
var Q = new ErrorCorrectionLevel(2, 0x03, "Q");
var H = new ErrorCorrectionLevel(3, 0x02, "H");
var FOR_BITS = new Array( M, L, H, Q);
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


function BitMatrix( width,  height)
{
    if(!height)
        height=width;
    if (width < 1 || height < 1)
    {
        throw "Both dimensions must be greater than 0";
    }
    this.width = width;
    this.height = height;
    var rowSize = width >> 5;
    if ((width & 0x1f) != 0)
    {
        rowSize++;
    }
    this.rowSize = rowSize;
    this.bits = new Array(rowSize * height);
    for(var i=0;i<this.bits.length;i++)
        this.bits[i]=0;

    this.__defineGetter__("Width", function()
    {
        return this.width;
    });
    this.__defineGetter__("Height", function()
    {
        return this.height;
    });
    this.__defineGetter__("Dimension", function()
    {
        if (this.width != this.height)
        {
            throw "Can't call getDimension() on a non-square matrix";
        }
        return this.width;
    });

    this.get_Renamed=function( x,  y)
        {
            var offset = y * this.rowSize + (x >> 5);
            return ((URShift(this.bits[offset], (x & 0x1f))) & 1) != 0;
        }
    this.set_Renamed=function( x,  y)
        {
            var offset = y * this.rowSize + (x >> 5);
            this.bits[offset] |= 1 << (x & 0x1f);
        }
    this.flip=function( x,  y)
        {
            var offset = y * this.rowSize + (x >> 5);
            this.bits[offset] ^= 1 << (x & 0x1f);
        }
    this.clear=function()
        {
            var max = this.bits.length;
            for (var i = 0; i < max; i++)
            {
                this.bits[i] = 0;
            }
        }
    this.setRegion=function( left,  top,  width,  height)
        {
            if (top < 0 || left < 0)
            {
                throw "Left and top must be nonnegative";
            }
            if (height < 1 || width < 1)
            {
                throw "Height and width must be at least 1";
            }
            var right = left + width;
            var bottom = top + height;
            if (bottom > this.height || right > this.width)
            {
                throw "The region must fit inside the matrix";
            }
            for (var y = top; y < bottom; y++)
            {
                var offset = y * this.rowSize;
                for (var x = left; x < right; x++)
                {
                    this.bits[offset + (x >> 5)] |= 1 << (x & 0x1f);
                }
            }
        }
}/*
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


function GF256( primitive)
{
    this.expTable = new Uint8Array(256);
    this.logTable = new Uint8Array(256);
    var x = 1
    var i = 0
    do{
        this.expTable[i] = x;
        this.logTable[x] = i;
        i++
        x <<= 1; // x = x * 2; we're assuming the generator alpha is 2
        //tmp = (x - 0x100)>>>31                      // <<-------------------------------------------------------------------
        //x = (x * tmp) | ((x ^ primitive) * (tmp^1)) // avoids a branch but is it faster than the branch - fix me Investigate
        if (x >= 256) {
            x = (x^primitive) &255 // this is how it is in the mainline zxing code but different than js port - fix me Investigate

        }
    
    }while(i<256)
    



    this.zero = new GF256Poly(this, GF256.zeroArr);
    this.one = new GF256Poly(this, GF256.oneArr);
    // fix me downstream code is looking data with this name
    this.Zero = this.zero
    this.One = this.one
    /////

    
    this.buildMonomial=function( degree,  coefficient)
        {
            if (degree < 0)
            {
                throw "System.ArgumentException";
            }
            if (coefficient == 0)
            {
                return zero;
            }
            var coefficients = new Array(degree + 1);
            for(var i=0;i<coefficients.length;i++)coefficients[i]=0;
            coefficients[0] = coefficient;
            return new GF256Poly(this, coefficients);
        }
    this.exp=function( a)
        {
            return this.expTable[a];
        }
    this.log=function( a)
        {
            if (a == 0)
            {
                throw "System.ArgumentException";
            }
            return this.logTable[a];
        }
    this.inverse=function( a)
        {
            if (a == 0)
            {
                throw "System.ArithmeticException";
            }
            return this.expTable[255 - this.logTable[a]];
        }
    this.multiply=function( a,  b)
        {
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
            return this.expTable[(this.logTable[a] + this.logTable[b]) % 255];
        }        
}
GF256.zeroArr = new Uint8Array([0])
GF256.oneArr = new Uint8Array([1])


GF256.QR_CODE_FIELD = new GF256(0x011D);
GF256.DATA_MATRIX_FIELD = new GF256(0x012D);

GF256.addOrSubtract=function( a,  b)
{
    return a ^ b;
}

function DataBlock(numDataCodewords,  numBlockCodewords){

    this.field = GF256.QR_CODE_FIELD 
    this.numDataCodewords = numDataCodewords
    this.codewords = new Uint8Array(numBlockCodewords)
    this.numECCodewords = numBlockCodewords - numDataCodewords
    this.numBlockCodewordsMinusOne = numBlockCodewords-1
}

DataBlock.prototype = {
    check:function(){
        var poly = new GF256Poly(this.field, this.codewords);
        var twoS = this.numECCodewords
        var i = 0
        do{if(poly.evaluateAt(this.field.exp(i++)) != 0) throw "Bad Scan Uncorrectable block" }while(i<twoS)
    },
    correct:function(){
            var poly = new GF256Poly(this.field, this.codewords)
            var twoS = this.numECCodewords
            var towSMinusOne = twoS-1
            var syndromeCoefficients = new Uint8Array(twoS)
            var numBlockCodewordsMinusOne = this.numBlockCodewordsMinusOne
            var noError = true
            var _eval
            var i = 0
            do{
                // Thanks to sanfordsquires for this fix:
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
                _new = org ^ errorMagnitudes[i]
                hamming+= numBitsDiffering(_new,org)
                 this.codewords[position] = _new
                i++
                
            }while(i<l)
            console.log(hamming +  'bits different')
            this.check()
    },

    runEuclideanAlgorithm:function( a,  b,  R){
        // Assume a's degree is >= b's
        var temp
        if (a.Degree < b.Degree)
        {
            temp = a;
            a = b;
            b = temp;
        }

        var rLast = a;
        var r = b;
        var sLast = this.field.One;
        var s = this.field.Zero;
        var tLast = this.field.Zero;
        var t = this.field.One;
        var rDiv2 = R*0.5|0
        // Run Euclidean algorithm until r's degree is less than R/2
        while (r.Degree >=rDiv2)
        {
            var rLastLast = rLast;
            var sLastLast = sLast;
            var tLastLast = tLast;
            rLast = r;
            sLast = s;
            tLast = t;

            // Divide rLastLast by rLast, with quotient in q and remainder in r
            if (rLast.Zero)
            {
                // Oops, Euclidean algorithm already terminated?
                throw "r_{i-1} was zero";
            }
            r = rLastLast;
            var q = this.field.Zero;
            var denominatorLeadingTerm = rLast.getCoefficient(rLast.Degree);
            var dltInverse = this.field.inverse(denominatorLeadingTerm);
            while (r.Degree >= rLast.Degree && !r.Zero)
            {
                var degreeDiff = r.Degree - rLast.Degree;
                var scale = this.field.multiply(r.getCoefficient(r.Degree), dltInverse);
                q = q.addOrSubtract(this.field.buildMonomial(degreeDiff, scale));
                r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale));
            }

            s = q.multiply1(sLast).addOrSubtract(sLastLast);
            t = q.multiply1(tLast).addOrSubtract(tLastLast);
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
        var numErrors = errorLocator.Degree;
        if (numErrors == 1)
        {
            // shortcut
            return new Array(errorLocator.getCoefficient(1));
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
                        denominator = this.field.multiply(denominator, 1 ^ this.field.multiply(errorLocations[j], xiInverse));
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
    var ecBlockArray = ecBlocks.getECBlocks();
    var l = ecBlockArray.length
    var i = 0
    do{
        
    }while(i<l)
    for (var i = 0; i < ecBlockArray.length; i++)
    {
        totalBlocks += ecBlockArray[i].Count;
    }

    // Now establish DataBlocks of the appropriate size and number of data codewords
    var result = new Array();
    
    var numResultBlocks = 0;
    for (var j = 0; j < ecBlockArray.length; j++)
    {
        var ecBlock = ecBlockArray[j];
        for (var i = 0; i < ecBlock.Count; i++)
        {
            var numDataCodewords = ecBlock.DataCodewords;
            var numBlockCodewords = ecBlocks.ECCodewordsPerBlock + numDataCodewords;
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

    var shorterBlocksNumDataCodewords = shorterBlocksTotalCodewords - ecBlocks.ECCodewordsPerBlock;
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

    if (rawCodewords.length != version.TotalCodewords)
    {
        throw "ArgumentException"; // fix me can this happen -- investigate 
    }

    // Figure out the number and size of data blocks used by this version and
    // error correction level
    var ecBlocks = version.getECBlocksForLevel(ecLevel)

    // First count the total number of data blocks

    var ecBlockArray = ecBlocks.getECBlocks()


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
            numBlockCodewords = ecBlocks.ECCodewordsPerBlock + numDataCodewords;
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

    var shorterBlocksNumDataCodewords = shorterBlocksTotalCodewords - ecBlocks.ECCodewordsPerBlock;
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


function BitMatrixParser(bitMatrix)
{
    var dimension = bitMatrix.Dimension;
    if (dimension < 21 || (dimension & 0x03) != 1)
    {
        throw "Error BitMatrixParser";
    }
    this.bitMatrix = bitMatrix;
    this.parsedVersion = null;
    this.parsedFormatInfo = null;

    this.copyBit=function( i,  j,  versionBits)
    {
        return this.bitMatrix.get_Renamed(i, j)?(versionBits << 1) | 0x1:versionBits << 1;
    }

    this.readFormatInformation=function()
    {
            if (this.parsedFormatInfo != null)
            {
                return this.parsedFormatInfo;
            }

            // Read top-left format info bits
            var formatInfoBits = 0;
            for (var i = 0; i < 6; i++)
            {
                formatInfoBits = this.copyBit(i, 8, formatInfoBits);
            }
            // .. and skip a bit in the timing pattern ...
            formatInfoBits = this.copyBit(7, 8, formatInfoBits);
            formatInfoBits = this.copyBit(8, 8, formatInfoBits);
            formatInfoBits = this.copyBit(8, 7, formatInfoBits);
            // .. and skip a bit in the timing pattern ...
            for (var j = 5; j >= 0; j--)
            {
                formatInfoBits = this.copyBit(8, j, formatInfoBits);
            }

            this.parsedFormatInfo = FormatInformation.decodeFormatInformation(formatInfoBits);
            if (this.parsedFormatInfo != null)
            {
                return this.parsedFormatInfo;
            }

            // Hmm, failed. Try the top-right/bottom-left pattern
            var dimension = this.bitMatrix.Dimension;
            formatInfoBits = 0;
            var iMin = dimension - 8;
            for (var i = dimension - 1; i >= iMin; i--)
            {
                formatInfoBits = this.copyBit(i, 8, formatInfoBits);
            }
            for (var j = dimension - 7; j < dimension; j++)
            {
                formatInfoBits = this.copyBit(8, j, formatInfoBits);
            }

            this.parsedFormatInfo = FormatInformation.decodeFormatInformation(formatInfoBits);
            if (this.parsedFormatInfo != null)
            {
                return this.parsedFormatInfo;
            }
            throw "Error readFormatInformation";    
    }
    this.readVersion=function()
        {

            if (this.parsedVersion != null)
            {
                return this.parsedVersion;
            }

            var dimension = this.bitMatrix.Dimension;

            var provisionalVersion = (dimension - 17) >> 2;
            if (provisionalVersion <= 6)
            {
                return Version.getVersionForNumber(provisionalVersion);
            }

            // Read top-right version info: 3 wide by 6 tall
            var versionBits = 0;
            var ijMin = dimension - 11;
            for (var j = 5; j >= 0; j--)
            {
                for (var i = dimension - 9; i >= ijMin; i--)
                {
                    versionBits = this.copyBit(i, j, versionBits);
                }
            }

            this.parsedVersion = Version.decodeVersionInformation(versionBits);
            if (this.parsedVersion != null && this.parsedVersion.DimensionForVersion == dimension)
            {
                return this.parsedVersion;
            }

            // Hmm, failed. Try bottom left: 6 wide by 3 tall
            versionBits = 0;
            for (var i = 5; i >= 0; i--)
            {
                for (var j = dimension - 9; j >= ijMin; j--)
                {
                    versionBits = this.copyBit(i, j, versionBits);
                }
            }

            this.parsedVersion = Version.decodeVersionInformation(versionBits);
            if (this.parsedVersion != null && this.parsedVersion.DimensionForVersion == dimension)
            {
                return this.parsedVersion;
            }
            throw "Error readVersion";
        }
    this.readCodewords=function()
        {

            var formatInfo = this.readFormatInformation();
            var version = this.readVersion();

            // Get the data mask for the format used in this QR Code. This will exclude
            // some bits from reading as we wind through the bit matrix.
            var dataMask = DataMask.forReference( formatInfo.DataMask);
            var dimension = this.bitMatrix.Dimension;
            dataMask.unmaskBitMatrix(this.bitMatrix, dimension);

            var functionPattern = version.buildFunctionPattern();

            var readingUp = true;
            var result = new Array(version.TotalCodewords);
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
                            currentByte <<= 1;
                            if (this.bitMatrix.get_Renamed(j - col, i))
                            {
                                currentByte |= 1;
                            }
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
                readingUp ^= true; // readingUp = !readingUp; // switch directions
            }
            if (resultOffset != version.TotalCodewords)
            {
                throw "Error readCodewords";
            }
            return result;
        }
}/*
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


DataMask = {};

DataMask.forReference = function(reference)
{
    if (reference < 0 || reference > 7)
    {
        throw "System.ArgumentException";
    }
    return DataMask.DATA_MASKS[reference];
}

function DataMask000()
{
    this.unmaskBitMatrix=function(bits,  dimension)
    {
        for (var i = 0; i < dimension; i++)
        {
            for (var j = 0; j < dimension; j++)
            {
                if (this.isMasked(i, j))
                {
                    bits.flip(j, i);
                }
            }
        }
    }
    this.isMasked=function( i,  j)
    {
        return ((i + j) & 0x01) == 0;
    }
}

function DataMask001()
{
    this.unmaskBitMatrix=function(bits,  dimension)
    {
        for (var i = 0; i < dimension; i++)
        {
            for (var j = 0; j < dimension; j++)
            {
                if (this.isMasked(i, j))
                {
                    bits.flip(j, i);
                }
            }
        }
    }
    this.isMasked=function( i,  j)
    {
        return (i & 0x01) == 0;
    }
}

function DataMask010()
{
    this.unmaskBitMatrix=function(bits,  dimension)
    {
        for (var i = 0; i < dimension; i++)
        {
            for (var j = 0; j < dimension; j++)
            {
                if (this.isMasked(i, j))
                {
                    bits.flip(j, i);
                }
            }
        }
    }
    this.isMasked=function( i,  j)
    {
        return j % 3 == 0;
    }
}

function DataMask011()
{
    this.unmaskBitMatrix=function(bits,  dimension)
    {
        for (var i = 0; i < dimension; i++)
        {
            for (var j = 0; j < dimension; j++)
            {
                if (this.isMasked(i, j))
                {
                    bits.flip(j, i);
                }
            }
        }
    }
    this.isMasked=function( i,  j)
    {
        return (i + j) % 3 == 0;
    }
}

function DataMask100()
{
    this.unmaskBitMatrix=function(bits,  dimension)
    {
        for (var i = 0; i < dimension; i++)
        {
            for (var j = 0; j < dimension; j++)
            {
                if (this.isMasked(i, j))
                {
                    bits.flip(j, i);
                }
            }
        }
    }
    this.isMasked=function( i,  j)
    {
        return (((URShift(i, 1)) + (j / 3)) & 0x01) == 0;
    }
}

function DataMask101()
{
    this.unmaskBitMatrix=function(bits,  dimension)
    {
        for (var i = 0; i < dimension; i++)
        {
            for (var j = 0; j < dimension; j++)
            {
                if (this.isMasked(i, j))
                {
                    bits.flip(j, i);
                }
            }
        }
    }
    this.isMasked=function( i,  j)
    {
        var temp = i * j;
        return (temp & 0x01) + (temp % 3) == 0;
    }
}

function DataMask110()
{
    this.unmaskBitMatrix=function(bits,  dimension)
    {
        for (var i = 0; i < dimension; i++)
        {
            for (var j = 0; j < dimension; j++)
            {
                if (this.isMasked(i, j))
                {
                    bits.flip(j, i);
                }
            }
        }
    }
    this.isMasked=function( i,  j)
    {
        var temp = i * j;
        return (((temp & 0x01) + (temp % 3)) & 0x01) == 0;
    }
}
function DataMask111()
{
    this.unmaskBitMatrix=function(bits,  dimension)
    {
        for (var i = 0; i < dimension; i++)
        {
            for (var j = 0; j < dimension; j++)
            {
                if (this.isMasked(i, j))
                {
                    bits.flip(j, i);
                }
            }
        }
    }
    this.isMasked=function( i,  j)
    {
        return ((((i + j) & 0x01) + ((i * j) % 3)) & 0x01) == 0;
    }
}

DataMask.DATA_MASKS = new Array(new DataMask000(), new DataMask001(), new DataMask010(), new DataMask011(), new DataMask100(), new DataMask101(), new DataMask110(), new DataMask111());

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


function ReedSolomonDecoder(field)
{
    this.field = field;
    this.hammered = 0
    this.changed = 0
    this.avg = 0
    this.decode=function(received,  twoS)
    {
            var poly = new GF256Poly(this.field, received);
            var syndromeCoefficients = new Array(twoS);
            for(var i=0;i<syndromeCoefficients.length;i++)syndromeCoefficients[i]=0;
            var dataMatrix = false;//this.field.Equals(GF256.DATA_MATRIX_FIELD);
            var noError = true;
            for (var i = 0; i < twoS; i++)
            {
                // Thanks to sanfordsquires for this fix:
                var eval = poly.evaluateAt(this.field.exp(dataMatrix?i + 1:i));
                syndromeCoefficients[syndromeCoefficients.length - 1 - i] = eval;
                if (eval != 0)
                {
                    noError = false;
                }
            }
            if (noError)
            {
                return ;
            }
            var syndrome = new GF256Poly(this.field, syndromeCoefficients);
            var sigmaOmega = this.runEuclideanAlgorithm(this.field.buildMonomial(twoS, 1), syndrome, twoS);
            var sigma = sigmaOmega[0];
            var omega = sigmaOmega[1];
            var errorLocations = this.findErrorLocations(sigma);
            var errorMagnitudes = this.findErrorMagnitudes(omega, errorLocations, dataMatrix);
            var org,_new
            var diff
            for (var i = 0; i < errorLocations.length; i++)
            {
                var position = received.length - 1 - this.field.log(errorLocations[i]);
                if (position < 0)
                {
                    // fix me can this happen -- investigate
                    throw "ReedSolomonException Bad error location";
                }
                org = received[position]
                _new = org ^ errorMagnitudes[i]
                diff = numBitsDiffering(org,_new)
                if(diff >0){
                    this.changed++ 
                }
                //this.changed += (-diff)>>>31 // this avoids a branch but is it faster fix me - investigate 
                this.hammered += diff // fix me we know we are working with a mear byte so we can use a numBitsDiffering that won't correct for oversized numbers
                received[position] = _new
            }
            this.avg = this.hammered/this.changed
    }

    this.runEuclideanAlgorithm=function( a,  b,  R)
        {
            // Assume a's degree is >= b's
            if (a.Degree < b.Degree)
            {
                var temp = a;
                a = b;
                b = temp;
            }

            var rLast = a;
            var r = b;
            var sLast = this.field.One;
            var s = this.field.Zero;
            var tLast = this.field.Zero;
            var t = this.field.One;

            // Run Euclidean algorithm until r's degree is less than R/2
            while (r.Degree >= Math.floor(R / 2))
            {
                var rLastLast = rLast;
                var sLastLast = sLast;
                var tLastLast = tLast;
                rLast = r;
                sLast = s;
                tLast = t;

                // Divide rLastLast by rLast, with quotient in q and remainder in r
                if (rLast.Zero)
                {
                    // Oops, Euclidean algorithm already terminated?
                    throw "r_{i-1} was zero";
                }
                r = rLastLast;
                var q = this.field.Zero;
                var denominatorLeadingTerm = rLast.getCoefficient(rLast.Degree);
                var dltInverse = this.field.inverse(denominatorLeadingTerm);
                while (r.Degree >= rLast.Degree && !r.Zero)
                {
                    var degreeDiff = r.Degree - rLast.Degree;
                    var scale = this.field.multiply(r.getCoefficient(r.Degree), dltInverse);
                    q = q.addOrSubtract(this.field.buildMonomial(degreeDiff, scale));
                    r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale));
                    //r.EXE();
                }

                s = q.multiply1(sLast).addOrSubtract(sLastLast);
                t = q.multiply1(tLast).addOrSubtract(tLastLast);
            }

            var sigmaTildeAtZero = t.getCoefficient(0);
            if (sigmaTildeAtZero == 0)
            {
                throw "ReedSolomonException sigmaTilde(0) was zero";
            }

            var inverse = this.field.inverse(sigmaTildeAtZero);
            var sigma = t.multiply2(inverse);
            var omega = r.multiply2(inverse);
            return new Array(sigma, omega);
        }
    this.findErrorLocations=function( errorLocator)
        {
            // This is a direct application of Chien's search
            var numErrors = errorLocator.Degree;
            if (numErrors == 1)
            {
                // shortcut
                return new Array(errorLocator.getCoefficient(1));
            }
            var result = new Array(numErrors);
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
        }
    this.findErrorMagnitudes=function( errorEvaluator,  errorLocations,  dataMatrix)
        {
            // This is directly applying Forney's Formula
            var s = errorLocations.length;
            var result = new Array(s);
            for (var i = 0; i < s; i++)
            {
                var xiInverse = this.field.inverse(errorLocations[i]);
                var denominator = 1;
                for (var j = 0; j < s; j++)
                {
                    if (i != j)
                    {
                        denominator = this.field.multiply(denominator, 1 ^ this.field.multiply(errorLocations[j], xiInverse));
                    }
                }
                result[i] = this.field.multiply(errorEvaluator.evaluateAt(xiInverse), this.field.inverse(denominator));
                // Thanks to sanfordsquires for this fix:
                if (dataMatrix)
                {
                    result[i] = this.field.multiply(result[i], xiInverse);
                }
            }
            return result;
        }
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


function GF256Poly(field,  coefficients)
{
    if (coefficients == null || coefficients.length == 0)
    {
        throw "System.ArgumentException";
    }
    this.field = field;
    var coefficientsLength = coefficients.length;
    if (coefficientsLength > 1 && coefficients[0] == 0)
    {
        // Leading term must be non-zero for anything except the constant polynomial "0"
        var firstNonZero = 1;
        while (firstNonZero < coefficientsLength && coefficients[firstNonZero] == 0)
        {
            firstNonZero++;
        }
        if (firstNonZero == coefficientsLength)
        {
            this.coefficients = field.Zero.coefficients;
        }
        else
        {
            this.coefficients = new Array(coefficientsLength - firstNonZero);
            for(var i=0;i<this.coefficients.length;i++)this.coefficients[i]=0;
            //Array.Copy(coefficients, firstNonZero, this.coefficients, 0, this.coefficients.length);
            for(var ci=0;ci<this.coefficients.length;ci++)this.coefficients[ci]=coefficients[firstNonZero+ci];
        }
    }
    else
    {
        this.coefficients = coefficients;
    }

    this.__defineGetter__("Zero", function()
    {
        return this.coefficients[0] == 0;
    });
    this.__defineGetter__("Degree", function()
    {
        return this.coefficients.length - 1;
    });
    this.__defineGetter__("Coefficients", function()
    {
        return this.coefficients;
    });

    this.getCoefficient=function( degree)
    {
        return this.coefficients[this.coefficients.length - 1 - degree];
    }

    this.evaluateAt=function( a)
    {
        if (a == 0)
        {
            // Just return the x^0 coefficient
            return this.getCoefficient(0);
        }
        var size = this.coefficients.length;
        if (a == 1)
        {
            // Just the sum of the coefficients
            var result = 0;
            for (var i = 0; i < size; i++)
            {
                result = result ^ this.coefficients[i]
            }
            return result;
        }
        var result2 = this.coefficients[0];
        for (var i = 1; i < size; i++)
        {
            result2 = this.field.multiply(a, result2) ^ this.coefficients[i]
        }
        return result2;
    }

    this.addOrSubtract=function( other)
        {
            if (this.field != other.field)
            {
                throw "GF256Polys do not have same GF256 field";
            }
            if (this.Zero)
            {
                return other;
            }
            if (other.Zero)
            {
                return this;
            }

            var smallerCoefficients = this.coefficients;
            var largerCoefficients = other.coefficients;
            if (smallerCoefficients.length > largerCoefficients.length)
            {
                var temp = smallerCoefficients;
                smallerCoefficients = largerCoefficients;
                largerCoefficients = temp;
            }
            var sumDiff = new Array(largerCoefficients.length);
            var lengthDiff = largerCoefficients.length - smallerCoefficients.length;
            // Copy high-order terms only found in higher-degree polynomial's coefficients
            //Array.Copy(largerCoefficients, 0, sumDiff, 0, lengthDiff);
            for(var ci=0;ci<lengthDiff;ci++)sumDiff[ci]=largerCoefficients[ci];

            for (var i = lengthDiff; i < largerCoefficients.length; i++)
            {
                sumDiff[i] = smallerCoefficients[i - lengthDiff] ^ largerCoefficients[i];
            }

            return new GF256Poly(field, sumDiff);
    }
    this.multiply1=function( other)
        {
            if (this.field!=other.field)
            {
                throw "GF256Polys do not have same GF256 field";
            }
            if (this.Zero || other.Zero)
            {
                return this.field.Zero;
            }
            var aCoefficients = this.coefficients;
            var aLength = aCoefficients.length;
            var bCoefficients = other.coefficients;
            var bLength = bCoefficients.length;
            var product = new Array(aLength + bLength - 1);
            for (var i = 0; i < aLength; i++)
            {
                var aCoeff = aCoefficients[i];
                for (var j = 0; j < bLength; j++)
                {
                    product[i + j] = product[i + j] ^ this.field.multiply(aCoeff, bCoefficients[j])
                }
            }
            return new GF256Poly(this.field, product);
        }
    this.multiply2=function( scalar)
        {
            if (scalar == 0)
            {
                return this.field.Zero;
            }
            if (scalar == 1)
            {
                return this;
            }
            var size = this.coefficients.length;
            var product = new Array(size);
            for (var i = 0; i < size; i++)
            {
                product[i] = this.field.multiply(this.coefficients[i], scalar);
            }
            return new GF256Poly(this.field, product);
        }
    this.multiplyByMonomial=function( degree,  coefficient)
        {
            if (degree < 0)
            {
                throw "System.ArgumentException";
            }
            if (coefficient == 0)
            {
                return this.field.Zero;
            }
            var size = this.coefficients.length;
            var product = new Array(size + degree);
            for(var i=0;i<product.length;i++)product[i]=0;
            for (var i = 0; i < size; i++)
            {
                product[i] = this.field.multiply(this.coefficients[i], coefficient);
            }
            return new GF256Poly(this.field, product);
        }
    this.divide=function( other)
        {
            if (this.field!=other.field)
            {
                throw "GF256Polys do not have same GF256 field";
            }
            if (other.Zero)
            {
                throw "Divide by 0";
            }

            var quotient = this.field.Zero;
            var remainder = this;

            var denominatorLeadingTerm = other.getCoefficient(other.Degree);
            var inverseDenominatorLeadingTerm = this.field.inverse(denominatorLeadingTerm);

            while (remainder.Degree >= other.Degree && !remainder.Zero)
            {
                var degreeDifference = remainder.Degree - other.Degree;
                var scale = this.field.multiply(remainder.getCoefficient(remainder.Degree), inverseDenominatorLeadingTerm);
                var term = other.multiplyByMonomial(degreeDifference, scale);
                var iterationQuotient = this.field.buildMonomial(degreeDifference, scale);
                quotient = quotient.addOrSubtract(iterationQuotient);
                remainder = remainder.addOrSubtract(term);
            }

            return new Array(quotient, remainder);
        }
}/*
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


function Decoder(bits){
    var parser = new BitMatrixParser(bits);
    var version = parser.readVersion();
    var ecLevel = parser.readFormatInformation().ErrorCorrectionLevel;

    // Read codewords
    var codewords = parser.readCodewords();

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
    this.hammred = 0
    this.changed = 0
    this.versionNumber = version.VersionNumber
    this.ecBits = ecLevel.Bits
    this.totalBytes = totalBytes
    this.dataBlocks = dataBlocks
    this.resultBytes = new Array(totalBytes);
    
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
            //this.correctErrors(codewordBytes, numDataCodewords)
            i2=0
            do{this.resultBytes[resultOffset++] = codewordBytes[i2++]}while(i2<numDataCodewords)
        }while(i<l)
        console.log((this.hammred/(this.totalBytes*8*0.01)) + '% of ' + (this.totalBytes * 8) + ' corrected')
        console.log((this.changed/(this.totalBytes*0.01)) + '% of ' + (this.totalBytes) + ' bytes corrected')
        /*if((this.hammred/(this.totalBytes*8*0.01)) >= 3){
            throw 'over 3% of bits changed bad scan'
        }*/
        
        return  new QRCodeDataBlockReader(this.resultBytes, this.versionNumber, this.ecBits);

    },
    correctErrors:function(codewordBytes, numDataCodewords){
        var numCodewords = codewordBytes.length;
        var numECCodewords = numCodewords - numDataCodewords;
        var i
        // First read into an array of ints 
        var codewordsInts = new Array(numCodewords);
        i=0
        do{
            codewordsInts[i] = codewordBytes[i] 
            i++
        }while(i<numCodewords) // fix me why would we need to mask a byte to fit into a byte 
        var rsDecoder 
        rsDecoder =  new ReedSolomonDecoder(GF256.QR_CODE_FIELD)
            
        rsDecoder.decode(codewordsInts, numECCodewords)
        console.log('bytes changed ' + rsDecoder.changed + ' ' + rsDecoder.changed/(codewordBytes.length*0.01) + '% out of ' + codewordBytes.length  )
        rsDecoder =  new ReedSolomonDecoder(GF256.QR_CODE_FIELD)
        rsDecoder.decode(codewordsInts, numECCodewords)
        console.log('bytes changed ' + rsDecoder.changed + ' ' + rsDecoder.changed/(codewordBytes.length*0.01) + '% out of ' + codewordBytes.length  )
        // Fail if corrected data has errors when decoded a 2nd time  
        if(rsDecoder.changed >0){
            throw "scan uncorrectable "
        }
        
        /*if(rsDecoder.changed/(codewordBytes.length*0.01) > 7.0){
            throw "over 7 % of bytes changed bad scan"
        }*/
        this.changed += rsDecoder.changed

        /*if(rsDecoder.hammered/(codewordBytes.length*8*0.01) > 1.0){
            throw "Corrected bits over 1% this code is bad"
        }*/

        this.hammred += rsDecoder.hammered
        i = 0
        do{codewordBytes[i] = codewordsInts[i];i++}while(i<numCodewords) // fix me why would we need to mask a byte to fit into a byte 
    },
    
    
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
                var denominator = a13 * x + a23 * y + a33;
                points[i] = (a11 * x + a21 * y + a31) / denominator;
                points[i + 1] = (a12 * x + a22 * y + a32) / denominator;
            }
        }
    this. transformPoints2=function(xValues, yValues)
        {
            var n = xValues.length;
            for (var i = 0; i < n; i++)
            {
                var x = xValues[i];
                var y = yValues[i];
                var denominator = this.a13 * x + this.a23 * y + this.a33;
                xValues[i] = (this.a11 * x + this.a21 * y + this.a31) / denominator;
                yValues[i] = (this.a12 * x + this.a22 * y + this.a32) / denominator;
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
     dy2 = y3 - y2;
     dy3 = y0 - y1 + y2 - y3;
    if (dy2 == 0.0 && dy3 == 0.0)
    {
        return new PerspectiveTransform(x1 - x0, x2 - x1, x0, y1 - y0, y2 - y1, y0, 0.0, 0.0, 1.0);
    }
    else
    {
         dx1 = x1 - x2;
         dx2 = x3 - x2;
         dx3 = x0 - x1 + x2 - x3;
         dy1 = y1 - y2;
         denominator = dx1 * dy2 - dx2 * dy1;
         a13 = (dx3 * dy2 - dx2 * dy3) / denominator;
         a23 = (dx1 * dy3 - dx3 * dy1) / denominator;
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
            var moduleSizeEst1 = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor( pattern.X), Math.floor( pattern.Y), Math.floor( otherPattern.X), Math.floor(otherPattern.Y));
            var moduleSizeEst2 = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(otherPattern.X), Math.floor(otherPattern.Y), Math.floor( pattern.X), Math.floor(pattern.Y));
            if (isNaN(moduleSizeEst1))
            {
                return moduleSizeEst2 / 7.0;
            }
            if (isNaN(moduleSizeEst2))
            {
                return moduleSizeEst1 / 7.0;
            }
            // Average them, and divide by 7 since we've counted the width of 3 black modules,
            // and 1 white and 1 black module on either side. Ergo, divide sum by 14.
            return (moduleSizeEst1 + moduleSizeEst2) / 14.0;
        }


    this.calculateModuleSize=function( topLeft,  topRight,  bottomLeft)
        {
            // Take the average
            return (this.calculateModuleSizeOneWay(topLeft, topRight) + this.calculateModuleSizeOneWay(topLeft, bottomLeft)) / 2.0;
        }

    this.distance=function( pattern1,  pattern2)
    {
        xDiff = pattern1.X - pattern2.X;
        yDiff = pattern1.Y - pattern2.Y;
        return  Math.sqrt( (xDiff * xDiff + yDiff * yDiff));
    }
    this.computeDimension=function( topLeft,  topRight,  bottomLeft,  moduleSize)
        {

            var tltrCentersDimension = Math.round(this.distance(topLeft, topRight) / moduleSize);
            var tlblCentersDimension = Math.round(this.distance(topLeft, bottomLeft) / moduleSize);
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
                throw "Error";
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

            var topLeft = info.TopLeft;
            var topRight = info.TopRight;
            var bottomLeft = info.BottomLeft;

            var moduleSize = this.calculateModuleSize(topLeft, topRight, bottomLeft);
            if (moduleSize < 1.0)
            {
                throw "Error";
            }
            var dimension = this.computeDimension(topLeft, topRight, bottomLeft, moduleSize);
            var provisionalVersion = Version.getProvisionalVersionForDimension(dimension);
            var modulesBetweenFPCenters = provisionalVersion.DimensionForVersion - 7;

            var alignmentPattern = null;
            // Anything above version 1 has an alignment pattern
            if (provisionalVersion.AlignmentPatternCenters.length > 0)
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
                for (var i = 4; i <= 16; i <<= 1)
                {
                    //try
                    //{
                        alignmentPattern = this.findAlignmentInRegion(moduleSize, estAlignmentX, estAlignmentY,  i);
                        break;
                    //}
                    //catch (re)
                    //{
                        // try next round
                    //}
                }
                // If we didn't find alignment pattern... well try anyway without it
            }

            var transform = this.createTransform(topLeft, topRight, bottomLeft, alignmentPattern, dimension);

            var bits = this.sampleGrid(this.image, transform, dimension);

            var points;
            if (alignmentPattern == null)
            {
                points = new Array(bottomLeft, topLeft, topRight);
            }
            else
            {
                points = new Array(bottomLeft, topLeft, topRight, alignmentPattern);
            }
            return new DetectorResult(bits, points);
        }



    this.detect=function()
    {
        var info =  new FinderPatternFinder().findFinderPattern(this.image);

        return this.processFinderPatternInfo(info); 
    }
}

/*
   Copyright 2011 Lazar Laszlo (lazarsoft@gmail.com, www.lazarsoft.info)
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/


qrcode = {};

qrcode.width = 0;
qrcode.height = 0;
qrcode.qrCodeSymbol = null;
qrcode.debug = false;
qrcode.maxImgSize = 1024*1024;

qrcode.sizeOfDataLengthInfo =  [  [ 10, 9, 8, 8 ],  [ 12, 11, 16, 10 ],  [ 14, 13, 16, 12 ] ];



qrcode.isUrl = function(s)
{
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}

qrcode.decode_url = function (s)
{
  var escaped = "";
  try{
    escaped = escape( s );
  }
  catch(e)
  {
    console.log(e);
    escaped = s;
  }
  var ret = "";
  try{
    ret = decodeURIComponent( escaped );
  }
  catch(e)
  {
    console.log(e);
    ret = escaped;
  }
  return ret;
}

qrcode.decode_utf8 = function ( s )
{
    if(qrcode.isUrl(s))
        return qrcode.decode_url(s);
    else
        return s;
}
qrcode.process = function(image,w,h){


        qrcode.width = w
        qrcode.height = h
        //var image = qrcode.grayScaleToBitmap(qrcode.grayscale(buff));

       
        
        

        var decoder = new Decoder( (new Detector(image)).detect().bits )
        
       
        
        var reader = decoder.decode();
        var data = reader.DataByte;
        var str="";
        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<data[i].length;j++)
                str+=String.fromCharCode(data[i][j]);
        }
        


        
        return qrcode.decode_utf8(str);
        //alert("Time:" + time + " Code: "+str);
    
   
}







function URShift( number,  bits)
{
    if (number >= 0)
        return number >> bits;
    else
        return (number >> bits) + (2 << ~bits);
}


Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
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


var MIN_SKIP = 3;
var MAX_MODULES = 57;
var INTEGER_MATH_SHIFT = 8;
var CENTER_QUORUM = 2;

qrcode.orderBestPatterns=function(patterns)
        {

            function distance( pattern1,  pattern2)
            {
                xDiff = pattern1.X - pattern2.X;
                yDiff = pattern1.Y - pattern2.Y;
                return  Math.sqrt( (xDiff * xDiff + yDiff * yDiff));
            }

            /// <summary> Returns the z component of the cross product between vectors BC and BA.</summary>
            function crossProductZ( pointA,  pointB,  pointC)
            {
                var bX = pointB.x;
                var bY = pointB.y;
                return ((pointC.x - bX) * (pointA.y - bY)) - ((pointC.y - bY) * (pointA.x - bX));
            }


            // Find distances between pattern centers
            var zeroOneDistance = distance(patterns[0], patterns[1]);
            var oneTwoDistance = distance(patterns[1], patterns[2]);
            var zeroTwoDistance = distance(patterns[0], patterns[2]);

            var pointA, pointB, pointC;
            // Assume one closest to other two is B; A and C will just be guesses at first
            if (oneTwoDistance >= zeroOneDistance && oneTwoDistance >= zeroTwoDistance)
            {
                pointB = patterns[0];
                pointA = patterns[1];
                pointC = patterns[2];
            }
            else if (zeroTwoDistance >= oneTwoDistance && zeroTwoDistance >= zeroOneDistance)
            {
                pointB = patterns[1];
                pointA = patterns[0];
                pointC = patterns[2];
            }
            else
            {
                pointB = patterns[2];
                pointA = patterns[0];
                pointC = patterns[1];
            }

            // Use cross product to figure out whether A and C are correct or flipped.
            // This asks whether BC x BA has a positive z component, which is the arrangement
            // we want for A, B, C. If it's negative, then we've got it flipped around and
            // should swap A and C.
            if (crossProductZ(pointA, pointB, pointC) < 0.0)
            {
                var temp = pointA;
                pointA = pointC;
                pointC = temp;
            }

            patterns[0] = pointA;
            patterns[1] = pointB;
            patterns[2] = pointC;
        }


function FinderPattern(posX, posY,  estimatedModuleSize)
{
    this.x=posX;
    this.y=posY;
    this.count = 1;
    this.estimatedModuleSize = estimatedModuleSize;

    this.__defineGetter__("EstimatedModuleSize", function()
    {
        return this.estimatedModuleSize;
    }); 
    this.__defineGetter__("Count", function()
    {
        return this.count;
    });
    this.__defineGetter__("X", function()
    {
        return this.x;
    });
    this.__defineGetter__("Y", function()
    {
        return this.y;
    });
    this.incrementCount = function()
    {
        this.count++;
    }
    this.aboutEquals=function( moduleSize,  i,  j)
        {
            if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize)
            {
                var moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize);
                return moduleSizeDiff <= 1.0 || moduleSizeDiff / this.estimatedModuleSize <= 1.0;
            }
            return false;
        }

}

function FinderPatternInfo(patternCenters)
{
    this.bottomLeft = patternCenters[0];
    this.topLeft = patternCenters[1];
    this.topRight = patternCenters[2];
    this.__defineGetter__("BottomLeft", function()
    {
        return this.bottomLeft;
    }); 
    this.__defineGetter__("TopLeft", function()
    {
        return this.topLeft;
    }); 
    this.__defineGetter__("TopRight", function()
    {
        return this.topRight;
    }); 
}

function FinderPatternFinder()
{
    this.image=null;
    this.possibleCenters = [];
    this.hasSkipped = false;
    this.crossCheckStateCount = new Array(0,0,0,0,0);
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
            var moduleSize = Math.floor((totalModuleSize << INTEGER_MATH_SHIFT) / 7);
            var maxVariance = Math.floor(moduleSize / 2);
            // Allow less than 50% variance from 1-1-3-1-1 proportions
            return Math.abs(moduleSize - (stateCount[0] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[1] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(3 * moduleSize - (stateCount[2] << INTEGER_MATH_SHIFT)) < 3 * maxVariance && Math.abs(moduleSize - (stateCount[3] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[4] << INTEGER_MATH_SHIFT)) < maxVariance;
        }
    this.centerFromEnd=function( stateCount,  end)
        {
            return  (end - stateCount[4] - stateCount[3]) - stateCount[2] / 2.0;
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
                    var estimatedModuleSize =   stateCountTotal / 7.0;
                    var found = false;
                    var max = this.possibleCenters.length;
                    for (var index = 0; index < max; index++)
                    {
                        var center = this.possibleCenters[index];
                        // Look for about the same center and module size:
                        if (center.aboutEquals(estimatedModuleSize, centerI, centerJ))
                        {
                            center.incrementCount();
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                    {
                        var point = new FinderPattern(centerJ, centerI, estimatedModuleSize);
                        this.possibleCenters.push(point);
                        if (this.resultPointCallback != null)
                        {
                            this.resultPointCallback.foundPossibleResultPoint(point);
                        }
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
                    //totalModuleSize +=  this.possibleCenters[i].EstimatedModuleSize;
                    var    centerValue=this.possibleCenters[i].EstimatedModuleSize;
                    totalModuleSize += centerValue;
                    square += (centerValue * centerValue);
                }
                var average = totalModuleSize /  startSize;
                this.possibleCenters.sort(function(center1,center2) {
                      var dA=Math.abs(center2.EstimatedModuleSize - average);
                      var dB=Math.abs(center1.EstimatedModuleSize - average);
                      if (dA < dB) {
                          return (-1);
                      } else if (dA == dB) {
                          return 0;
                      } else {
                          return 1;
                      }
                    });

                var stdDev = Math.sqrt(square / startSize - average * average);
                var limit = Math.max(0.2 * average, stdDev);
                for (var i = 0; i < this.possibleCenters.length && this.possibleCenters.length > 3; i++)
                {
                    var pattern =  this.possibleCenters[i];
                    //if (Math.abs(pattern.EstimatedModuleSize - average) > 0.2 * average)
                    if (Math.abs(pattern.EstimatedModuleSize - average) > limit)
                    {
                        this.possibleCenters.remove(i);
                        i--;
                    }
                }
            }

            if (this.possibleCenters.length > 3)
            {
                // Throw away all but those first size candidate points we found.
                this.possibleCenters.sort(function(a, b){
                    if (a.count > b.count){return -1;}
                    if (a.count < b.count){return 1;}
                    return 0;
                });
            }

            return new Array( this.possibleCenters[0],  this.possibleCenters[1],  this.possibleCenters[2]);
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
                if (center.Count >= CENTER_QUORUM)
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
                        return Math.floor ((Math.abs(firstConfirmedCenter.X - center.X) - Math.abs(firstConfirmedCenter.Y - center.Y)) / 2);
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
                if (pattern.Count >= CENTER_QUORUM)
                {
                    confirmedCount++;
                    totalModuleSize += pattern.EstimatedModuleSize;
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
                totalDeviation += Math.abs(pattern.EstimatedModuleSize - average);
            }
            return totalDeviation <= 0.05 * totalModuleSize;
        }

    this.findFinderPattern = function(image){
        var tryHarder = false;
        this.image=image;
        var maxI = qrcode.height;
        var maxJ = qrcode.width;
        var iSkip = Math.floor((3 * maxI) / (4 * MAX_MODULES));
        if (iSkip < MIN_SKIP || tryHarder)
        {
                iSkip = MIN_SKIP;
        }

        var done = false;
        var stateCount = new Array(5);
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


function AlignmentPattern(posX, posY,  estimatedModuleSize)
{
    this.x=posX;
    this.y=posY;
    this.count = 1;
    this.estimatedModuleSize = estimatedModuleSize;

    this.__defineGetter__("EstimatedModuleSize", function()
    {
        return this.estimatedModuleSize;
    }); 
    this.__defineGetter__("Count", function()
    {
        return this.count;
    });
    this.__defineGetter__("X", function()
    {
        return Math.floor(this.x);
    });
    this.__defineGetter__("Y", function()
    {
        return Math.floor(this.y);
    });
    this.incrementCount = function()
    {
        this.count++;
    }
    this.aboutEquals=function( moduleSize,  i,  j)
        {
            if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize)
            {
                var moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize);
                return moduleSizeDiff <= 1.0 || moduleSizeDiff / this.estimatedModuleSize <= 1.0;
            }
            return false;
        }

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
    this.crossCheckStateCount = new Array(0,0,0);
    this.resultPointCallback = resultPointCallback;

    this.centerFromEnd=function(stateCount,  end)
        {
            return  (end - stateCount[2]) - stateCount[1] / 2.0;
        }
    this.foundPatternCross = function(stateCount)
        {
            var moduleSize = this.moduleSize;
            var maxVariance = moduleSize / 2.0;
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
            var centerI = this.crossCheckVertical(i, Math.floor (centerJ), 2 * stateCount[1], stateCountTotal);
            if (!isNaN(centerI))
            {
                var estimatedModuleSize = (stateCount[0] + stateCount[1] + stateCount[2]) / 3.0;
                var max = this.possibleCenters.length;
                for (var index = 0; index < max; index++)
                {
                    var center =  this.possibleCenters[index];
                    // Look for about the same center and module size:
                    if (center.aboutEquals(estimatedModuleSize, centerI, centerJ))
                    {
                        return new AlignmentPattern(centerJ, centerI, estimatedModuleSize);
                    }
                }
                // Hadn't found this before; save it
                var point = new AlignmentPattern(centerJ, centerI, estimatedModuleSize);
                this.possibleCenters.push(point);
                if (this.resultPointCallback != null)
                {
                    this.resultPointCallback.foundPossibleResultPoint(point);
                }
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
            var stateCount = new Array(0,0,0);
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

            throw "Couldn't find enough alignment patterns";
        }

}/*
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
                    var firstLetter = Math.floor(intData / 45);
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
                var higherByte = intData / 0xC0;

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

                //var tempByte = new Array(0,0);
                //tempByte[0] = (sbyte) (shiftjisWord >> 8);
                //tempByte[1] = (sbyte) (shiftjisWord & 0xFF);
                //unicodeString += new String(SystemUtils.ToCharArray(SystemUtils.ToByteArray(tempByte)));
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
    // this needs to be done in half’s as JavaScript will jam unsigned data into singed data making life hard
    // fix me - my reasoning for splitting in half is anecdotal is not sure if it is truly necessary
    var _a,c
    _a = (a>>>16) ^ (b>>>16) // now first half has 1 bit exactly where its bit differs with b's
    _a = _a - ((_a >> 1) & 0x55555555); 
    _a = (_a & 0x33333333) + ((_a >> 2) & 0x33333333); 
    c = ((_a + (_a >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
    
    _a = (a&0xFFFF) ^ (b&0xFFFF) // now 2nd half has 1 bit exactly where its bit differs with b's
    _a = _a - ((_a >> 1) & 0x55555555); 
    _a = (_a & 0x33333333) + ((_a >> 2) & 0x33333333); 
    return c+ (((_a + (_a >> 4) & 0xF0F0F0F) * 0x1010101) >> 24)
    
}

function gray_from_canvas(buff){
  buff = new Uint32Array(buff.buffer)
  var grey = new Uint8Array(buff.length)

  var r,b,g,cur,i,l
  i=0
  l = buff.length
  do{
       cur = buff[i]
       r = (cur>>>16)&0xff
       b = (cur>>>8)&0xff
       g = cur&0xff
       grey[i++]  = ((Math.max(r,g,b)+Math.min(r,b,g))*0.5)|0
      
  }while(i<l)

 
  return grey
}



function middleArea(l, numSqrtArea,areaWidth,areaHeight,w,h){
    this.areaWidth = areaWidth
    this.areaHeight = areaHeight
    this.numSqrtArea = numSqrtArea
    this.width = w
    this.height = h
    this.buff = new Uint16Array(l)
}
middleArea.prototype = {
    blur_guided_binary: function(buff,diff){
        
        var dx
        var dy
        var _min
        var _max
        var tmp
        var _1per
        var point
        var cur,pix
        var dark,light
        var bits = new Uint8Array(buff.length)
        var ax=0
        var ay=0
        var numSqrtArea = this.numSqrtArea
        var w = this.width
        var areaHeight = this.areaHeight
        var areaWidth = this.areaWidth
        var middle = this.buff
        do{
            dx =0
            dy = 0
            _max = middle[ax + ay * numSqrtArea]
            _min = _max >>> 8
            _max = _max & 0xff
   
            _1per = 1/((_max-_min)*0.01)
            do{
                point = (areaWidth * ax + dx+(areaHeight * ay + dy)*w)|0
                cur = diff[point]
                pix = buff[point]
                dark = Math.abs(_min - pix)*_1per
                light = Math.abs(_max - pix)*_1per
                if(pix <= _min){
                     bits[point] = 1
                }else if(cur <0) {
                    if(light > 15){
                       bits[point] = 1 
                    }
                }else if(dark <= 40){
                    bits[point] = 1 
                }
                
                dx++
                tmp = (dx-areaWidth)>>>31
                dx *= tmp
                dy += tmp^1
                //-----------------
            }while((dy-areaHeight)>>>31) // (dy < areaHeight)
             /*
            this code will increment ax and ay to loop x y blocks 
            */
            ax++
            tmp = (ax-numSqrtArea)>>>31
            ax *= tmp
            ay += tmp^1
            //-----------------
        }while(ay < numSqrtArea)
        return bits
       
    }
}
function gray_from_canvas4(image,w,h)
{
    // about the same xy to middle box as org code everything else is quite a bit different
    image = new Uint32Array(image.buffer)
    var numSqrtArea = 6;
    var numSqrtAreaX = 1/numSqrtArea
    var areaWidth = (w * numSqrtAreaX)|0;
    var areaHeight = (h * numSqrtAreaX)|0;
    var middle_l = numSqrtArea*numSqrtArea
    var image_l = image.length
    var grey1 = new Uint8Array(image_l)
    var bits1 = new Uint8Array(image_l)
    var middle1 = new middleArea(middle_l,numSqrtArea,areaWidth,areaHeight,w,h)
    var grey2 = new Uint8Array(image_l)
    var bits2 = new Uint8Array(image_l)
    var middle2 = new middleArea(middle_l,numSqrtArea,areaWidth,areaHeight,w,h)
    var middle_point,point
    var r,b,g
    var _min,_max,_min1,_max1,_min2,_max2
    var max_c
    var min_c
    var tmp,tmp2,tmp3
    var ax,ay,dx,dy
    var count = new Uint32Array(256)
    var _mid
    var upper1,upper2,lower1,lower2
    var upper_val1,upper_val2
    var lower_val1,lower_val2
    var i,l
    var cur
    var upper_set,upper_other,lower_set,lower_other,upperX,lowerX
    var target
    var _1per,dark

    ax=0
    ay=0
    do{
        
        _min= _min1= _min2 = 0xFF
        _max = _max1 = _max2 = 0
        // zero out count with a static empty array
        // this is faster than making a new  one and faster then zeroing it out in js
        count.set(gray_from_canvas4.zero_count) 
           
        dx =0
        dy = 0
        middle_point = (ax + ay * numSqrtArea)|0
        do{
            point = (areaWidth * ax + dx+(areaHeight * ay + dy)*w)|0
            target = image[point];
            r = (target>>>16)&0xff
            b = (target>>>8)&0xff
            g = target&0xff
            ///------------------------
            tmp  = r - b                    //____________________________________
            tmp = (tmp & (tmp >> 31))
            max_c = r - tmp                 //----Max for a int of 32 bits or less
            min_c = b + tmp                 //----min for a int of 32 bits or less
            tmp = max_c - g                 //____________________________________
            max_c = max_c - (tmp & (tmp >> 31))             //----Max for a int of 32 bits or less
            tmp = min_c - g                 
            min_c = g + (tmp & (tmp >> 31))                //----min for a int of 32 bits or less
            /// max and min  of r g and b ^^^^^^^^^^^^^^^^^^
            ///------------------------ 
               
            target = ((max_c+min_c)*0.5)|0
            
            grey1[point]= target
            count[target]++
            tmp  = _max - target            //____________________________________
            _max = _max - (tmp & (tmp >> 31)) //----Max for a int of 32 bits or less
            
            tmp = _min - target  //____________________________________
            _min = target + (tmp & (tmp >> 31)) //----min for a int of 32 bits or less
            
             tmp  = (_max1 - cur)>>>31            //____________________________________
            _max1 = (_max1 * (3+(tmp^1))  + cur * tmp  )*0.25   //----Max for float  weighted in
            
            tmp = (_min1 - cur)>>>31             //____________________________________
            _min1 = ( _min1 * (3+tmp) +  cur * (tmp^1))*0.25  //----min for a float weighted in
            
            
            /*
            this code will increment dx and dy to loop x y blocks 
            */
            dx++
            tmp = (dx-areaWidth)>>>31
            dx *= tmp
            dy += tmp^1
            //-----------------
        }while((dy-areaHeight)>>>31) // (dy < areaHeight)
        middle1.buff[middle_point] = (_min1<<8) | _max1
        
        _mid = ((_max - _min)*0.5)|0
        
        upper1=upper2=lower1=lower2=0
        upper_val1=upper_val2=0
        i = _min
      
        
        do{
            cur = count[i]
            tmp = upper1 - cur
            tmp2 = tmp>>>31
            upper1 = upper1 - (tmp & (tmp >> 31)) //----max for a int of 32 bits or less 
            upper_val1 = (upper_val1 * (tmp2^1)) | (i * tmp2) // if(upper1 < cur) upper_val1 
            
            cur *= tmp2^1 // if the first passed make sure the 2nd fails 
               
               
            tmp = upper2 - cur
            tmp2 = tmp>>>31
            upper2 = upper2 - (tmp & (tmp >> 31)) //----max for a int of 32 bits or less 
            upper_val2 = (upper_val2 * (tmp2^1)) | (i * tmp2) // if(upper1 < cur) upper_val1 
            i++
        }while((i-_mid)>>>31) // (i<_mid) 
        
        i = _mid
        l = _max+1
        do{
            cur = count[i]
            tmp = lower1 - cur
            tmp2 = tmp>>>31
            lower1 = lower1 - (tmp & (tmp >> 31)) //----max for a int of 32 bits or less 
            lower_val1 = (lower_val1 * (tmp2^1)) | (i * tmp2) // if(upper1 < cur) upper_val1 
               
            cur *= tmp2^1 // if the first passed make sure the 2nd fails 
               
            tmp = lower2  - cur
            tmp2 = tmp>>>31
            lower2 = lower2 - (tmp & (tmp >> 31)) //----max for a int of 32 bits or less 
            lower_val2 = (lower_val2 * (tmp2^1)) | (i * tmp2) // if(upper1 < cur) upper_val1 
              
            
            i++
        }while((i-l)>>>31)

        tmp  = upper_val2 - upper_val1
        tmp = (tmp & (tmp >> 31))
        upper_set = upper_val1 + tmp  //----min for a int of 32 bits or less   
        upper_other = upper_val2 - tmp
        
        tmp = lower_val1-lower_val2
        lower_other = lower_val2 + (tmp & (tmp >> 31))
        
        upperX = upper_set/upper_other
        lowerX = 254/lower_other 
        
        dx=0
        dy=0
        _1per = 1/((_max1-_min1)*0.01)
          
        do{
            point = areaWidth * ax + dx+(areaHeight * ay + dy)*w
            cur = grey1[point]
            dark = _min1-cur
            tmp = dark >>31
            dark = ((tmp+dark)^tmp)*_1per // abs for int
            if(dark <= 40 || cur <= _min1){
                bits1[point] = 1
            }
            if(cur >= upper_set && cur <= upper_other){
                cur = upper_set
            } else if(cur <= _mid){
                cur = (cur * upperX)|0
            }else if(cur >= lower_other ){
                cur = 255
            } else{
                cur = (cur * lowerX)|0
            }
            tmp  = (_max2 - cur)>>>31            //____________________________________
            _max2 = (_max2 * (3+(tmp^1))  + cur * tmp  )*0.25   //----Max for float  weighted in
            
            tmp = (_min2 - cur)>>>31             //____________________________________
            _min2 = ( _min2 * (3+tmp) +  cur * (tmp^1))*0.25  //----min for a float weighted in
            grey2[point] = cur

            /*
            this code will increment dx and dy to loop x y blocks 
            */
            dx++
            tmp = (dx-areaWidth)>>>31
            dx *= tmp
            dy += tmp^1
            //----------------- 
        }while(dy<areaHeight)
        middle2.buff[middle_point] = (_min2<<8) | _max2
        dx=0
        dy=0
        _1per = 1/((_max2-_min2)*0.01)
        do{
            point = areaWidth * ax + dx+(areaHeight * ay + dy)*w
            cur = grey2[point]
            dark = _min2-cur
            tmp = dark >>31
            dark = ((tmp+dark)^tmp)*_1per // abs for int
            if(dark <= 40 || cur <= _min2){
                bits2[point] = 1
            }
            /*
            this code will increment dx and dy to loop x y blocks 
            */
            dx++
            tmp = (dx-areaWidth)>>>31
            dx *= tmp
            dy += tmp^1
            //----------------- 
        }while(dy<areaHeight) 
        
        /*
        this code will increment ax and ay to loop x y blocks 
        */
        ax++
        tmp = (ax-numSqrtArea)>>>31
        ax *= tmp
        ay += tmp^1
        //-----------------
    }while(ay < numSqrtArea)

    
    
    return {g1:grey1,g2:grey2,b1:bits1,b2:bits2,m1:middle1,m2:middle2}
}
gray_from_canvas4.zero_count = new Uint32Array(256)
function strech_grey(grey){

  var l = grey.length

  var grey2 = new Uint8Array(l)
  var bits = new Uint8Array(l)
  var count = new Uint32Array(256)
  var r,b,g,cur,i,_min=255,_max=0,_mid
  i=0
  
  do{
       cur = grey[i++]
       if(cur > 245 || cur < 10) continue
       if(cur < _min){
           _min = cur
       }
       if(cur > _max){
           _max = cur
       }
       count[cur]++
       
      
  }while(i<l)
   _mid = ((_max - _min)*0.5)|0
   var upper1=0,upper2=0,lower1=0,lower2=0
   var upper_val1=0,upper_val2=0
   i = _min
   do{
       cur = count[i]
       if(cur >= upper1){
           upper_val1 = i
           upper1 = cur
       } else if(cur >= upper2){
           upper_val2 = i
           upper2 = cur
       }
       i++
   }while(i<_mid)
   var lower_val1=0,lower_val2=0
   i = _mid
   l = _max+1
   do{
       cur = count[i]
       if(cur >= lower1){
           lower_val1 = i
           lower1 = cur
       } else if(cur >= lower2){
           lower_val2 = i
           lower2 = cur
       }
       i++
   }while(i<l)
   
   i = 0
   l = grey.length

   var upper_set = Math.min(upper_val1,upper_val2)
   var upper_other = (upper_set == upper_val1) ? upper_val1:upper_val1
   var upperX = upper_set/upper_other 
   var lower_set = Math.max(lower_val2,lower_val1)
   var lower_other = (lower_val1 == lower_set)? lower_val1:lower_val2
   var lowerX = 254/lower_other 
   
   do{
       cur = grey[i]
       
       if(cur <= upper_other){
           bits[i] =1

       } 
      if(cur >= upper_set && cur <= upper_other){
          cur = upper_set
      }
      if(cur <= _mid && cur > upper_other){
           cur = (cur * upperX)|0
       }else if(cur >= lower_other ){
           cur = 255
       } else{
           cur = (cur * lowerX)|0
       }
        grey2[i] = cur
       i++
   }while(i<l)
   
 
  return {bits:bits,g1:grey,g2:grey2}
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







function blur_enhanced_binary(g1,g2,bits){
    var l = bits.length
    var ret = new Uint8Array(l)
    var i = 0
    var diff
    var pix1,pix2,pix3,pix4,pix5,pix6,
        pix7,pix8,pix9,pix10,pix11,pix12,x,y
    do{
        diff = g1[i] - g2[i]
        if(diff < 3){
           
            pix1 = i+1
            pix2 = i+2
            pix3 = i+3
            pix4 = i-1
            pix5 = i-2
            pix6 = i-3
            
            if(
                
                bits[i] ||
                (pix1 < l && bits[pix1]) ||
                (pix2 < l && bits[pix2]) ||
                (pix3 < l && bits[pix3]) ||
                
                (pix4 > -1 && bits[pix4]) ||
                (pix5 > -1 && bits[pix5]) ||
                (pix6 > -1 && bits[pix6]) 


            ) {
                ret[i] = 1
            } 
        } 
        i++
    }while(i<l)
    return ret
}


function blur_diff(buff,r1,r2,w,h) {
    var g1 = stackBlurGray(buff,w,h,r1)
    var g2 = stackBlurGray(buff,w,h,r2)
    var l = buff.length
    var diff = new Int16Array(l)
    i=0
    do{
        diff[i] =  g1[i] - g2[i]
        i++
    }while(i<l)
    return diff
    
}



addEventListener('message', function(e) {

  var w = e.data.w
  var h = e.data.h
  qrcode.width = w
  qrcode.height = h
  
  
  //postMessage(gray_to_canvas_buff(gray_from_canvas2(e.data.buff)))
  function post(bits){
      var ret
      var start2 = new Date()
      try{

          ret = qrcode.process(bits,w,h)
          console.log(new Date() - start2 + ' fin')
          var test1 = (ret == "6JKeKYJ4SGrK4h1xwT3MJ6TfyGfn1kK57QuMJED5ap5NmDqViqaEZwGrRqhimZuXAFKUrM6vrKvNR4pRCicmCwBXo7AC2DWeWrNPCJGpTKzuCYZUHVvhX62aYpYWGLAABmJRGc97M6RQHsonR4fn2y7J2fHtEybAVevX")
          var test2 = (ret == "MXp8FodxoKZcLsQt9NpG94nUWoQk133Qo6cyNPTzjtq7udUP563u9VoKV9VAjH88fGbVZfjNimg5DHpAQwCGZCkbsrdFvnRguYsL7KveEf9tyx6UPaU3gk3pYUMgPWmzNTEqCN8MPsajrr8pxSfvWAfz5uLRtiqNpgQV3ayWguDw2Yc2UsAvA6sadhL55KQzVzS43WRYqMShNy47wv4v6UwYa3qhT3QRCMqrf3AobW3av5EzpvyWzq4FFJkSvGH7nCBptSgXTBvgdL12qmAez6iPkiFtDT2pdVpE4qSi5TEGcDpRttWXRH4ZFX3uUntJrgLBmTAE")          
          if(test1 || test2){
              console.log('found')
          }else {
              console.log('bad Data')
              self.close()
          }        

          //postMessage(ret)
          
          //self.close()
        } catch(e){
            console.log(new Date() - start2 + ' 2')
             console.log(e)
             console.log(e.stack)
            return
        }
  }
  var dat
  
  var start = new Date();
  dat = gray_from_canvas4(e.data.buff,w,h)
  var b1 = blur_diff(dat.g2,2,4,w,h)
  var bits = dat.m2.blur_guided_binary(dat.g2,b1)
  postMessage(bits_to_canvas_buff(bits))
  post(bits)
  

 
  
  
}, false);

//=============================

})();