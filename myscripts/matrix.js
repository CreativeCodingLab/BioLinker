
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
    .style("fill-opacity", 0)
    .style("stroke", "#bbb")
    .style("stroke-width", cellSize/50);

  // Draw arcs TOP cell in matrix  
  g3.selectAll(".arcs1").data(array2D).enter().append("path")
    .attr("class", function(d){
      return "arcs1"+d.rowId+"__"+d.columnId;
    }) 
    .style("fill-opacity", 0)
    .style("stroke", function (d) {
      if (d.rowId<d.columnId)
        return getColor(d.row.ref.type);
      else
        return getColor(d.column.ref.type);
    })
    .style("stroke-width", cellSize/20)     
    .style("stroke-opacity", 1)
    .attr("d", cellArc1);   

  // Draw arcs DOWN cell in matrix  
  g3.selectAll(".arcs2").data(array2D).enter().append("path")
    .attr("class", function(d){
      return "arcs2"+d.rowId+"__"+d.columnId;
    }) 
    .style("fill-opacity", 0)
    .style("stroke", function (d) {
      if (d.rowId<d.columnId)
        return getColor(d.column.ref.type);
      else
        return getColor(d.row.ref.type);
    })
    .style("stroke-width", cellSize/20)     
    .style("stroke-opacity", 1)
    .attr("d", cellArc2);         

      

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
            .style("stroke", function(d2){
              if (d.response.comparsion.potentialConflict)
                return "#000";
              else 
                return "#fff";
            });
            //.style("stroke-width", function(d2){
            //  return d.response.comparsion.score;
            //});
          return d; 
        });
      }  
      else{
        g3.selectAll(".cells"+i+"__"+j)
          .style("stroke", function(d2){
            if (compareList[cardI._id+"__"+cardJ._id].response.comparsion.potentialConflict)
              return "#000";
            else 
              return "#fff";
          });
      }
    }  
  }
}    

function cellArc1(d) {
    var dr = cellSize*0.54;
    var x1 = d.x+cellSize*0.22;
    var x2 = d.x+cellSize*0.88;
    var y1 = d.y+cellSize*0.78;
    var y2 = d.y+cellSize*0.12;
    return "M" + x1 + "," + y1 + "A" + dr + "," + dr + " 0 0,1 " + x2 + "," + y2;
}  
function cellArc2(d) {
    var dr = cellSize*0.54;
    var x1 = d.x+cellSize*0.78;
    var x2 = d.x+cellSize*0.12;
    var y1 = d.y+cellSize*0.22;
    var y2 = d.y+cellSize*0.88;
    return "M" + x1 + "," + y1 + "A" + dr + "," + dr + " 0 0,1 " + x2 + "," + y2;
}  
