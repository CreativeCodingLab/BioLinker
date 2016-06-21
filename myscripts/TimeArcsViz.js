/* 2016 
 * Tuan Dang (on the BioLinker project, as Postdoc for EVL, UIC)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var tnodes = [];
var tlinks = [];
var nodesList = {};

var focusName ="";
var minYear = 40000;
var maxYear = 0;
var transTime = 1000;

var positions ={}; // Save positions of nodes for the new TimeArcs
var pmcData = {};
// vertex is the input node which contains neighbors information
function drawTimeArcs(){
  tnodes = [];
  tlinks = [];
  nodesList = {};
 
  for (var i=0; i<links2.length;i++){
    for (var j=0; j<links2[i].list.length;j++){
      var link = links2[i].list[j];
      var node1 = getNode(link.source);
      var node2 = getNode(link.target);
      var newlink = {};
      newlink.name = link.name;
      newlink.ref = link;
      newlink.source=node1;
      newlink.target=node2;
      tlinks.push(newlink);
    }
  }
  // Load Publication data ********************************************************
  //loadPMC();
  var arr = [];
  for (var i=0;i<tlinks.length;i++){
    var l = tlinks[i].ref;
    var pcm_id = l.pmc_id;
    if (pcm_id.indexOf("PMC")<0){
      pcm_id="PMC"+pcm_id;
    }
    if (arr[pcm_id]==undefined){
      arr.push(pcm_id);
      arr[pcm_id] = pcm_id;
    } 
  } 

  svg4.selectAll(".progressingText").remove();
  svg4.append("text")
    .attr("class", "progressingText")
    .style("text-anchor","start")
    .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
    .attr("x", 10)
    .attr("y", 20)
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .text("Start loading PMC data");

    svg4.select(".progressingText")
      .style("opacity", 1)
      .style("fill", "#00d");
    
  var promises = arr.map(function(d) {
    return new Promise(function(resolve) {
      d3.json(serverUrl+'/NXML/'+d)
        .header('Content-Type', 'application/json')
        .get()
        .on('load', function(d2) { 
         // console.log("loaded: "+d2.id);
          svg4.select(".progressingText")
           .text("Loading: "+d2.id); 
          
          pmcData[d2.id] = d2.articleFront;
          resolve(d2.articleFront);
        });
    })
  });

  Promise.all(promises).then(function(d) { 
    
    //if (nodes2.length<40)
    //  drawMatrix(); 
    //addStacking();  
    svg4.select(".progressingText")
      .text("Finish loading PMC data"); 
    svg4.select(".progressingText").transition().duration(5000)
      .style("opacity", 0);


    sort_tlinks();
    resetForce3();
    draw();
      
  });


  
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

function resetForce3(){
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
  
  var numYear = (maxYear-minYear);
  if (numYear<0)
    numYear =10;
  force3 = d3.layout.force()
    .charge(-30)
    .gravity(0.05)
    .alpha(0.1)
    .size([wPublication, wMatrix]);
  
  force3.linkDistance(function(l) {
    if (l.year){
      if (l.source.ref.isExpanded==true && l.target.ref.isExpanded==true) {
        return (maxYear-minYear)*6;  
      }   
      else
        return (l.year-minYear)*3;    


    }
    else
      return numYear*2;
  });
  force3.linkStrength(function(l) {
    if (l.year){
        return 1+(maxYear-l.year)*0.1;    
    }
    else
      return 1;      
  });
  

  // Save positions
  for (var i=0; i< tnodes.length; i++) {
    var nod = tnodes[i];
    if (positions[nod.ref.fields.entity_text]!=undefined){
      nod.x = positions[nod.ref.fields.entity_text].x;
      nod.y = positions[nod.ref.fields.entity_text].y;   
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
}  

function draw(){
  // Horizontal lines
  svg4.selectAll(".nodeLine4").remove();
  svg4.selectAll(".nodeLine4").data(tnodes).enter()
    .append("line")
    .attr("class", "nodeLine4")
    .attr("x1", function(d) {return 0;})
    .attr("y1", function(d) {return 100;})
    .attr("x2", function(d) {return 0;})
    .attr("y2", function(d) {return 100;})
    .style("stroke-width",0.2)
    .style("stroke-opacity",1)
    .style("stroke", "#000"); 


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
    .style("stroke-width",1)
    .style("stroke-opacity", 1)
  ;    

  svg4.selectAll(".linkArc2").remove();
  svg4.selectAll(".linkArc2")
    .data(tlinks).enter().append("path")
    .attr("class", "linkArc2")
    .style("stroke", function (l) {
        return getColor(l.ref.type);
    })
    .style("stroke-width", function (d) {
        return  1;
    })     
    .style("stroke-width",5)
    .style("stroke-opacity", 0)
    .on("mouseover", function(d){
      for (var i=0;i<tlinks.length;i++){
        if (tlinks[i]==d)
          tlinks[i].mouseover = true;
        else
          tlinks[i].mouseover = false;
      }  
      updateLinks();
      showTip(d); 
    })
    .on("mouseout", function(d){
      resetLinks();  
      tip.hide(d); 
    })
    .on("click",function(d){
      var id = "PMC"+d.ref.pmc_id;
      if (pmcData[id].url)
        window.open(pmcData[id].url);  
        
    });         

  svg4.selectAll(".nodeText4").remove();
  svg4.selectAll(".nodeText4").data(tnodes).enter()
    .append("text")
    .attr("class", "nodeText4")
    .text(function(d) { return d.ref.fields.entity_text})
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })          
    .style("fill","#000")
    .style("fill-opacity",1)
    .style("text-anchor","end")
    .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
    .style("font-weight", function(d) { return d.isSearchTerm ? "bold" : ""; })
    .attr("dy", ".21em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .on("mouseover", function(d){
      for (var i=0;i<tlinks.length;i++){
        if (tlinks[i].source==d || tlinks[i].target==d)
          tlinks[i].mouseover = true;
        else
          tlinks[i].mouseover = false;
      }  
      updateLinks();
    })
    .on("mouseout", function(d){
      resetLinks();  
    });
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

  var step = Math.min((wMatrix-26)/(tnodes.length+1),12);
  for (var i=0; i< termArray.length; i++) {
      tnodes[termArray[i].nodeId].y = 12+i*step;
  }
  
  tnodes.forEach(function(d){
    d.x = wPublication;
    d.x2 = 0;
  });
  svg4.selectAll(".linkArc").transition().duration(transTime).attr("d", linkArcTime);  
  svg4.selectAll(".linkArc2").transition().duration(transTime).attr("d", linkArcTime);  
  //svg4.selectAll(".node4").attr("cx", function(d) { return d.x; })
  //    .attr("cy", function(d) { return d.y; });
  svg4.selectAll(".nodeText4").transition().duration(transTime).attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
   svg4.selectAll(".nodeLine4").transition().duration(transTime)
      .attr("x1", function(d) {return d.x;})
      .attr("y1", function(d) {return d.y;})
      .attr("x2", function(d) {return d.x2;})
      .attr("y2", function(d) {return d.y;});

  var maxY = 0;    
  tnodes.forEach(function(d){
    if (d.y>maxY)
      maxY = d.y;
  });    
  svg4.selectAll(".timeLegendText").transition().duration(transTime)
    .attr("y", function(d) {return maxY+12;})

  // Save positions
  for (var i=0; i< tnodes.length; i++) {
    var nod = tnodes[i];
    if (positions[nod.ref.fields.entity_text]==undefined)
      positions[nod.ref.fields.entity_text] = {};
    positions[nod.ref.fields.entity_text].x = nod.x;
    positions[nod.ref.fields.entity_text].y = nod.y;   
  }
}

function drawTimeLegend() {
  var xScale = d3.scale.linear()
    .domain([minYear, maxYear])
    .range([40, wPublication-40]);

  var listX=[];
  var timeStep = 1+Math.floor((maxYear-minYear)/10);
  for (var i=minYear; i<=maxYear;i+=timeStep){
    var xx = xScale(i);
    var obj = {};
    obj.x = xx;
    obj.year = i;
    listX.push(obj);    
  }
  
  svg4.selectAll(".timeLegendLine").remove();
  svg4.selectAll(".timeLegendLine").data(listX)
    .enter().append("line")
      .attr("class", "timeLegendLine")
      .style("stroke", "#000") 
      .style("stroke-dasharray", "1, 2")
      .style("stroke-opacity", 1)
      .style("stroke-width", 0.2)
      .attr("x1", function(d){ return d.x; })
      .attr("x2", function(d){ return d.x; })
      .attr("y1", function(d){ return 0; })
      .attr("y2", function(d){ return www; });
  svg4.selectAll(".timeLegendText").remove();
  svg4.selectAll(".timeLegendText").data(listX)
    .enter().append("text")
      .attr("class", "timeLegendText")
      .style("fill", "#000000")   
      .style("text-anchor","start")
      .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
      .attr("x", function(d){ return d.x; })
      .attr("y", www-7)
      .attr("dy", ".21em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .text(function(d,i) { 
        return d.year;  
      });     
}


function update3(){   
  //console.log("force3="+force3.alpha());
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
      l.month = parseInt(pmcData[pmcId]["article-meta"][0]["pub-date"][0].month);
      if (l.year>maxYear)
        maxYear = l.year;
      if (l.year<minYear)
        minYear = l.year;
    }
  }
  minYear--;
  maxYear++;  
  

  tnodes.forEach(function(d){
    d.x += (wPublication/2-d.x)*0.01;      
  });
  //svg4.selectAll(".node4").attr("cx", function(d) { return d.x; })
  //    .attr("cy", function(d) { return d.y; });
  svg4.selectAll(".nodeText4").attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
    
  svg4.selectAll(".linkArc").attr("d", linkArc);   
  svg4.selectAll(".linkArc2").attr("d", linkArc);   

  drawTimeLegend();
}

function sort_tlinks() {
  tlinks.sort(function (a, b) {
    if (a.ref.type+a.ref.name > b.ref.type+b.ref.name) {
      return 1;
    }
    if (a.ref.type+a.ref.name < b.ref.type+b.ref.name) {
      return -1;
    }
    return 0;
  });  
}  

function linkArcTime(d) {
  var xScale = d3.scale.linear()
    .domain([minYear, maxYear])
    .range([40, wPublication-40]);

    var newX = xScale(d.year);
    if (newX<d.source.x)
      d.source.x = newX;
    if (newX<d.target.x)
      d.target.x = newX;  
    if (newX>d.source.x2)
      d.source.x2 = newX;
    if (newX>d.target.x2)
      d.target.x2 = newX;
    d.timeX = newX;

    var dx = 0,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy)/2;
    
    var mul=1;
    if (d.ref.type=="increases_activity")
        mul = 1.004;

    if (d.source.y<d.target.y )
        return "M" + newX + "," + (d.source.y) + "A" + dr + "," + dr*mul + " 0 0,1 " + newX + "," + (d.target.y);
    else
        return "M" + newX+ "," + (d.target.y) + "A" + dr + "," + dr*mul + " 0 0,1 " + newX+ "," + (d.source.y);
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

