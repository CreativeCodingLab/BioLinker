
var mWidth = 800;

// vertex is the input node which contains neighbors information
var compareList = {};
var array2D;
var cellSize = 10;
var cellSpacing = 2;
var cellMarginX = 20;
var cellMarginY = 50;
var numCards = 0;

function drawMatrix(){
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
  cellSize = Math.min(20,(width/3-cellMarginX-40)/numCards);
  cellSpacing = cellSize/10;

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
    .style("stroke-width", 0)
    .on("mouseover", function(d){
      g3.selectAll(".cells"+d.rowId+"__"+d.columnId)
        .style("fill", "#f0d"); 

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
        .style("fill", function(d2){
          return d2.fill;
        }); 
      for (var i=0;i<tlinks.length;i++){
        tlinks[i].mouseover = false;
      }  
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
    .attr("d", cellArc1);   

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
    .attr("d", cellArc2);         
  
  // Draw index cards text 
  var fontSize = Math.min(cellSize,10);
  g3.selectAll(".cardTexts").data(tlinks).enter().append("text")
    .attr("class", "cardTexts") 
    .attr("font-family", "sans-serif")
    .attr("font-size", fontSize+"px")
    .attr("x", 0)
    .attr("y", 0)
    .text(function(d){
      return d.source.ref.fields.entity_text+" - "+d.target.ref.fields.entity_text;
    })
    .attr("transform", function (d,i){
      var xText = cellMarginX+i*(cellSpacing + cellSize)+fontSize/3;
      var yText = cellMarginY+i*(cellSpacing + cellSize)+cellSize-fontSize/10;
      return "translate("+xText+","+yText+") rotate(-30)"
    })
    .style("text-anchor", "start")
    .style("fill", "#000");         
  
  // Download potential conflicts data  
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

        d3.json('http://ccrg-data.evl.uic.edu/index-cards/api/IndexCards/compare')
        .header('Content-Type', 'application/json')
        .post(JSON.stringify(postData))
        .on('load', function(d) { 
          //console.log("potentialConflict:"+d.response.comparsion.potentialConflict
          //  +" A="+d.response.cardA.rowId+" B="+d.response.cardB.columnId+" score="+d.response.comparsion.score);
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
   debugger;
 
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
  // Update matrix *****************************************
  for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      g3.selectAll(".arcs1"+i+"__"+j)
        .style("stroke-opacity", function (d) {
          if (d.column.mouseover== true){
            console.log("mouseover="+d.column.mouseover+" i="+i+" j="+j+" "+d.rowId+"__"+d.columnId);  
            return 1;    
          }
          else
            return 0.1;  
        })   
    }
  }
  debugger;
      
}
function resetLinks() {
  // Update matrix *****************************************
  for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      g3.selectAll(".arcs1"+i+"__"+j)
        .style("stroke-opacity", 1)   
    }
  }
}
