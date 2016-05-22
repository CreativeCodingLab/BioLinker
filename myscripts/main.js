
// Same protein for source and target
// Change stoke for expanded nodes
// Display all index cards for a link
// Context data

//Constants for the SVG
var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

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
var labelAnchors = [];
var labelAnchorLinks = [];

var nameToNode={};
var nameToNode2;
var data3;
var isDisplayingPopup;

var pmcData = {}; // Save PMC data to reduce server request 
var pmcDataAll = {}; // Save PMC data to reduce server request 
var optArray = [];   // FOR search box


drawColorLegend();



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


//d3.json("data/cards-for-time-arcs.json", function(error, data_) {
d3.json("data/cardsWithContextData.json", function(error, data_) {
    data3 = data_;
    var linkNames = {};
    data3.forEach(function(d, index){ 
      if (0<index && index<3000) {  // Limit to 1000 first index cards ********************************************
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
   
        var node1 = processNode(a);
        var node2 = processNode(b);
        var l = new Object();
        l.source = node1;
        l.target = node2;
        l.type = type;
        l.evidence = e;
        l["Context_Species"] = d.extracted_information.context.Species;
        l["Context_Organ"] = d.extracted_information.context.Organ;
        l["Context_CellType"] = d.extracted_information.context.CellType;
        l.pmc_id = d.pmc_id;
        l.name = node1.fields.entity_text+"__"+node2.fields.entity_text;
        l.ref = d;
        if (linkNames[l.name+"_"+l.pmc_id]==undefined){
          links.push(l);
          linkNames[l.name+"_"+l.pmc_id] = l;
        }
        
      }     
    });
    
    // Construct conflicting examples ********************
    var list = {};
    links.forEach(function(l){
      if (list[l.name]==undefined)
        list[l.name] =[];
      list[l.name].push(l) 
    });

    svg2.append('text')
      .attr("class", "buttonTitle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("x", width-80)
      .attr("y", 14)
      .text("Conflicting examples:")
      .style("text-anchor", "middle")
      .style("fill", "#000");
     
    var a = [];
    for (var key in list) {
      if (list[key].length>1){
        var isIncrease = false;
        var isDecrease = false;
        for (var i=0; i<list[key].length;i++){
          if (list[key][i].type=="increases_activity")
            isIncrease = true;
          if (list[key][i].type=="decreases_activity")
            isDecrease = true;
        }
        if (isIncrease && isDecrease){
          console.log("key=" + key + "= " + list[key]);
          a.push(key);
        }
      }
    }
    var buttonWidth =130;
    var buttonheight =15;
    var roundConner = 4;
    var colorHighlight = "#f80";
    var buttonColor = "#ddd";

    svg2.selectAll(".buttonText").data(a).enter()
      .append('text')
      .attr("class", "buttonText")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("x", width-buttonWidth/2-2)
      .attr("y", function(d,i){
        return 31+i*buttonheight;
      })
      .text(function(d){
        return d;
      })
      .style("text-anchor", "middle")
      .style("fill", "#000");
    svg2.selectAll(".buttonRect").data(a).enter()
      .append('rect')
      .attr("class", "buttonRect")
      .attr("x", width-buttonWidth-2)
      .attr("y", function(d,i){
        return 20+i*buttonheight;
      })
      .attr("rx", roundConner)
      .attr("ry", roundConner)
      .attr("width", buttonWidth)
      .attr("height", buttonheight)
      .style("stroke", "#000")
      .style("stroke-width", 0.1)
      .style("fill", function(d){
        if (d=="TGF-beta__IL-17" || d=="EGCG__MMP-13")
          return "#f88";
        else if (list[d].length>2)
          return "#888";
        else 
          return buttonColor;
      })
      .style("fill-opacity", 0.3)
      .on('mouseover', function(d2){
        svg2.selectAll(".buttonRect")
            .style("fill", function(d4){
              if (d4==d2)
                return colorHighlight;
              else if (list[d4].length>2)
                return "#888";
              else  
                return buttonColor;
            });
      })
      .on('mouseout', function(d2){
        svg2.selectAll(".buttonRect")
            .style("fill", function(d4){
                if (d4=="TGF-beta__IL-17" || d4=="EGCG__MMP-13")
                  return "#f88";
                else if (list[d4].length>2)
                  return "#888";
                else 
                  return buttonColor;
            });
      })
      .on('click', function(d2){
         svg2.selectAll(".buttonRect")
          .style("stroke-width", function(d4){
            if (d4==d2)
              return 1;
            else  
              return 0.1;
         });

        secondLayout(list[d2][0].source.id);

      });         
    
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
 secondLayout(0);
  // secondLayout(18);
});


// Update the overview graph when we change the second layout
function update1(d) {  
  svgOverview.selectAll(".link")
    .style("stroke-opacity", function(l){
      var lName = l.source.fields.entity_text+"__"+l.target.fields.entity_text;
      if (links2[lName]!=undefined)
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


// Second layout *************************************************************************
function secondLayout(selected, isSource){   // isSource: is the selected node a source node
  if (isSource== true || isSource==undefined){
    svg2.selectAll(".link").remove();
    svg2.selectAll(".link2").remove();
    svg2.selectAll(".node").remove();
    svg2.selectAll(".anchorNode").remove();
    svg2.selectAll(".anchorLink").remove();
    labelAnchors = [];
    labelAnchorLinks = [];
    nodes2 = [];   
    links2 = [];
    nodes2 = [];   
    nameToNode2={}; 
    isDisplayingPopup = false;  
  }  
  // Add one example node when initialized
  var newNode = new Object();
  newNode.ref = nodes[selected];
  newNode.x = nodes[selected].x;;
  newNode.y = -10;

  if (isSource== true){
    newNode.x =50;
    newNode.y =450;
    newNode.fixed =true;
  }
  else if (isSource== false){ // target node
    newNode.x =width-50;
    newNode.y =450;
    newNode.fixed =true;
  }

  nodes2.push(newNode);
  nameToNode2[nodes[selected].fields.entity_text] = newNode; 

  addNodes();
  update1(); // Update the overview graph 
  update2();

  // Add label of the new node
  labelAnchors.push({
    node : newNode
  });
  labelAnchors.push({
    node : newNode
  });   
  var labelLink = {};
  labelLink.source = labelAnchors[labelAnchors.length-2];
  labelLink.target = labelAnchors[labelAnchors.length-1];
  labelLink.weight = 1;
  labelAnchorLinks.push(labelLink);
  nameToNode2[newNode.ref.fields.entity_text] = newNode;

  expand2(newNode);
  
  drawTimeArcs(); 
  drawMatrix();
  addStacking(); 

  //nodes2.forEach(function(d){   // Expand the second level *******************
  //    expand2(d);
  //  });
  

  
  // Download Genomics data from cBioPortal ************************************
  getGenomics(nodes[selected].fields.entity_text);
 
  

  //http://www.pathwaycommons.org/pcviz/cancer/context/blca_tcga_pub/mutation,cna,exp/PIK3CA,Akt,p70,TRAF6,Src,ERK,Ras,NFkappaB,IL6,IL1R,IGF1,pioglitazone,PTK6,Acrp30,p110alpha,Insulin,Myostatin,PKC,PI3K,hUCBSC,dasatinib,EGFR,HGF,result,Met,Abl,CskKD,Cox,PI3kinase,CagA,CX3CL1,IRAK,IL8,damage,MMP12,tobacco,SL327,cocaine,sorafenib,FGF,p16INK4A,Rb,TheMEK,p65,NOS,actin,TGFbeta1,pERK,CXCL12,cisplatin,PKCdelta,TNFalpha,bFGF,STAT5,GTP,CD45+,HRas,cRaf,genistein,AID,IKKDN,BCR,IKK,RANKL,prdm1,BCG,MOL294,PMX464,CDK,Tax,curcumin,LPS,SAA3,DR5,undefined,PDTC,SN50,sodium,salicylate,syntenin,Nnat,ANGII,OVA,CyP,IL1beta,EDN,AR,PGN,PAF,GSK3,STAT3,HPs,gp120,Tat,Th1,EGCG,DNFB

  // Query to 3 millions index cards database ********************************
  /*  console.log("-------");
        var api_base = 'http://ccrg-data.evl.uic.edu/index-cards/api/';
        var text = "E2F1";
        var filter = { "where": { "entity_text": text } };
        var part_query = api_base + 'Participants?filter=' + JSON.stringify(filter);
        new Promise(function(resolve) {
          d3.json(part_query, function(p) { resolve(p); })
        })
          .then(function(participants) {
            var part_id = participants[0].id;
            var cards_query = api_base + "Participants/" + part_id  + "/indexCards";
            return new Promise(function(resolve) {
              d3.json(cards_query, function(d) { 
                resolve(d);
                 })
            });
          })
          .then(function(cards) {
            var promises = cards.map(function(card) {
              //debugger;
              //console.log("card.id="+card.id);
              if (pmcDataAll[card.nxmlId]==undefined){     
                var nxml_query = api_base + 'IndexCards/' + card.id + '/nxml';
                return new Promise(function(resolve) {
                  d3.json(nxml_query, function(d) { 
                    pmcDataAll[card.nxmlId]=d.articleFront;
                    resolve(d);
                  })
                })
              }
            });
            return Promise.all(promises);
          })
          .then(function(d) { 
            debugger;
            console.log(d) });*/
}

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
        if (l.list.length>1){
          for (var i=0; i<l.list.length;i++){
            if (l.list[i].type!=l.type)
               return "#888";
          }
          return getColor(l.type);
        }
        else
          return getColor(l.type);
      })
      .style("stroke-opacity", 0.5)
      .style("stroke-width",function(l){
         return 1+Math.sqrt(l.list.length-1);
      })
      .on('mouseover', function(d) {
        showTip(d); 
      })
      .on('mouseout', function(d) {
        tip.hide(d); 
     //   removeTimeArcs();
      });

    svg2.selectAll(".link2")
      .data(links2)
      .enter().append("line")
      .attr("class", "link2")
      .style("stroke", "#000")
      .style("stroke-opacity", 0)
      .style("stroke-width",function(l){
         return 5+l.list.length;
      })
      .on('mouseover', function(d) {
        var a = {};
        for (var i=0;i<d.list.length;i++){
          a[d.list[i].name] = d.list[i];
        }  
        
        for (var i=0;i<tlinks.length;i++){
          if (a[tlinks[i].ref.name])
            tlinks[i].mouseover = true;
          else
            tlinks[i].mouseover = false;
        } 
        
        showTip(d); 
        updateLinks();  
        
      })
      .on('mouseout', function(d) {
        tip.hide(d); 
        resetLinks();
      });  

    nodes2.forEach(function(d){
      var curNode = d;
      if (curNode.ref!=undefined){
          curNode = curNode.ref;
      }
      // Compute direct links ******************************************************************
      if (curNode.directLinks==undefined){
        curNode.directLinks = [];
        for (var i=0; i<links.length;i++){
          var l = links[i];
          if (curNode==l.source || curNode==l.target){
            curNode.directLinks.push(l);            
          }
        }
      }
    });



   svg2.selectAll(".node").remove();
   svg2.selectAll(".node")
    .data(nodes2)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) {
        var curNode = d;
        if (curNode.ref!=undefined){
            curNode = curNode.ref;
        }
        if (curNode.directLinks)
          return 3+Math.pow(curNode.directLinks.length, 0.3);    
        else
          return 3;
      })
      .style("fill", "#888")
      .style("stroke", "#000")
      .style("stroke-opacity", 1)
      .style("stroke-width", function(d) {
        if (d.isExpanded)
            return 1;
        else 
          return 0.1;    
      })
      //.call(force2.drag)
      .call(node_drag)
      .on("click", function(d) {
        if (d.isExpanded!=true)
          click2(d); 
      })
      .on('mouseover', function(d) {
        showTip(d); 
      })
      .on('mouseout', function(d) {
        tip.hide(); 
      });
    
    // Labels **********************************************    
    forceLabel
      .nodes(labelAnchors)
      .links(labelAnchorLinks)
      .start();    

    svg2.selectAll(".anchorNode").remove();  
    svg2.selectAll(".anchorNode").data(labelAnchors).enter().append("text").attr("class", "anchorNode")
      .text(function(d, i) {
       return i % 2 == 0 ? "" : d.node.ref.fields.entity_text;
      })
      .style("fill", "#000")
      .style("text-shadow", "1px 1px 0 rgba(200, 200, 200, 0.6")                
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px");
                
   // svg2.selectAll(".anchorLink").data(labelAnchorLinks).enter()
    //  .append("svg:line").attr("class", "anchorLink").style("stroke", "#00f");

    }

  function click2(d) {
    isDisplayingPopup = !isDisplayingPopup;
    tip.hide(d);
    expand2(d);
    drawTimeArcs(); 
  // /  drawMatrix(); 
    addStacking(); 
    // Download Genomics data from cBioPortal ************************************
    getGenomics(d.ref.fields.entity_text);
 
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
          var index;
          for (var j=0; d["tip_type"] && j<d["tip_type"].length;j++){
              if (d["tip_type"][l.type]!=undefined)
                index = j; 
          }
          var tipdata;
          var fieldName="type";
          for (var i2=0; d["tip_"+fieldName] && i2<d["tip_"+fieldName].length;i2++){
             if (d["tip_"+fieldName][i2][fieldName]==l[fieldName]) 
                tipdata = d["tip_"+fieldName][i2];
          }
            
          if (!d["tip_"+fieldName] || tipdata.isEnable){  // If this type is enable
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
                
                // Labels **********************************************
                labelAnchors.push({
                  node : neighborNode
                });
                labelAnchors.push({
                  node : neighborNode
                });
                var labelLink = {};
                labelLink.source = labelAnchors[labelAnchors.length-2];
                labelLink.target = labelAnchors[labelAnchors.length-1];
                labelLink.weight = 1;
                labelAnchorLinks.push(labelLink);
                // Labels **********************************************      
                nameToNode2[neighbor.fields.entity_text] = neighborNode;
              }
              else{
                neighborNode = nameToNode2[neighbor.fields.entity_text];
              }

              var newLink = new Object();
              newLink.source = d;
              newLink.target = neighborNode;
              newLink.type = l.type;
              newLink.evidence = l.evidence;
              newLink.Context_Species = getContextFromID(l["Context_Species"][0],speciesMap);
              newLink.Context_Organ = getContextFromID(l["Context_Organ"][0],organMap);
              newLink.Context_CellType = getContextFromID(l["Context_CellType"][0],celltypeMap);
              
              
              var pcm_id = l.pmc_id;
              if (pcm_id.indexOf("PMC")<0){
                pcm_id="PMC"+pcm_id;
              }
              
              if (pmcData[pcm_id]==undefined){     
                d3.json('http://ccrg-data.evl.uic.edu/index-cards/api/NXML/'+pcm_id)
                  .header('Content-Type', 'application/json')
                  .get()
                  .on('load', function(d2) { 
                    //console.log("loaded: "+d2.id);
                    pmcData[d2.id] = d2.articleFront;
                  });
              }


              newLink.list =[];
              newLink.list.push(l);
              links2.push(newLink);
              links2[l.name] = newLink;
              count++;
            } 
            else{
              links2[l.name].list.push(l);
            } 
          }
        }
        d.ref.isExpanded = true;
        d.isExpanded = true;
        addNodes();   
        update2();
        update1(); // Update the overview graph  
    }  
    function update2() {
        node2 = svg2.selectAll(".node")
        link2 = svg2.selectAll(".link")
        node3 = svg2.selectAll(".anchorNode")
        link3 = svg2.selectAll(".anchorLink")
        force2.on("tick", tickBoth);    
        forceLabel.on("tick", tickBoth);
        function tickBoth(){
          link2.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
          svg2.selectAll(".link2").attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });  
          node2.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
          node3.each(function(d, i) {
            if(i % 2 == 0) {
              d.x = d.node.x;
              d.y = d.node.y;
              d.shiftX=0;
              d.shiftY=0;
            } 
            else {
              var b = this.getBBox();
             // debugger;
              var diffX = d.x - d.node.x; 
              var diffY = d.y - d.node.y;

              var dist = Math.sqrt(diffX * diffX + diffY * diffY);

              var shiftX = b.width * (diffX - dist) / (dist * 2);
              d.shiftX = Math.max(-b.width, Math.min(0, shiftX));
              if (d.shiftX==undefined)
                d.shiftX = 0;
              d.shiftY = 5;
            }
          });    
          link3.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
          node3.attr("x", function(d) { return d.x+d.shiftX; })
            .attr("y", function(d) { return d.y+d.shiftY; });
        }
    };    


