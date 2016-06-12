/* 2016 
 * Tuan Dang (on the BioLinker project, as Postdoc for EVL, UIC)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

// This is the Second layout class javasrcipt
// Second layout *************************************************************************
  
var nameToNode2={}; 
var nameToLink2={}; 

function processCard2(d, indexCard){
  var a = indexCard.extracted_information.participant_a;
  var b = indexCard.extracted_information.participant_b;
  if (a==undefined || b==undefined)
    return -1;
  a.entity_text = a.entity_text.toUpperCase();
  b.entity_text = b.entity_text.toUpperCase();

  var e = "";
  if (indexCard.evidence){
      for (var i=0;i<1;i++){
          e+= " "+indexCard.evidence[i];
      }   
  }
  var type = indexCard.extracted_information.interaction_type;
  
  var node1 = processNode2(a);
  var node2 = processNode2(b);
  var l = new Object();
  l.pmc_id = indexCard.pmc_id;
  l.name = node1.fields.entity_text+"__"+node2.fields.entity_text;
  l.source = node1;
  l.target = node2;
  l.type = type;
  l.evidence = e;
  if (indexCard.extracted_information.context){
    l["Context_Species"] = indexCard.extracted_information.context.Species;
    l["Context_Organ"] = indexCard.extracted_information.context.Organ;
    l["Context_CellType"] = indexCard.extracted_information.context.CellType;
  }
  if (nameToLink2[l.name+"_"+l.pmc_id]==undefined){
    if (d.directLinks==undefined)
      d.directLinks=[];
    d.directLinks.push(l);
  
    l.list=[];
    l.list.push(l);     
    links2.push(l);
    nameToLink2[l.name+"_"+l.pmc_id] = l;
  }
  else{
    nameToLink2[l.name+"_"+l.pmc_id].list.push(l);     
  }
}
function processNode2(fields){
  if (nameToNode2[fields.entity_text]==undefined){
      var newNode = {};
      newNode.fields = fields;
      newNode.id = nodes.length;
      nodes2.push(newNode);
      nameToNode2[fields.entity_text] = newNode;

      // Labels **********************************************
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
            
      return newNode;
  }
  else{
      return nameToNode2[fields.entity_text];
  }
}

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
    nameToLink2={}; 
    isDisplayingPopup = false;  
  }  
  // Add one example node when initialized
  var newNode = new Object();
  newNode.fields = nodes[selected].fields;
  newNode.x = 0;
  newNode.y = 0;
  nameToNode2[newNode.fields.entity_text] = newNode;

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
  
  expand2(newNode);
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
      if (force2.alpha()<=0.06){
        var a = {};
        for (var i=0;i<d.list.length;i++){
          a[d.list[i].name] = d.list[i];
        }  
        for (var i=0;i<tlinks.length;i++){
          if (a[tlinks[i].name])
            tlinks[i].mouseover = true;
          else
            tlinks[i].mouseover = false;
        } 

        showTip(d); 
        updateLinks();  
        force2.stop()
      }
    })
    .on('mouseout', function(d) {
      tip.hide(d); 
      resetLinks();
    });  

 svg2.selectAll(".node").remove();
 svg2.selectAll(".node")
  .data(nodes2)
  .enter().append("circle")
    .attr("class", "node")
    .attr("r", function(d) {
      if (d.directLinks)
        return 3+Math.pow(d.directLinks.length, 0.3);    
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
      if (force2.alpha()<=0.06){
        showTip(d); 
        force2.stop()
      }
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
     return i % 2 == 0 ? "" : d.node.fields.entity_text;
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
} 

// Toggle children on click.
function expand2(d) {
  // Query to 3 millions index cards database ********************************
  var filter = { "where": { "entity_text": d.fields.entity_text } };
  var part_query = serverUrl + '/Participants?filter=' + JSON.stringify(filter);
  new Promise(function(resolve) {
    d3.json(part_query, function(p) { resolve(p); })
  })
    .then(function(participants) {
      var part_id = participants[0].id;
      var cards_query = serverUrl + "/Participants/" + part_id  + "/indexCards";
      return new Promise(function(resolve) {
        d3.json(cards_query, function(d) { resolve(d) })
      });
    })
    .then(function(aLinks) { 
      aLinks.forEach(function(card){
        processCard2(d, card.mitreCard);
      });

      d.isExpanded = true;
      addNodes();   
      update2();
      update1(); 

      drawTimeArcs(); 
      addStacking(); 
    }); 
  getGenomics(d.fields.entity_text);  
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
