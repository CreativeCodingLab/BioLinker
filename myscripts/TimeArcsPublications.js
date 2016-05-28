/* 2016 
 * Tuan Dang (on the BioLinker project, as Postdoc for EVL, UIC)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var pmcData = {}; // Save PMC data to reduce server request 

// Load Publication data ****************************
function loadPMC(curNode){        
  var arr = [];
  for (var i=0;i<curNode.directLinks.length;i++){
    var l = curNode.directLinks[i];
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
    drawTimeArcs();
    
    if (nodes2.length<40)
      drawMatrix(); 
    addStacking();  
    svg4.select(".progressingText")
      .text("Finish loading PMC data"); 
    svg4.select(".progressingText").transition().duration(5000)
      .style("opacity", 0);
  });
}


