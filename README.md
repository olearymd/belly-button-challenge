# belly-button-challenge

This repo contains javascript code utilizing the D3 library to read JSON samples from an AWS URL (https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json), then using the data to create an interactive web page.  

The web page allows one to select a subject ID.  For any given test subject, the following will be displayed: 

* A panel displaying metadata for the selected subject.
* A horizontal bar chart with the top 10 operational taxonomic units (OTUs) for the individual selected.  
* A bubble chart displaying OTU IDs, OTU labels and sample values for each sample, with bubble size representing the sample values, and colors representing the OTU_IDs.  
* A gauge chart showing belly button washing frequency, as well as a pie chart representing the same data, but so as to match the sample impage provided.  

The web page can be accessed at https://olearymd.github.io/belly-button-challenge/

References:

Hulcr, J. et al. (2012) A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable. Retrieved from: http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/ 
