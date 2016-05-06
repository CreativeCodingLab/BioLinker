var diameter = 1000,
    radius = diameter / 2,
    innerRadius = radius - 120;

  // Add color legend
var typeList = ["increases_activity","decreases_activity", "translocation", "binds", "Multiple interaction types"]  
function drawColorLegend() {
  var xx = 380;
  var y1 = 13;    
  svg2.selectAll(".arcLegend").data(typeList).enter()
  .append("path")
    .attr("class", "arcLegend")
    .style("fill-opacity", 0)
    .style("stroke-width", 2)
    .style("stroke", function (d) {
        return getColor(d);
    })
    .attr("d", function(l,i){
      var yy = y1+14*i-10;
      var rr = 5.6;
      return "M" + xx + "," + yy + "A" + rr + "," + rr*1.25 + " 0 0,1 " + xx + "," + (yy+rr*2);
    });    
  svg2.selectAll(".textLegend").data(typeList).enter()
    .append("text")
      .attr("class", "textLegend")
      .attr("x", xx+8)
      .attr("y", function(l,i){
        return y1+14*i;
      })
      .text(function (d) {
        return d;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .style("text-anchor", "left")
      .style("fill", function (d) {
        return getColor(d);
      }); 
}

function removeColorLegend() {
 svg.selectAll(".nodeLegend").remove();
}
function drawTimeLegend() {
  for (var i=minYear; i<maxYear;i=i+1){
    var xx = xStep+xScale((i-minYear));
    svg.append("line")
      .style("stroke", "#00a")
      .style("stroke-dasharray", ("1, 2"))
      .style("stroke-opacity", 1)
      .style("stroke-width", 0.2)
      .attr("x1", function(d){ return xx; })
      .attr("x2", function(d){ return xx; })
      .attr("y1", function(d){ return 0; })
      .attr("y2", function(d){ return height; });
     svg.append("text")
      .attr("class", "timeLegend")
      .style("fill", "#000")   
      .style("text-anchor","start")
      .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
      .attr("x", xx)
      .attr("y", height-5)
      .attr("dy", ".21em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .text(function(d) { return i });  
  }
}  

function getColor(category) {
  var sat = 0;
  if (category=="increases_activity")
    return "rgb("+sat+", "+160+", "+sat+")" ; // leaf node
  else if (category=="adds_modification")
    return "rgb("+sat+", "+120+", "+100+")" ; // leaf node
  else if (category=="decreases_activity")
    return "rgb("+200+", "+sat+", "+sat+")" ; // leaf node
  else if (category=="removes_modification")
    return "rgb("+200+", "+100+", "+sat+")" ; // leaf node
  else if (category=="inhibits_modification")
    return "rgb("+120+", "+sat+", "+sat+")" ; // leaf node
  else if (category=="translocation")
    return "rgb("+170+", "+150+", "+sat+")" ; // leaf node
  else if (category=="binds")
    return "rgb("+sat+", "+sat+", "+255+")" ; // leaf node
  else if (category=="increases")
    return "rgb("+255+", "+0+", "+255+")" ; // leaf node
  else{
    return "#666";    
  }
}

function colorFaded(d) {
  var minSat = 80;
  var maxSat = 200;
  var step = (maxSat-minSat)/maxDepth;
  var sat = Math.round(maxSat-d.depth*step);
 
  //console.log("maxDepth = "+maxDepth+"  sat="+sat+" d.depth = "+d.depth+" step="+step);
  return d._children ? "rgb("+sat+", "+sat+", "+sat+")"  // collapsed package
    : d.children ? "rgb("+sat+", "+sat+", "+sat+")" // expanded package
    : "#aaaacc"; // leaf node
}


function getBranchingAngle1(radius3, numChild) {
  if (numChild<=2){
    return Math.pow(radius3,2);
  }  
  else
    return Math.pow(radius3,1);
 } 

function getRadius(d) {
 // console.log("scaleCircle = "+scaleCircle +" scaleRadius="+scaleRadius);
return d._children ? scaleCircle*Math.pow(d.childCount1, scaleRadius)// collapsed package
      : d.children ? scaleCircle*Math.pow(d.childCount1, scaleRadius) // expanded package
      : scaleCircle;
     // : 1; // leaf node
}


function childCount1(level, n) {
    count = 0;
    if(n.children && n.children.length > 0) {
      count += n.children.length;
      n.children.forEach(function(d) {
        count += childCount1(level + 1, d);
      });
      n.childCount1 = count;
    }
    else{
       n.childCount1 = 0;
    }
    return count;
};

function childCount2(level, n) {
    var arr = [];
    if(n.children && n.children.length > 0) {
      n.children.forEach(function(d) {
        arr.push(d);
      });
    }
    arr.sort(function(a,b) { return parseFloat(a.childCount1) - parseFloat(b.childCount1) } );
    var arr2 = [];
    arr.forEach(function(d, i) {
        d.order1 = i;
        arr2.splice(arr2.length/2,0, d);
    });
    arr2.forEach(function(d, i) {
        d.order2 = i;
        childCount2(level + 1, d);
        d.idDFS = nodeDFSCount++;   // this set DFS id for nodes
    });

};

d3.select(self.frameElement).style("height", diameter + "px");




function searchNode() {
  searchTerm = document.getElementById('search').value;
  secondLayout(nameToNode[searchTerm].id); 
}

function setSource() {
  searchTerm = document.getElementById('search').value;
  var isSource = true;
  secondLayout(nameToNode[searchTerm].id,isSource); 
}

function setTarget() {
  searchTerm = document.getElementById('search').value;
  var isSource = false;
  secondLayout(nameToNode[searchTerm].id,isSource); 
}


