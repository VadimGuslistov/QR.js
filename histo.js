function buff_histogram(buff,width,height){
	
	var minVal = 255;
	var maxVal = 0;
	var maxVal1 = 0;
	var maxVal2 = 0;
	var histogramValues = new Int32Array(256)
	var pixels = new Uint8Array()
	pixels = new unsigned char [width * height];
	pixels = myPicture.getPixels();
	
	for (int i = 0; i < width; i++){
		for (int j = 0; j < height; j++){
			int pixVal = pixels[j*width + i];
			histogramValues[pixVal]++;
		}
	}
	
	//stuff for the second image
	resultingPixels = new unsigned char [width * height];
	
	//draw the image for the resulting pixels into a texture
	texture.allocate(width, height, GL_LUMINANCE);
	
	//intialize variable for storing pixel values
	cdfPixels = new unsigned char [width * height];
	
	numOccurances = new unsigned int [256];
	cdf = new unsigned int [256];
	
	for (int i = 0; i < 256; i++){
		numOccurances[i] = 0;
		cdf[i] = 0;
	}
	
	texture1.allocate(width, height, GL_LUMINANCE);
	
	
	/*
	//histogram values for the new image
	for (int k = 0; k < width; k++){
		for (int l = 0; l < height; l++){
			int pixVal = pixels[l * width + k];
			int pixIndex = l * width + k;
			float newPixVal = ((pixVal - minVal)/(maxVal - minVal))*255.0f;
			resultingPixels[pixIndex] = pixVal * (newPixVal/8);
			//cout << "pixVal = " << pixVal << endl;
			//cout << "newPixVal = " << newPixVal << endl;
		}
	}
	
	texture.loadData(resultingPixels, width, height, GL_LUMINANCE);
	*/
	//equalized histogram
	//calculate the number of occurances of a pixel value
	for (int i = 0; i < width; i++) {
		for (int j = 0; j < height; j++) {
			int pixIndex = j * width + i;
			int pixValue = pixels[pixIndex];
			numOccurances[pixValue]++;
		}
	}
	
	//calculate the cumulative distribution function
	for (int i = 0; i < 256; i++) {
		if (i > 0) {
			cdf[i] = cdf[i-1] + numOccurances[i+1];
		} else {
			cdf[i] = numOccurances[i];
		}
		//cout << "cdf" << i << " = " << cdf[i] << endl;
	}
	
	//equalized histogram values for the new image
	for (int k = 0; k < width; k++){
		for (int l = 0; l < height; l++){
			int pixIndex = l * width + k;
			int pixVal = pixels[pixIndex];
			int newPixVal = round(((cdf[pixVal] - 1.0f) / ((width * height) - 1.0f) * 255.0f));
			cdfPixels[pixIndex] = newPixVal;
			//cout << "val " << pixIndex << " = " << newPixVal << endl;
		}
	}
	
	texture1.loadData(cdfPixels, width, height, GL_LUMINANCE);
}