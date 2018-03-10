var width = 1400,
    barHeight = 20;

var x = d3.scale.linear()
    .range([0, width]);

// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

color = d3.scale.linear().domain([0,1])
      .interpolate(d3.interpolateHcl)
      .range([
        d3.rgb("#FFFFAA"),
        d3.rgb('#764B8E')
      ]);

d3.json("static/dish_data.json", function(data) {
  var alpha = 0.85,
      beta = 0.25;
  data.forEach(function(d) {
    var score = (1-alpha)*d.dish_frequency + alpha*(beta*d.star_factor + (1-beta)*d.sentiment_factor);
    d.score =  score;
  });
  data = data.sort(function(a, b) {
    return b.score - a.score;
  });

  var chart = d3.select(".chart")
      .attr("height", barHeight * data.length)
      .attr("width", width);

  x.domain([0, d3.max(data, function(d) { return d.score; })]);

  var bar = chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i*barHeight + ")"; });

  bar.append("rect")
      .attr("fill", function(d) { return color(d.sentiment_factor); })
      .attr("stroke", "white")
      .attr("width", function(d) { return x(d.score); })
      .attr("height", barHeight)
      .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(
              "Overall Score:   " + d.score.toFixed(5) + "</br>" +
              "Dish Frequency:   " + d.dish_frequency.toFixed(5) + "</br>" +
              "Star Factor:   " + d.star_factor.toFixed(5) + "</br>" +
              "Sentiment Factor:   " + d.sentiment_factor.toFixed(5) + "</br>"
            )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

  bar.append("text")
      .attr("y", barHeight)
      .attr("x", function(d) { return x(d.score) - 10; })
      .attr("dy", "-.5em")
      .text(function(d) { return d.dish; });
});
