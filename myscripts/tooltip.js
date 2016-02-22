var tipWidth = 250;
var tipSVGheight = 500;
var tip_svg;
var y_svg;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-(tipSVGheight),-tipWidth/2]);

function checkMouseOut(d, tipItem){
  var isOut=false;
   var coordinate = d3.mouse(tipItem);
  //console.log ("  mouseout"+d3.mouse(this));
  if (coordinate[0]<0 || coordinate[0]>=tipWidth+20 || coordinate[1]<=0 || coordinate[1]>=tipSVGheight+11){
    console.log ("******"+coordinate);
    isOut = true;
  }
  return isOut;
}

function showTip(d) {
  tip.show(d);
  tip_svg = d3.select('.d3-tip').append('svg')
      .attr("width", tipWidth)
      .attr("height", tipSVGheight)
      ;



  d3.select('.d3-tip')
  .on("mouseout", function(){
    if (checkMouseOut(d, this))
      tip.hide(d);
    /*
    var coordinate = d3.mouse(this);
    console.log ("  mouseout"+d3.mouse(this));
    if (coordinate[0]<0 || coordinate[0]>=tipWidth+20 || coordinate[1]<=0 || coordinate[1]>=tipSVGheight+20){
      console.log ("******");
      tip.hide(d);
    }*/
     
  })
  y_svg = 0; // inital y position     
  addText(d);
  addDotplots(d,"type");
  addDotplots(d,"Context_Species");
  addDotplots(d,"Context_Organ");
  addDotplots(d,"Context_CellType");
}     

function addText(d){
   var curNode = d;
  if (curNode.ref!=undefined){
      curNode = curNode.ref;
  }

  var list =[];
  for (key in curNode.fields) {
    var e = new Object;
    e.key = key;
    e.value = curNode.fields[key];
    list.push(e);
  }  

    tip_svg.selectAll(".tipText").data(list)
      .enter().append('text')
      .attr("class", "tipText")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("x", 10)
      .attr("y", function(d2){ 
        y_svg+=15; 
        return y_svg;
      })
      .style("text-anchor", "start")
      .text(function(d2){
        return d2.key+": "+d2.value;
      })
      .style("fill", "#444");
  //}
}

function addDotplots(d,fieldName){
  y_svg += 20; // inital y position     
  var curNode = d;
  if (curNode.ref!=undefined){
      curNode = curNode.ref;
  }



  curNode.directLinks.sort(function (a, b) {
      if (a.type > b.type) {
          return 1;
      }
      if (a.type < b.type) {
          return -1;
      }
      return 0;
  }); 

     // Compute statistics for neighbors ***************************************
    var types = new Object();
    for (var i=0; i<curNode.directLinks.length;i++){
      var l = curNode.directLinks[i];
      if (types[l[fieldName]]==undefined){
          types[l[fieldName]] = new Object();
          types[l[fieldName]].count = 1;
      }
      else{
          types[l[fieldName]].count++;   
      }
      if (types[l[fieldName]].list==undefined)
        types[l[fieldName]].list = [];
      types[l[fieldName]].list.push(l); 
    }
    if (d["tip_"+fieldName]==undefined){
      d["tip_"+fieldName] = [];
      for (key in types) {
        var e= new Object;
        e[fieldName] = key;
        e.count= types[key].count;
        e.list= types[key].list;        
        e.isEnable = true;
        e.backgroundColor = "#fff";
        e.stroke= "#000";
        e.y = y_svg;  
        y_svg+=14;  // the next y position
        d["tip_"+fieldName].push(e);
        d["tip_"+fieldName][e[fieldName]] =e; // hash from type to the actual element
      }
    }
  
    // background rows ********************************************************
    tip_svg.selectAll(".tipTypeRect_"+fieldName).data(d["tip_"+fieldName])
      .enter().append('rect')
      .attr("class", "tipTypeRect_"+fieldName)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", 0)
      .attr("y", function(d2, index){
        return d2.y;
      })
      .attr("width", tipWidth)
      .attr("height", 14)
      .style("text-anchor", "end")
      .style("fill", function(d2,index){
        return d2.backgroundColor;
      })
      .style("stroke-width", 0.1)
      .style("stroke", function(d2){
        return d2.stroke;
      })
      .on('mouseover', mouseoverType)
      .on('mouseout', mouseoutType)
      .on('click', clickType);
     


    tip_svg.selectAll(".tipTypeText_"+fieldName).data(d["tip_"+fieldName])
      .enter().append('text')
      .attr("class", "tipTypeText_"+fieldName)
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("x", 110)
      .attr("y", function(d2){return d2.y;})
      .attr("dy", "0.90em")
      .style("text-anchor", "end")
      .text(function(d2){
        return d2[fieldName];
      })
      .style("fill", function(d2){
         return getColor(d2[fieldName]);
      })
      .on('mouseover', mouseoverType)
      .on('mouseout', mouseoutType)
      .on('click', clickType);

    function mouseoverType(d){
      tip_svg.selectAll(".tipTypeRect_"+fieldName)
          .style("fill" , function(d2){
            if (d[fieldName]==d2[fieldName]){
              return "#fca";
            }
            else
              return d2.backgroundColor;
      });  
    } 

    function mouseoutType(d2){
      setTypeColor(d2);
    } 
    function clickType(d2){
      d2.isEnable = !d2.isEnable;
      setTypeColor(d2);
    } 

    function setTypeColor(d2){
      tip_svg.selectAll(".tipTypeRect_"+fieldName)
        .style("fill" , function(d4){
            return d4.backgroundColor;
        })
        .style("stroke" , function(d4){
         if (d4.isEnable==true)
            return d4.stroke;
            
        });   
      tip_svg.selectAll(".tipTypeText_"+fieldName)
        .style("fill-opacity" , function(d4){
          if (d4.isEnable==true)
            return 1;
          else 
            return 0.15;
        }); 

      tip_svg.selectAll(".tipTypeDot_"+fieldName)
        .style("fill-opacity" , function(d4){
          var tipdata;
          for (var i=0;i<d["tip_"+fieldName].length;i++){
             if (d["tip_"+fieldName][i][fieldName]==d4[fieldName]) 
                tipdata = d["tip_"+fieldName][i];
          }
          if (tipdata.isEnable==true)
            return 1;
          else 
            return 0.1;
        })   
    }

    var dotRadius =4;    
    tip_svg.selectAll(".tipTypeDot_"+fieldName).data(curNode.directLinks)
      .enter().append('circle')
      .attr("class", "tipTypeDot_"+fieldName)
        .attr('r',dotRadius)
        .attr('cx',function(l, index){
          if (types[l[fieldName]].currentIndex==undefined){
            types[l[fieldName]].currentIndex=0;
          }
          else{
            types[l[fieldName]].currentIndex++;
          }
          return 120+types[l[fieldName]].currentIndex*2*dotRadius;
        })
        .attr('cy',function(l){
          return  d["tip_"+fieldName][l[fieldName]].y+7;  // Get the y position of a type
        })
        .style("fill", function(d2){
           return getColor(d2.type);
        });

    d["tip_"+fieldName].forEach(function(d2){   // make sure disable types are greyout on the second mouse over
      mouseoutType(d2);
    });   

  /*  // Add control buttons
  if (d["tip_"+fieldName]==undefined){
      d["tip_"+fieldName] = [];
      for (key in types) {
        var e= new Object;
        e[fieldName] = key;
        e.count= types[key].count;
        e.isEnable = true;
        e.backgroundColor = "#000";
        d["tip_"+fieldName].push(e);
        d["tip_"+fieldName][e[fieldName]] =e; // hash from type to the actual element
      }
  }*/

}