/* 2016 
 * Tuan Dang (on the BioLinker project, as Postdoc for EVL, UIC)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

// vertex is the input node which contains neighbors information
var compareList = {};
var array2D;
var cellSize = 10;
var cellSpacing = 0;
var cellMarginX = 10;
var cellMarginY = 35;
var numCards = 0;


function drawMatrix______________(){  // Removed
   document.getElementById("matrixHolder").style.left =  (wPublication+www+19)+"px";

  // remove the cells before
  g3.selectAll(".cardTexts").remove();
  for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      g3.selectAll(".cells"+i+"__"+j).remove();
      g3.selectAll(".arcs1"+i+"__"+j).remove();
      g3.selectAll(".arcs2"+i+"__"+j).remove();     
    }
  }

  array2D = []; 
  numCards = tlinks.length;
  console.log("numCards="+numCards);
  cellSize = Math.min(20,(wMatrix-cellMarginX-40)/numCards);
  cellSpacing = cellSize/25;

  for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      var cell = {};
      cell.row = tlinks[i];
      cell.rowId = i;
      cell.column = tlinks[j];
      cell.columnId = j;
      array2D.push(cell);
    }
  }  
  
  // Draw the matrix
  g3.selectAll(".cells").data(array2D).enter().append("rect")
    .attr("class", function(d){
      return "cells"+d.rowId+"__"+d.columnId;
    }) 
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) {
      d.x = cellMarginX+d.columnId*(cellSpacing + cellSize);
      return d.x;
    })
    .attr("y", function(d) {
      d.y = cellMarginY+d.rowId*(cellSpacing + cellSize);
      return d.y;
    })
    .style("fill-opacity", 1)
    .style("fill", function(d){
      d.fill = "#ddd";
      return d.fill;
    })
    .style("stroke", "#eed")
    .style("stroke-width", cellSpacing)
    .on("mouseover", function(d){
      g3.selectAll(".cells"+d.rowId+"__"+d.columnId)
        .style("stroke", "#000"); 
      for (var i=0;i<tlinks.length;i++){
        if (i==d.rowId || i==d.columnId)
           tlinks[i].mouseover = true;
        else
            tlinks[i].mouseover = false;
      }  
      updateLinks();
    })
    .on("mouseout", function(d){
      g3.selectAll(".cells"+d.rowId+"__"+d.columnId)
        .style("stroke", "#eed"); 
      resetLinks();  
    });

  // Draw arcs TOP cell in matrix  
  g3.selectAll(".arcs1").data(array2D).enter().append("path")
    .attr("class", function(d){
      return "arcs1"+d.rowId+"__"+d.columnId;
    }) 
    .style("fill-opacity", 0)
    .style("stroke", function (d) {
      return getColor(d.column.ref.type);
    })
    .style("stroke-width", cellSize/10)     
    .style("stroke-opacity", 1)
    .attr("d", cellArc1)
    .on("mouseover", function(d){
      g3.selectAll(".cells"+d.rowId+"__"+d.columnId)
        .style("stroke", "#000"); 
      for (var i=0;i<tlinks.length;i++){
        if (i==d.rowId || i==d.columnId)
         tlinks[i].mouseover = true;
        else
          tlinks[i].mouseover = false;
      }  
      updateLinks();
    })
    .on("mouseout", function(d){
      g3.selectAll(".cells"+d.rowId+"__"+d.columnId)
        .style("stroke", "#eed"); 
      resetLinks();  
    });   

  // Draw arcs DOWN cell in matrix  
  g3.selectAll(".arcs2").data(array2D).enter().append("path")
    .attr("class", function(d){
      return "arcs2"+d.rowId+"__"+d.columnId;
    }) 
    .style("fill-opacity", 0)
    .style("stroke", function (d) {
      return getColor(d.row.ref.type);
    })
    .style("stroke-width", cellSize/10)     
    .style("stroke-opacity", 1)
    .attr("d", cellArc2)
    .on("mouseover", function(d){
      g3.selectAll(".cells"+d.rowId+"__"+d.columnId)
        .style("stroke", "#000"); 
      for (var i=0;i<tlinks.length;i++){
        if (i==d.rowId || i==d.columnId)
         tlinks[i].mouseover = true;
        else
          tlinks[i].mouseover = false;
      }  
      updateLinks();
    })
    .on("mouseout", function(d){
      g3.selectAll(".cells"+d.rowId+"__"+d.columnId)
        .style("stroke", "#eed"); 
      resetLinks();  
    });         
  
  // Draw index cards text 
  var fontSize = Math.min(cellSize,10);
  g3.selectAll(".cardTexts").data(tlinks).enter().append("text")
    .attr("class", "cardTexts") 
    .attr("font-family", "sans-serif")
    .attr("font-size", fontSize+"px")
    .attr("x", 0)
    .attr("y", 0)
    .text(function(d){
      return d.ref.name;
    })
    .attr("transform", function (d,i){
      var xText = cellMarginX+i*(cellSpacing + cellSize)+fontSize/3;
      var yText = cellMarginY+i*(cellSpacing + cellSize)+cellSize-fontSize/10;
      return "translate("+xText+","+yText+") rotate(-30)"
    })
    .style("text-anchor", "start")
    .style("fill", "#000")
    .on("mouseover", function(d){
      for (var i=0;i<tlinks.length;i++){
        if (tlinks[i]==d)
          tlinks[i].mouseover = true;
        else
          tlinks[i].mouseover = false;
      }  
      updateLinks();
    })
    .on("mouseout", function(d){
      resetLinks();  
    });         
  
  // Download potential conflicts data 
  var count=0; 
  var maxRequests=100;
  for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      var cardI = tlinks[i].ref.ref;
      var cardJ = tlinks[j].ref.ref;
      cardI.rowId = i;
      cardJ.columnId = j;
      if (compareList[cardI._id+"__"+cardJ._id]==undefined){
        var postData = {
          cardA: cardI,
          cardB: cardJ
        }
        count++;
        // Set the upper limit for running comparator requests*************************
        if (count>maxRequests) {
          svg3.selectAll(".progressingText").remove();
          svg3.append("text")
            .attr("class", "progressingText")
            .style("text-anchor","start")
            .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
            .attr("x", wMatrix-130)
            .attr("y", 20)
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .text("Limiting "+maxRequests+" requests");

          svg3.select(".progressingText")
            .style("opacity", 1)
            .style("fill", "#00d");
          svg3.select(".progressingText").transition().duration(5000)
            .style("opacity", 0);
          break;
        }  
        d3.json(serverUrl+'/IndexCards/compare')
        .header('Content-Type', 'application/json')
        .post(JSON.stringify(postData))
        .on('load', function(d) { 
          compareList[d.response.cardA._id+"__"+d.response.cardB._id] =d;
          g3.selectAll(".cells"+d.response.cardA.rowId+"__"+d.response.cardB.columnId)
            .style("fill", function(d2){
              if (d.response.comparsion.potentialConflict)
                d2.fill = "#fc8";
              else 
                d2.fill = "#fff";
              return d2.fill;
            });
        });
      }  
      else{
        g3.selectAll(".cells"+i+"__"+j)
          .style("fill", function(d2){
            if (compareList[cardI._id+"__"+cardJ._id].response.comparsion.potentialConflict)
              d2.fill = "#fc8";
            else 
              d2.fill = "#fff";
            return d2.fill;
          });
      }
    }  
  }
}    

function cellArc1(d) {
    var dr = cellSize*0.49;
    var x1 = d.x+cellSize*0.25;
    var x2 = d.x+cellSize*0.87;
    var y1 = d.y+cellSize*0.75;
    var y2 = d.y+cellSize*0.13;
    return "M" + x1 + "," + y1 + "A" + dr + "," + dr + " 0 0,1 " + x2 + "," + y2;
}  
function cellArc2(d) {
    var dr = cellSize*0.49;
    var x1 = d.x+cellSize*0.75;
    var x2 = d.x+cellSize*0.13;
    var y1 = d.y+cellSize*0.25;
    var y2 = d.y+cellSize*0.87;
    return "M" + x1 + "," + y1 + "A" + dr + "," + dr + " 0 0,1 " + x2 + "," + y2;
}  

function updateLinks() {
  numCards = tlinks.length;
  var mouseoverNames = {};
  for (var i=0;i<numCards;i++){
    if (tlinks[i].mouseover){
      var name1 = tlinks[i].source.ref.fields.entity_text;
      var name2 = tlinks[i].target.ref.fields.entity_text;
      
      if (mouseoverNames[name1]==undefined){
        mouseoverNames[name1] = tlinks[i].source;
      }
     
      if (mouseoverNames[name2]==undefined){
        mouseoverNames[name2] = tlinks[i].target;
      }
    } 
  } 
  var fadeOpacity = 0.05;
  
  // TimeArcs ********************************
  svg4.selectAll(".linkArc")
    .style("stroke-opacity", function (d) {
      if (d.mouseover== true){
        return 1;    
      }
      else
        return fadeOpacity;  
    })  
  svg4.selectAll(".nodeText4")
    .style("fill-opacity", function (d) {
      if (mouseoverNames[d.ref.fields.entity_text]!= undefined)
        return 1;    
      else
        return fadeOpacity;  
    });
  svg4.selectAll(".nodeLine4")  
    .style("stroke-opacity", function (d) {
      if (mouseoverNames[d.ref.fields.entity_text]!= undefined){
        return 1;    
      }
      else
        return fadeOpacity;  
    });


  // Stacking ******************************** 
  fadeStacking("type");
  fadeStacking("Context_Species");
  fadeStacking("Context_Organ");
  fadeStacking("Context_CellType");
    
  function fadeStacking(fieldName){
    svgContext.selectAll(".arc_"+fieldName)
      .style("stroke-opacity", function (d) {
        if (d.mouseover== true)
          return 1;    
        else
          return fadeOpacity;  
      });
    svgContext.selectAll(".tipTypeRect_"+fieldName)
      .style("fill-opacity" , function(d2){
        for (var i=0; i<d2.list.length;i++){
          if (d2.list[i].mouseover)
            return 1;
        }
        return fadeOpacity;
      })
      .style("stroke-opacity" , function(d2){
        for (var i=0; i<d2.list.length;i++){
          if (d2.list[i].mouseover)
            return 1;
        }
        return 5*fadeOpacity;
      });     
    svgContext.selectAll(".tipTypeText_"+fieldName)
      .style("fill-opacity" , function(d2){
        for (var i=0; i<d2.list.length;i++){
          if (d2.list[i].mouseover)
            return 1;
        }
        return fadeOpacity;
      });   
      
  } 
  // Main view *****************************************
  svg2.selectAll(".node")  
    .style("fill-opacity", function (d) {
      if (mouseoverNames[d.fields.entity_text]!= undefined){
        return 1;    
      }
      else
        return fadeOpacity;  
    })
    .style("stroke-opacity", function (d) {
      if (mouseoverNames[d.fields.entity_text]!= undefined){
        return 1;    
      }
      else
        return fadeOpacity;  
    }); 
  svg2.selectAll(".anchorNode")  
    .style("fill-opacity", function (d) {
      if (mouseoverNames[d.node.fields.entity_text]!= undefined){
        return 1;    
      }
      else
        return fadeOpacity;  
    });   
  // Set mouseover for links in the main view  
  for (var i=0;i<tlinks.length;i++){
    if (tlinks[i].name.indexOf("HDI")>-1)
      //debugger;
      console.log("tlinks id:" +i);
    tlinks[i].ref.mouseover = tlinks[i].mouseover;
  }

  for (var i=0;i<links2.length;i++){
    var temp = false;
    for (var j=0;j<links2[i].list.length;j++){
      if (links2[i].list[j].mouseover==true){
        temp = true;
      }
    }
    links2[i].mouseover = temp;

    //if (links2[i].name.indexOf("HDI")>-1)
    //    console.log("links2 id:" +i);
  }

  svg2.selectAll(".link")
    .style("stroke-opacity", function (d) {
    //  if (d.name.indexOf("__EC")>-1)
    //    debugger;
      if (d.mouseover){
        return 1;    
      }
      else
        return fadeOpacity;  
    });
}
function resetLinks() {
  for (var i=0;i<tlinks.length;i++){
    tlinks[i].mouseover = false;
  }  
      
  // Update matrix *****************************************
  /*for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      g3.selectAll(".arcs1"+i+"__"+j).style("stroke-opacity", 1)  
      g3.selectAll(".arcs2"+i+"__"+j).style("stroke-opacity", 1)     
    }
  }
  g3.selectAll(".cardTexts").style("fill-opacity", 1);*/
  // TimeArcs *****************************************
  svg4.selectAll(".linkArc").style("stroke-opacity",1);
  svg4.selectAll(".nodeText4").style("fill-opacity", 1);
  svg4.selectAll(".nodeText4").transition().duration(1000)
    .attr("x", function (d) { return d.x;  });   
  svg4.selectAll(".nodeLine4").style("stroke-opacity", 1);  

  // Stacking *****************************************
  resetStacking("type");
  resetStacking("Context_Species");
  resetStacking("Context_Organ");
  resetStacking("Context_CellType");
  
  function resetStacking(fieldName){
    svgContext.selectAll(".arc_"+fieldName).style("stroke-opacity", 1);
    svgContext.selectAll(".tipTypeRect_"+fieldName).style("fill-opacity", 1).style("stroke-opacity",1);   
    svgContext.selectAll(".tipTypeText_"+fieldName).style("fill-opacity" ,1); 
  }  
  // Main view *****************************************
  svg2.selectAll(".node").style("fill-opacity", 1).style("stroke-opacity", 1); 
  svg2.selectAll(".anchorNode").style("fill-opacity", 1);   
  // Set mouseover for links in the main view  
  for (var i=0;i<tlinks.length;i++){
    tlinks[i].ref.mouseover = tlinks[i].mouseover;
  }
  for (var i=0;i<links2.length;i++){
    links2[i].mouseover = false;
  }
  svg2.selectAll(".link").style("stroke-opacity", 1);
}
