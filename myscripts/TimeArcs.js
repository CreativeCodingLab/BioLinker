
var tWidth = 800;
var tHeight = 400;

var force3 = d3.layout.force()
    .charge(-100)
    .linkDistance(100)
    .gravity(0.1)
    //.friction(0.5)
    .alpha(0.1)
    .size([tWidth, tHeight]);

var tnodes = [];
var tlinks = [];
var nodesList = {};

var focusName ="";
// vertex is the input node which contains neighbors information
function drawTimeArcs(vertex){
  tnodes = [];
  tlinks = [];
  nodesList = {};

  var timeArcsRect = svg2.append('rect')
    .attr("class", "timeArcsRect")
    .attr("x", mouseCoordinate[0]-tWidth/2)
    .attr("y", mouseCoordinate[1])
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("width", tWidth)
    .attr("height", tHeight)
    .style("fill", "#eee")
    .style("stroke", "#000");
  focusName = vertex.ref.fields.entity_text;  
  for (var i=0; i<vertex.ref.directLinks.length;i++){
    var link = vertex.ref.directLinks[i];
    
    var node1 = getNode(link.source);
    var node2 = getNode(link.target);
    var newlink = {};
    newlink.ref = link;
    newlink.source=node1;
    newlink.target=node2;
    tlinks.push(newlink);
  }

  force3
    .nodes(tnodes)
    .links(tlinks)
    .start();

  force3.on("end", function () {
    detactTimeSeries();
  });  
  force3.on("tick", function() {
    update3();
  });  
    

  /*svg2.selectAll(".link3").remove();
  var link3 = svg2.selectAll(".link3")
      .data(tlinks)
    .enter().append("line")
      .attr("class", "link3")
      .style("stroke", function(l){
         return getColor(l.ref.type);
      })
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 1);  */

  svg2.selectAll(".linkArc").remove();
  svg2.selectAll(".linkArc")
    .data(tlinks).enter().append("path")
    .attr("class", "linkArc")
    .style("stroke", function (l) {
        return getColor(l.ref.type);
    })
    .style("stroke-width", function (d) {
        return  1;
  });       


  svg2.selectAll(".node3").remove();
  var node3 = svg2.selectAll(".node3")
      .data(tnodes)
    .enter().append("circle")
      .attr("class", "node3")
      .attr("r", 2)
      .style("fill", "#444")
      .style("stroke", "#eee")
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 0.3)
      .call(force.drag);



  function update3(){    
      tnodes.forEach(function(d){
        d.x += (tWidth/2-d.x)*0.01;
              
      });
      /*link3.attr("x1", function(d) { return mouseCoordinate[0]-tWidth/2+d.source.x; })
          .attr("y1", function(d) { return mouseCoordinate[1] +d.source.y; })
          .attr("x2", function(d) { return mouseCoordinate[0]-tWidth/2 + d.target.x; })
          .attr("y2", function(d) { return mouseCoordinate[1] + d.target.y; });*/

      node3.attr("cx", function(d) { return mouseCoordinate[0]-tWidth/2+ d.x; })
          .attr("cy", function(d) { return mouseCoordinate[1] + d.y; });

       svg2.selectAll(".linkArc").attr("d", linkArc);    
  }
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
  tlinks.forEach(function(d,j){
     //d.y = 100+i*10;          
  });

  update3();
  debugger;
  //svg2.selectAll(".timeArcsRect").remove();
}

function linkArcTime(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy)/2;
    // return "M" + (xStep+d.source.x) + "," + d.source.y + " Q" + ((xStep+d.source.x)+dr) + "," + d.target.y+ " " + (xStep+d.target.x) + "," + d.target.y;
 
    if (d.source.y<d.target.y )
        return "M" + (mouseCoordinate[0]-tWidth/2+d.source.x) + "," + (mouseCoordinate[1]+d.source.y) + "A" + dr + "," + dr + " 0 0,1 " + (mouseCoordinate[0]-tWidth/2+d.target.x) + "," + (mouseCoordinate[1]+d.target.y);
    else
        return "M" + (mouseCoordinate[0]-tWidth/2+d.target.x) + "," + (mouseCoordinate[1]+d.target.y) + "A" + dr + "," + dr + " 0 0,1 " + (mouseCoordinate[0]-tWidth/2+d.source.x) + "," + (mouseCoordinate[1]+d.source.y);
}

function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy)/2;
    // return "M" + (xStep+d.source.x) + "," + d.source.y + " Q" + ((xStep+d.source.x)+dr) + "," + d.target.y+ " " + (xStep+d.target.x) + "," + d.target.y;
 
    if (d.source.y<d.target.y )
        return "M" + (mouseCoordinate[0]-tWidth/2+d.source.x) + "," + (mouseCoordinate[1]+d.source.y) + "A" + dr + "," + dr + " 0 0,1 " + (mouseCoordinate[0]-tWidth/2+d.target.x) + "," + (mouseCoordinate[1]+d.target.y);
    else
        return "M" + (mouseCoordinate[0]-tWidth/2+d.target.x) + "," + (mouseCoordinate[1]+d.target.y) + "A" + dr + "," + dr + " 0 0,1 " + (mouseCoordinate[0]-tWidth/2+d.source.x) + "," + (mouseCoordinate[1]+d.source.y);
}

function removeTimeArcs(){
  svg2.selectAll(".timeArcsRect").remove();
}