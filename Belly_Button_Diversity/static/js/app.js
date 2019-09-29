function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  // console.log(sample);
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      var cell = panel.append("h5");
      cell.text(`${key}: ${value}`);
      console.log(sample);
    });
  });
}


function buildCharts(sample) {

  var url = `/samples/${sample}`;
  d3.json(url).then(function (data) {
    console.log(data);
    var otu_idsV = data.otu_ids;
    var sample_valuesV = data.sample_values;
    var otu_labelsV = data.otu_labels;

    var trace1 = {
      x: otu_idsV,
      y: sample_valuesV,
      text: otu_labelsV,
      mode: 'markers',
      marker: {
        size: sample_valuesV,
        color: otu_idsV,
      },
    };

    var dataBub = [trace1];

    var layout1 = {
      xaxis: {
        title: 'OTU ID',
      },
      height: 600,
      width: 1200,
    };
    Plotly.newPlot('bubble', dataBub, layout1, { responsive: true });
  })


  // var url = `/samples/${sample}`;
  d3.json(url).then(function (data) {
    console.log(data);
    var otu_idsP = data.otu_ids.slice(0, 10);
    var sample_valuesP = data.sample_values.slice(0, 10);
    var otu_labelsP = data.otu_labels.slice(0, 10);
    //************************************************************
    var trace2 = {
      values: sample_valuesP,
      labels: otu_idsP,
      // name: 'TOP TEN',
      hovertext: otu_labelsP,
      type: 'pie'
    };

    var data2 = [trace2];
    // // 
        //   var layout2 = {
        //     showlegend: true,
        //     height: 400,
        //     width: 400
        // };
    
    Plotly.newPlot('pie', data2);
  })
}

//********************************************************** */
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard
  init();
