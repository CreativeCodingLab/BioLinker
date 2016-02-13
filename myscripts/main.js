
// Same protein for source and target
// Change stoke for expanded nodes
// Display all index cards for a link
// Context data

//Constants for the SVG
var margin = {top: 0, right: 0, bottom: 5, left: 15};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

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
    .charge(-20)
    .linkDistance(15)
    .gravity(0.05)
    //.friction(0.5)
  //  .alpha(0.1)
    .size([width, height]);

var force2 = d3.layout.force()
    .charge(-100)
    .linkDistance(50)
    .gravity(0.1)
    //.friction(0.5)
  //  .alpha(0.1)
    .size([width, height]);


/*
var myPromise = new Promise(function(resolve) {
    d3.tsv("data/imdb1.tsv", function(error, data_) {
        data_.map(function(d){
            console.log(d);
        });
        resolve(data_);
    })
})

myPromise.then(function(data) {
    console.log("This is tuan**************");
    console.log(data.length)
})

var myPromise = new Promise(function(resolve) {
        func1;
       resolve(data_);
    })
})
  
myPromise.then(function(data) {
    func2()
    return 123123
}).then(function(dat) {
    func3()
})*/


svg2.call(tip);  

var nodes = [];
var links = [];
var nodes2 = [];
var links2 = [];

var nameToNode={};
var nameToNode2;
var data3;
var isDisplayingPopup;


drawColorLegend();
//d3.json("data/cards-for-time-arcs.json", function(error, data_) {
d3.json("data/cardsWithContextData.json", function(error, data_) {
    data3 = data_;
    data3.forEach(function(d, index){ 
      if (index<2000) {  // Limit to 1000 first index cards ********************************************
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
        l.name = node1.fields.entity_text+"__"+node2.fields.entity_text;
        links.push(l);
      }     
    });
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
      .call(force.drag)
      .on("click", click1)
      .on('mouseover', function(d) {
        svg.selectAll(".node")
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
         svg.selectAll(".node")
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

  secondLayout(17);

});

// Update the overview graph when we change the second layout
function update1(d) {  
  svg.selectAll(".link")
    .style("stroke-opacity", function(l){
      var lName = l.source.fields.entity_text+"__"+l.target.fields.entity_text;
      if (links2[lName]!=undefined)
        return 0.8;
      else
        return 0.1;
    });
  svg.selectAll(".node")
    .style("fill-opacity", function(d){
      if (nameToNode2[d.fields.entity_text]!=undefined)
        return 1;
      else
        return 0.1;
    });  
}


// Second layout *************************************************************************
function secondLayout(selected){ 
  svg2.selectAll(".link").remove();
  svg2.selectAll(".node").remove();
  links2 = [];
  nodes2 = [];   
  nameToNode2={}; 
  isDisplayingPopup = false;  
    
    // Add one example node when initialized
    var newNode = new Object();
    newNode.ref = nodes[selected];
    newNode.x = nodes[selected].x;;
    newNode.y = -10;
    nodes2.push(newNode);
    nameToNode2[nodes[selected].fields.entity_text] = newNode; 

    addNodes();
    update1(); // Update the overview graph 
    
    update2();
    
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
                 return getColor(l.type);
              })
              .style("stroke-opacity", 0.5)
              .style("stroke-width",function(l){
                 return l.count;
              })

        svg2.selectAll(".node")
            .data(nodes2)
            .enter().append("circle")
              .attr("class", "node")
              .attr("r", function(d) {
                var curNode = d;
                if (curNode.ref!=undefined){
                    curNode = curNode.ref;
                }
                // Compute direct links ********************************
                if (curNode.directLinks==undefined){
                    curNode.directLinks = [];
                    for (var i=0; i<links.length;i++){
                        var l = links[i];
                        if (curNode==l.source || curNode==l.target){
                            curNode.directLinks.push(l);
                        }
                    }
                }
                return 2+Math.pow(curNode.directLinks.length, 0.4);    
              })
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
              .on("click", click2)
              .on('mouseover', function(d) {
                showTip(d); 
              });
              
              //.on('mouseout', tip.hide); 
    }    
    
    
    function update2() {
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
     
     function click2(d) {
        isDisplayingPopup = !isDisplayingPopup;
        if (isDisplayingPopup){

        }
        else{
          tip.hide(d);
          expand2(d);
        }
     } 
    // Toggle children on click.
    function expand2(d) {
      //if (!d3.event.defaultPrevented) {
        var curNode = d;
        if (curNode.ref!=undefined){
            curNode = curNode.ref;
        }
    
        var count=0;
        for (var i=0;i<curNode.directLinks.length;i++){
          var l = curNode.directLinks[i];
          if (links2[l.name]==undefined){
            var neighbor;
            if (curNode==l.source){
                neighbor = l.target;
            }
            else if (curNode==l.target){
                neighbor = l.source;
            }   
            var neighborNode;
            if (nameToNode2[neighbor.fields.entity_text]==undefined){
              var neighborNode = new Object();
              neighborNode.ref = neighbor;
              nodes2.push(neighborNode);
              nameToNode2[neighbor.fields.entity_text] = neighborNode;
            }
            else{
              neighborNode = nameToNode2[neighbor.fields.entity_text];
            }

            var newLink = new Object();
            newLink.source = d;
            newLink.target = neighborNode;
            newLink.type = l.type;
            newLink.count = 1;
            links2.push(newLink);
            links2[l.name] = newLink;
            count++;
          } 
          else{
            links2[l.name].count++;
          } 
        }
      
        addNodes();   
        update2();
        update1(); // Update the overview graph  
    }  
  }  



