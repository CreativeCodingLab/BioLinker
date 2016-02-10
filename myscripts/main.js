//Constants for the SVG
var margin = {top: 0, right: 0, bottom: 5, left: 15};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 1000 - margin.top - margin.bottom;

//---End Insert------

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("body").append("svg")
    .style("background", "#eee")
    .attr("width", width)
    .attr("height", height);

var svg2 = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Set up the force layout
var force = d3.layout.force()
    .charge(-5)
    .linkDistance(20)
    .gravity(0.05)
    //.friction(0.5)
  //  .alpha(0.1)
    .size([width, height]);

var force2 = d3.layout.force()
    .charge(-40)
    .linkDistance(60)
    .gravity(0.1)
    //.friction(0.5)
  //  .alpha(0.1)
    .size([width, height]);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var curNode = d;
    if (curNode.ref!=undefined){
        curNode = curNode.ref;
    }
    var str = "";
    for (key in curNode.fields) {
        str+= key+": <span style='color:#7ef'>" + curNode.fields[key] + "</span> <br>"
    }

    if (curNode.directLinks==undefined){
        curNode.directLinks = [];
        for (var i=0; i<links.length;i++){
            var l = links[i];
            if (curNode==l.source || curNode==l.target){
                curNode.directLinks.push(l);
            }
        }
    }

    // Compute statistics for neighbors
    var types = new Object();
    for (var i=0; i<curNode.directLinks.length;i++){
        var l = curNode.directLinks[i];
        if (types[l.type]==undefined){
            types[l.type] =1;
        }
        else{
            types[l.type]++;   
        }
    }
    
    str+= "<br>Number of directLinks: <span style='color:#ff8'>" + curNode.directLinks.length + "</span> <br>"
    for (key in types) {
        str+= "-"+key+": <span style='color:"+getColor(key)+ "'>" + types[key] + "</span> <br>"
    }

    str+= "<br>Meta data, includes TimeArcs  for "+ curNode.fields.entity_text+"<br>"
    str+= "<br>Context data (graph)<br>"
    str+= "<br>Potential conflicts (statistics)<br>"
    
    return str;
})
// debugger
// .each(function(d) {
//     console.log(this)
// })
svg2.call(tip);  

var nodes = [];
var links = [];
var nodes2 = [];
var links2 = [];


var nameToNode={};
var nameToNode2={};

var data3;

drawColorLegend();
//d3.json("data/cards-for-time-arcs.json", function(error, data_) {
d3.json("data/outputTuan.json", function(error, data_) {
      data3 = data_;
    data3.forEach(function(d, index){ 
        //var a = d.card.extracted_information.participant_a;
        //var b = d.card.extracted_information.participant_b;
        var a = d.extracted_information.participant_a;
        var b = d.extracted_information.participant_b;
        var e = "";
        if (d.evidence){
            for (var i=0;i<1;i++){
                e+= " "+d.evidence[i];
            }   
        }
        
        var type = d.extracted_information.interaction_type;
    /*    var year = d.metadata.articleFront["article-meta"][0]["pub-date"][0].year;
        var title = d.metadata.articleFront["article-meta"][0]["title-group"][0]["article-title"][0];
            
        if (a.entity_text!=undefined && b.entity_text!=undefined){   
            var title2 = title+"";
            if (title2.indexOf("[object Object]") > -1){
                title2 = title["_"];
            }
            title = (title2+"").replace(/(\r\n|\n|\r)/gm,"");
        }*/

        var node1 = processNode(a);
        var node2 = processNode(b);
        var l = new Object();
        l.source = node1;
        l.target = node2;
        l.type = type;
        links.push(l);
           
    });
    function processNode(fields){
        if (nameToNode[fields.entity_text]==undefined){
            var newNode = {};
            newNode.fields = fields;
            nodes.push(newNode);
            nameToNode[fields.entity_text] = newNode;
            return newNode;
        }
        else{
            return nameToNode[fields.entity_text];
        }
    }
    console.log("Number of nodes: "+nodes.length);
    console.log("Number of links: "+links.length);

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke", function(l){
         return getColor(l.type);
      })
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 1);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 2)
      .style("fill", "#444")
      .style("stroke", "#eee")
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 0.3)
      .call(force.drag);

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


    // Second layout *************************************************************************
   
    var newNode = new Object();
    newNode.ref = nodes[0];
    nodes2.push(newNode);
    addNodes();
    update();
    function addNodes() {
        force2
            .nodes(nodes2)
            .links(links2)
            .start();

        svg2.selectAll(".link")
            .data(links2)
            .enter().append("line")
            .attr("class", "link")
              .style("stroke", function(l){
                //console.log("l.type="+l.type);
                 return getColor(l.type);
              })
              .style("stroke-opacity", 0.5)
              .style("stroke-width", 1);

        svg2.selectAll(".node")
            .data(nodes2)
            .enter().append("circle")
              .attr("class", "node")
              .attr("r", 4)
              .style("fill", "#444")
              .style("stroke", "#eee")
              //.style("stroke", function(d){
              //   console.log("d.name="+d.ref.fields.entity_text);
              //   return getColor(l.type);
              //})
              .style("stroke-opacity", 0.5)
              .style("stroke-width", 0.3)
              .call(force2.drag)
              // .on('mouseover', tip.show)
              .on('mouseover', function(d) {
                tip.show(d);
                var tip_element = d3.select('.d3-tip');
              })
              .on('mouseout', tip.hide)
              .on("click", click); 
    }    
    
    function update() {
      console.log("update *******");
        node2 = svg2.selectAll(".node")
        link2 = svg2.selectAll(".link")
        
        force2.on("tick", function() {
            link2.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node2.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });    

    };    
      
    // Toggle children on click.
    function click(d) {
      if (!d3.event.defaultPrevented) {
        var curNode = d;
        if (curNode.ref!=undefined){
            curNode = curNode.ref;
        }
    
        for (var i=0;i<curNode.directLinks.length;i++){
            var l = curNode.directLinks[i];
            var neighbor;
            if (curNode==l.source){
                neighbor = l.target;
            }
            else if (curNode==l.target){
                neighbor = l.source;
            }   
            var newNode = new Object();
            newNode.ref = neighbor;
            nodes2.push(newNode);

            var newLink = new Object();
            newLink.source = d;
            newLink.target = newNode;
            newLink.type = l.type;
            links2.push(newLink);
        }
         
        addNodes();   
        update();
      }
    }  
});


