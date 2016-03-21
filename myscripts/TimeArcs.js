
var tWidth = 800;
var height2 = 400;

var force3 = d3.layout.force()
    .charge(-80)
    .gravity(0.1)
    //.friction(0.5)
    .linkDistance(100)
    .alpha(0.1)
    .size([tWidth, height2]);
  
  /*force3.linkDistance(function(l) {
    return 20*(l.year-minYear);  
  });*/


var tnodes = [];
var tlinks = [];
var nodesList = {};

var focusName ="";
var minYear = 40000;
var maxYear = 0;
var transTime = 1000;
// vertex is the input node which contains neighbors information
function drawTimeArcs(){
  tnodes = [];
  tlinks = [];
  nodesList = {};

  /*var timeArcsRect = svg4.append('rect')
    .attr("class", "timeArcsRect")
    .attr("x", mouseCoordinate[0]-tWidth/2)
    .attr("y", mouseCoordinate[1])
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("width", tWidth)
    .attr("height", tHeight)
    .style("fill", "#eee")
    .style("stroke", "#000");*/
  //focusName = vertex.ref.fields.entity_text;  
  
  for (var i=0; i<links2.length;i++){
    for (var j=0; j<links2[i].list.length;j++){
      var link = links2[i].list[j];
      var node1 = getNode(link.source);
      var node2 = getNode(link.target);
      var newlink = {};
      newlink.ref = link;
      newlink.source=node1;
      newlink.target=node2;
      tlinks.push(newlink);
    }
  }

  force3
    .nodes(tnodes)
    .links(tlinks)
    .start();

  force3.on("tick", function() {
    update3();
  });  
  force3.on("end", function () {
    detactTimeSeries();
  });  
    

  /*svg4.selectAll(".link3").remove();
  var link3 = svg4.selectAll(".link3")
      .data(tlinks)
    .enter().append("line")
      .attr("class", "link3")
      .style("stroke", function(l){
         return getColor(l.ref.type);
      })
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 1);  */

  svg4.selectAll(".linkArc").remove();
  svg4.selectAll(".linkArc")
    .data(tlinks).enter().append("path")
    .attr("class", "linkArc")
    .style("stroke", function (l) {
        return getColor(l.ref.type);
    })
    .style("stroke-width", function (d) {
        return  1;
    })     
    .style("stroke-opacity", 0.25);       


  svg4.selectAll(".node4").remove();
  svg4.selectAll(".node4").data(tnodes).enter()
    .append("circle")
    .attr("class", "node4")
    .attr("r", 2)
    .style("fill", "#444")
    .style("stroke", "#eee")
    .style("stroke-opacity", 0.5)
    .style("stroke-width", 0.3)
    .call(force.drag);
}      
function getNode(d){
  if (nodesList[d.fields.entity_text]==undefined){
    var node = {};
    node.ref = d;
    tnodes.push(node);
    nodesList[d.fields.entity_text] = node;
    return node;
  }
  else
    return nodesList[d.fields.entity_text];

}  

function detactTimeSeries(){
  // Compute y position *************************
  var termArray = [];
  for (var i=0; i< tnodes.length; i++) {
      var e =  {};
      e.y = tnodes[i].y;
      e.nodeId = i;
      termArray.push(e);
  }

  termArray.sort(function (a, b) {
    if (a.y > b.y) {
      return 1;
    }
    if (a.y < b.y) {
      return -1;
    }
    return 0;
  });  

  var step = Math.min((height-25)/(tnodes.length+1),12);
  for (var i=0; i< termArray.length; i++) {
      tnodes[termArray[i].nodeId].y = 12+i*step;
  }
  
  tnodes.forEach(function(d){
    d.x = tWidth;
  });
  svg4.selectAll(".linkArc").transition().duration(transTime).attr("d", linkArcTime);  
  svg4.selectAll(".node4").attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  
}


function update3(){   
  // Compute TIME position *************************
  minYear = 40000;
  maxYear = 0;
  for (var i=0; i<tlinks.length;i++){
    var l = tlinks[i];
    var pmcId = l.ref.pmc_id;
    if (pmcId.indexOf("PMC")<0)
      pmcId = "PMC"+pmcId; 
    if (pmcData[pmcId]){
      l.year = parseInt(pmcData[pmcId]["article-meta"][0]["pub-date"][0].year);
      if (l.year>maxYear)
        maxYear = l.year;
      if (l.year<minYear)
        minYear = l.year;
    }
  }
  minYear--;
  maxYear++;  
  

  tnodes.forEach(function(d){
    d.x += (tWidth/2-d.x)*0.01;      
  });
  svg4.selectAll(".node4").attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  svg4.selectAll(".linkArc").attr("d", linkArc);    
}

function linkArcTime(d) {
  var xScale = d3.scale.linear()
    .domain([minYear, maxYear])
    .range([50, tWidth-100]);

    var newX = xScale(d.year);
    if (newX<d.source.x)
      d.source.x = newX;
    if (newX<d.target.x)
      d.target.x = newX;
    
    var dx = 0,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy)/2;
    
    if (d.source.y<d.target.y )
        return "M" + newX + "," + (d.source.y) + "A" + dr + "," + dr + " 0 0,1 " + newX + "," + (d.target.y);
    else
        return "M" + newX+ "," + (d.target.y) + "A" + dr + "," + dr + " 0 0,1 " + newX+ "," + (d.source.y);
}

function linkArc(d) {
  if (d.target.x && d.source.y && d.target.x  && d.target.y){
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy)/2;
    // return "M" + (xStep+d.source.x) + "," + d.source.y + " Q" + ((xStep+d.source.x)+dr) + "," + d.target.y+ " " + (xStep+d.target.x) + "," + d.target.y;
 
    if (d.source.y<d.target.y )
        return "M" + (d.source.x) + "," + (d.source.y) + "A" + dr + "," + dr + " 0 0,1 " + (d.target.x) + "," + (d.target.y);
    else
        return "M" + (d.target.x) + "," + (d.target.y) + "A" + dr + "," + dr + " 0 0,1 " + (d.source.x) + "," + (d.source.y);
  }    
}

function removeTimeArcs(){
  svg4.selectAll(".timeArcsRect").remove();
}