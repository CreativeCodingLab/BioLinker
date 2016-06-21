/* 2016 
 * Tuan Dang (on the BioLinker project, as Postdoc for EVL, UIC)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

// This is the MAIN class javasrcipt
var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

var serverUrl = "http://ccrg-data.evl.uic.edu/index-cards/api";
//var serverUrl = "http://localhost:9999/api";

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
//d3.select("#container").append("svg")
//    .attr("width", width/1.5)
//    .attr("height", 1);

var www = 370;
var wMatrix = 300;
var svgOverview = d3.select('.overviewHolder').append('svg')
    .attr("width", www)
    .attr("height", www);

var svgContext = d3.select('.contextHolder').append('svg')
    .attr("class", "contextView")
    .attr("width", www)
    .attr("height", www);



var svg2 = d3.select("#container").append("svg")
   // .style("background", "#eed")
    .attr("width", width)
    .attr("height", height);

var wPublication = width-www-wMatrix-12;
var svg4 = d3.select(".publicationHolder").append("svg")
    .attr("class", "publicationView")
    //.style("background", "#eee")
    .attr("width", wPublication)
    .attr("height", wMatrix);
//d3.select(".publicationView")
//  .attr("width", 100);


var force3 = d3.layout.force()
    //.friction(0.5)
    .alpha(0.1)
    .size([wPublication, wMatrix]);
  
  force3.linkDistance(function(l) {
    if (l.year){
        return 4*(l.year-minYear);    
    }
    else
      return 50;
  });

/*
var svg3 = d3.select('.matrixHolder').append('svg')
    //.style("background", "#eed")
    .attr("width", wMatrix)
    .attr("height", wMatrix)

var g3 = svg3.append("g");
      // then, create the zoom behvavior
      var zoom = d3.behavior.zoom()
        // only scale up, e.g. between 1x and 50x
        .scaleExtent([1, 50])
        .on("zoom", function() {
          // the "zoom" event populates d3.event with an object that has
          // a "translate" property (a 2-element Array in the form [x, y])
          // and a numeric "scale" property
          var e = d3.event,
              // now, constrain the x and y components of the translation by the
              // dimensions of the viewport
              tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
              ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
          // then, update the zoom behavior's internal translation, so that
          // it knows how to properly manipulate it on the next movement
          zoom.translate([tx, ty]);
          // and finally, update the <g> element's transform attribute with the
          // correct translation and scale (in reverse order)
          g3.attr("transform", [
            "translate(" + [tx, ty] + ")",
            "scale(" + e.scale + ")"
          ].join(" "));
        });
    svg3.call(zoom);
*/

var mouseCoordinate;
svg2.on('mousemove', function () {
  mouseCoordinate = d3.mouse(this);
});

//Set up the force layout
var force = d3.layout.force()
    .charge(-4)
    .linkDistance(2)
    .gravity(0.05)
    //.friction(0.5)
  //  .alpha(0.1)
    .size([www, www]);

var force2 = d3.layout.force()
    .charge(-120)
    .linkDistance(70)
    .gravity(0.1)
    //.friction(0.5)
  //  .alpha(0.1)
    .size([width+www, height-wMatrix]);


var forceLabel = d3.layout.force()
  .gravity(0)
  .linkDistance(1)
  .linkStrength(5)
  .charge(-50)
  .size([width+www, height+wMatrix]);

svg2.call(tip);  
var nodes = [];
var links = [];
var nodes2 = [];
var links2 = [];
var labelAnchors = [];
var labelAnchorLinks = [];

var nameToNode={};
var data3;
var isDisplayingPopup;

var optArray = [];   // FOR search box

drawColorLegend(); // Draw color legend*************************************

var speciesMap = {};
d3.tsv("data/Species_exhaustive.tsv", function(error, data_) {
    if (error) throw error;
    data_.forEach(function(d) {
      speciesMap[d["id"]] = d["name"];
    });    
});   

var organMap = {};
d3.tsv("data/Organ.tsv", function(error, data_) {
    if (error) throw error;
    data_.forEach(function(d) {
      organMap[d["id"]] = d["name"];
    });    
});

var celltypeMap = {};
d3.tsv("data/Cell_Type.tsv", function(error, data_) {
    if (error) throw error;
    data_.forEach(function(d) {
      celltypeMap[d["id"]] = d["name"];
    });    
});

var uniprotMap = {};
d3.tsv("data/uniprot-proteins.tsv", function(error, data_) {
    if (error) throw error;
    data_.forEach(function(d) {
      if (uniprotMap[d["id"]]==undefined || uniprotMap[d["id"]].length>=d["name"].length) // to get the readable name
      uniprotMap[d["id"]] = d["name"];
    });    

});   


var linkNames = {};    
function processCard(d){
  var a = d.extracted_information.participant_a;
  var b = d.extracted_information.participant_b;
  var e = "";
  if (d.evidence){
      for (var i=0;i<1;i++){
          e+= " "+d.evidence[i];
      }   
  }
  var type = d.extracted_information.interaction_type;

  var node1 = processNode(a);
  var node2 = processNode(b);
  var l = new Object();
  l.pmc_id = d.pmc_id;
  l.name = node1.fields.entity_text+"__"+node2.fields.entity_text;
  if (linkNames[l.name+"_"+l.pmc_id]==undefined){
    l.source = node1;
    l.target = node2;
    l.type = type;
    l.evidence = e;
    l["Context_Species"] = d.extracted_information.context.Species;
    l["Context_Organ"] = d.extracted_information.context.Organ;
    l["Context_CellType"] = d.extracted_information.context.CellType;
    l.ref = d;
    links.push(l);
    linkNames[l.name+"_"+l.pmc_id] = l;
  }
}
function processNode(fields){
  if (nameToNode[fields.entity_text]==undefined){
      var newNode = {};
      newNode.fields = fields;
      newNode.id = nodes.length;
      nodes.push(newNode);
      nameToNode[fields.entity_text] = newNode;
      return newNode;
  }
  else{
      return nameToNode[fields.entity_text];
  }
}

//d3.json("data/cards-for-time-arcs.json", function(error, data_) {
d3.json("data/cardsWithContextData.json", function(error, data_) {
  data3 = data_;
  data3.forEach(function(d, index){ 
    if (2000<index && index<5000) {  // Limit to 1000 first index cards ********************************************
      processCard(d);  
    }     
  });
  
   // Construct conflicting examples in util2.js********************
  conflitExamples();
      
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].fields.entity_text)
      optArray.push(nodes[i].fields.entity_text);
  }
  optArray = optArray.sort();
  $(function () {
      $("#search").autocomplete({
          source: optArray
      });
  });

  console.log("Number of nodes: "+nodes.length);
  console.log("Number of links: "+links.length);

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svgOverview.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke", function(l){
         return getColor(l.type);
      })
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 1);

  var node = svgOverview.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 2)
      .style("fill", "#444")
      .style("stroke", "#eee")
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 0.3)
      .call(force.drag)
      .on("click", click1)
      .on('mouseover', function(d) {
        svgOverview.selectAll(".node")
          .style("stroke" , function(d2){
            if (d.id==d2.id){
              return "#000";
            }
          })
          .style("stroke-width" , function(d2){
            if (d.id==d2.id){
              return 5;
            }
          });   
      })
      .on('mouseout', function(){
         svgOverview.selectAll(".node")
          .style("stroke-width" ,0);  
      }); 
  function click1(d){
    secondLayout(d.id);
  }   

  node.append("title")
      .text(function(d) { return d.fields.entity_text; });
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
  secondLayout(35);
});


// Update the overview graph when we change the second layout
function update1(d) {  
  svgOverview.selectAll(".link")
    .style("stroke-opacity", function(l){
      if (nameToNode2[l.source.fields.entity_text]
        && nameToNode2[l.target.fields.entity_text])
        return 0.8;
      else
        return 0.1;
    });
  svgOverview.selectAll(".node")
    .style("fill-opacity", function(d){
      if (nameToNode2[d.fields.entity_text]!=undefined)
        return 1;
      else
        return 0.1;
    });  

}

var node_drag = d3.behavior.drag()
    .on("dragstart", dragstart)
    .on("drag", dragmove)
    .on("dragend", dragend);
function dragstart(d, i) {
  force2.stop() // stops the force auto positioning before you start dragging
  forceLabel.stop();
}
function dragmove(d, i) {
  d.px += d3.event.dx;
  d.py += d3.event.dy;
  d.x += d3.event.dx;
  d.y += d3.event.dy;  

  link2.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });     
  node2.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  update2();  
}
function dragend(d, i) {
  d.fixed = true;// of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
  force2.resume();
  forceLabel.resume();
}
function releasenode(d) {
  
}
