
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
    panel.append("h6").text(`${key.charAt(0).toUpperCase()}${key.slice(1)}:   ${value}`);
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
  var yticks = ids.map(sampleObj => "OTU " + sampleObj + "  ").slice(0,10).reverse();
  console.log("yticks =" ,yticks);

  // Create the trace for the bar chart - https://plotly.com/javascript/horizontal-bar-charts/
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
  // Create trace for the bubble chart - https://plotly.com/javascript/bubble-charts/
  var bubbleTrace = [{
    x: ids,
    y: values,
    text: labels,
    mode: "markers",
      marker: {
        size: values,
        color: ids,
        sizemode: 'area',
        //sizeref: 2.0 * Math.max(...values) / (40.0 ** 2),
        sizeref: 2.0 * Math.max(...values) / (80.0 ** 2),
        colorscale: "Earth" 
      }
  }];

  // Create the layout for the bubble chart
  var bubbleLayout = {
      title: "Sample Values Per OTU ID",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Values"},
      automargin: true,
      hovermode: "closest"
  };

  // Plot the data with Plotly
  Plotly.newPlot("bubble", bubbleTrace, bubbleLayout)

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
  var wfreq = result.wfreq;
  console.log("wfreq =" ,wfreq);

  // Define the color scale for the bins
  var colors = [
    'rgba(248,243,235,255)',
    'rgba(244,241,228,255)',
    'rgba(233,230,201,255)',
    'rgba(229,232,176,255)',
    'rgba(213,229,153,255)',
    'rgba(183,205,143,255)',
    'rgba(138,192,134,255)',
    'rgba(136,188,141,255)',
    'rgba(131,181,136,255)'
  ]
  
  // Define the 9 steps for the gauge, as well as they colord each step will use.  
  var steps = [];
  for (var i = 0; i < 9; i++) {
    steps.push({
      range: [i, i + 1],
      color: colors[i]
    });
  }

  // Helper function to convert degrees to radians
  function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  };

  // Helper function to calculate needle endpoint (x, y) coordinates
  function getNeedleCoordinates(value, min, max, length) {
    var angle = (1 - (value - min) / (max - min)) * 180 + 90;
    var radians = degreesToRadians(angle - 90);
    return [length * Math.cos(radians), length * Math.sin(radians)];
  }

  // Define the needle coordinates
  var needleLength = 0.8;
  var needleCoordinates = getNeedleCoordinates(wfreq, 0, 9, needleLength);
  var path = `M 0 0 L ${needleCoordinates[0]} ${needleCoordinates[1]} Z`;
  console.log("path =" ,path);

  // Configure the gauge chart
  var gaugeTrace = [
    {
      type: 'indicator',
      mode: 'gauge',
      value: wfreq,
      title: { text: '<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week' },
      gauge: {
        axis: { range: [0, 9], dtick: "1" },
        bar: { color: 'transparent' },
        steps: steps,
        dtick: 1
      }
    },
  ];
  var gaugeLayout = {
    height: 400,
    width: 600,
    xaxis2: {
      range: [-1, 1],
      zeroline: false,
      fixedrange: true,
      showline: false,
      showticklabels: false,
      showgrid: false,
      domain: [0-1]
    },
    yaxis2: {
      range: [0, 1],
      zeroline: false,
      fixedrange: true,
      showline: false,
      showticklabels: false,
      showgrid: false,
      domain: [0-1]
    },
    shapes: [
      {
        type: 'path',
        path: path,
        xref: 'x2',
        yref: 'y2',
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }
    ]
  };
  
  // Render the gauge chart
  Plotly.newPlot('gauge', gaugeTrace, gaugeLayout);



// Plot a second chart to better replicate the example found in the challenge.  
// https://courses.bootcampspot.com/courses/2910/assignments/46944?submitted=2k
// 
// Note that the example provide in the assignment is not a gauge chart at all, and that a 
// Plotly does not provide any gauge option which could be used to replicate the example.  
// The example was actually made with a pie chart, with a few tricks used to make it look 
// like a gauge.  

// Calculate the needle point coordinates:
var min = 0;
var max = 9;
var degrees = (1 - (wfreq - min) / (max - min)) * 180 ;
console.log("degrees =" ,degrees);
radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Define SVG path to create a triangle to use as our needle, which better approximates the 
// example provided.  Note that we need to swap the X and Y coordinates when the needle is 
// pointing up, or the triangle will become a line.  
//
var sPathHorizontal = "M -0.035 0 L 0.035 0 L ",
  sPathVertical = "M 0 -0.035 L 0 0.035 L ",
  pathX = String(x),
  space = " ",
  pathY = String(y),
  pathEnd = " Z";
var sPath = (degrees > 35 && degrees < 125) ? sPathHorizontal : sPathVertical;
var path = sPath.concat(pathX, space, pathY, pathEnd);

// Define colors for the bins
var colors = [
  'rgba(248,243,235,255)',
  'rgba(244,241,228,255)',
  'rgba(233,230,201,255)',
  'rgba(229,232,176,255)',
  'rgba(213,229,153,255)',
  'rgba(183,205,143,255)',
  'rgba(138,192,134,255)',
  'rgba(136,188,141,255)',
  'rgba(131,181,136,255)',
  'rgba(255,255,255,255)',
]

// Create a 'Category' trace to more closely approximate the suggested solution, as the 'Gauge' 
// trace doesn't offer a way to have text inside the arc.   
//
// Create a pie chart with the bottom half hidden.  Note that 'values', 'text' and 'labels' below 
// have a hidden category.   https://plotly.com/javascript/pie-charts/ 
//
var pieTrace = [{ 
  type: 'category',
  x: [0], y:[0],
  //marker: {size: 28, color:'850000'},
  marker: {size: 24, color:'850000'},
  showlegend: false,
  name: 'scrubs per week',
  text: wfreq,
  hoverinfo: 'text+name'},
  { 
    values: [2,2,2,2,2,2,2,2,2,18],
    rotation: 90,
    text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6',  '6-7',  '7-8',  '8-9', ''],
    textinfo: 'text',
    textposition:'inside',      
    marker: { colors },
    // This works by having a 'hidden' category that's not visitble:
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'white'],
    hoverinfo: 'label',
    direction: 'clockwise',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];
  
  var pieLayout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: { text: '<b>Belly Button Washing Frequency (Pie Chart)</b> <br>Scrubs Per Week' },
    height: 600,
    width: 600,
    xaxis: {type:'category',zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
    yaxis: {type:'category',zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('pie', pieTrace, pieLayout);
}; // end buildCharts

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
    panel.append("h6").text(`${key.charAt(0).toUpperCase()}${key.slice(1)}:   ${value}`);
  });
}