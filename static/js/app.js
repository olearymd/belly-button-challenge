
// Fetch data and assign it to a global variable.  Since it's used by several functions, we don't want
// to download the data multiple times.  
// 
//AWS URL for our samples data:
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let data;
async function fetchData(url) {
  const response = await d3.json(url); 
  data = response;
}

// Fetch the JSON data 
//jfetchData(url).then(() => {
  // Log the data to the console
//j  console.log("data =" ,data);
//j});

// Populate selector and build initial plots
//
// Use d3 to select the "selDataset" selector
var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
//
// Fetch the JSON data 
fetchData(url).then(() => {
  // Log the data to the console
  console.log("data =" ,data);

  // Get an array of the sample names
  var sampleNames = data.names;
  console.log("sampleNames = ", sampleNames);

  // Populate the select box options
  sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  var firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
});

// Get new optons each time a different option is selected
function optionChanged(selectedSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(selectedSample);
  buildMetadata(selectedSample);
};

// This function gets the selected JSON metadata object and prints its properties in the 
// Demographic Info panel
function buildMetadata(sample) {

  // Get an array of the metadata
  var metadata = data.metadata;
  console.log("metadata =" ,metadata);

  // Filter the metadata array for the selected sample id
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  console.log("resultArray =" ,resultArray);

  // Get the first result to populate the info panel until a selection is made
  var result = resultArray[0];
  console.log("result =" ,result);

  // Use d3 to select the "#sample-metadata" panel 
  var panel = d3.select("#sample-metadata");
  console.log("panel =" ,panel);

  // Clear existing metadata
  panel.html("");

  // Loop through each key-value pair and append to our "panel" d3 object
  Object.entries(result).forEach(([key, value]) => {
    panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
}

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.
//
function buildCharts(sample) {

  // Get an array of data samples
  var samples = data.samples;
  console.log("samples =" ,samples);

  // Filter the samples array for the selected sample id using an arrow function
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  console.log("resultArray =" ,resultArray);
  
  // Get the first element in the array to populate the chart until a selection is made
  var result = resultArray[0];
  console.log("result =" ,result);

  // Get the otu_ids, otu_labels, and sample_values arrays
  var ids = result.otu_ids;
  console.log("ids =" ,ids);
  var labels = result.otu_labels;
  console.log("labels =" ,labels);
  var values = result.sample_values;
  console.log("values =" ,values);
  
  // For the bar chart yticks, prepend "OTU " to each of the otu_ids.  
  // Also, take the first 10 and sort descending
  var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
  console.log("yticks =" ,yticks);

  // Create the trace for the bar chart
  var trace = [{
    x: values.slice(0,10).reverse(),
    y: yticks,
    type: "bar",
    orientation: "h",
    text: labels.slice(0,10).reverse() 
  }];

  // Create the layout for the bar chart
  var layout = {
    title: "Top 10 OTU Samples"
  };
  // Use Plotly to plot the data 
  Plotly.newPlot("bar", trace, layout);

  
  // Create a bubble chart that displays each sample.
  // Use otu_ids for the x values.
  // Use sample_values for the y values.
  // Use sample_values for the marker size.
  // Use otu_ids for the marker colors.
  // Use otu_labels for the text values.  
  // 
  // Create trace for the bubble chart
  var bubbleTrace = [{
    x: ids,
    y: values,
    text: labels,
    mode: "markers",
      marker: {
        size: values,
        color: ids,
        colorscale: "Rainbow" 
      }
  }];

  // Create the layout for the bubble chart
  var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"
  };

  // Plot the data with Plotly
  Plotly.newPlot("bubble", bubbleTrace, bubbleLayout)

  /* 
  // Create a gauge chart plot the weekly washing frequency of the individual.
  //
  // Get an array of the metadata
  var metadata = data.metadata;
  console.log("metadata =" ,metadata);

  // Filter the metadata array for the selected sample id
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  console.log("resultArray =" ,resultArray);

  // Get the first result to populate the info panel until a selection is made
  var result = resultArray[0];
  console.log("result =" ,result);

  // Get the wash frequency
  var wfreqs = result.wfreqs;
  console.log("wfreqs =" ,wfreqs);

  var gaugeTrace = [
    {
      domain: { x: [0, 10], y: [0, 10] },
      value: wfreqs,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number"
    }
  ];

  var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot("gauge", gaugeTrace, gaugeLayout);
  */ 

};