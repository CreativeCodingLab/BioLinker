var tipWidth = 300;
var tipSVGheight = 400;
var tip_svg;
var y_svg;

function showTip(d) {
  tip.show(d);
  tip_svg = d3.select('.d3-tip').append('svg')
      .attr("width", tipWidth)
      .attr("height", tipSVGheight);
  y_svg = 10; // inital y position     

  addDotplots(d,"type");

  addDotplots(d,"Context_Species");
  addDotplots(d,"Context_Organ");
  addDotplots(d,"Context_CellType");
}     

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-(tipSVGheight+10),0])
  .html(function(d) {
    var curNode = d;
    if (curNode.ref!=undefined){
        curNode = curNode.ref;
    }
    var str = "";
    for (key in curNode.fields) {
        str+= key+": <span style='color:#7ef'>" + curNode.fields[key] + "</span> <br>"
    }
    
    //str+= "<br>Number of directLinks: <span style='color:#ff8'>" + curNode.directLinks.length + "</span> <br>"
    //for (key in types) {
    //    str+= "-"+key+": <span style='color:"+getColor(key)+ "'>" + types[key] + "</span> <br>"
    //}
    str+= "<span style='color:#444'>Publication data, includes TimeArcs</span> <br>"
    str+= "<span style='color:#444'>Potential conflicts (statistics)</span> <br>"
    return str;
})


function addDotplots(d,fieldName){
  y_svg += 20; // inital y position     

  var curNode = d;
  if (curNode.ref!=undefined){
      curNode = curNode.ref;
  }
     // Compute statistics for neighbors
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
    }
    if (d["tip_"+fieldName]==undefined){
      d["tip_"+fieldName] = [];
      for (key in types) {
        var e= new Object;
        e[fieldName] = key;
        e.count= types[key].count;
        e.isEnable = true;
        e.backgroundColor = "#000";
        e.stroke= "#888";
        e.y = y_svg;  
        y_svg+=14;  // the next y position
        d["tip_"+fieldName].push(e);
        d["tip_"+fieldName][e[fieldName]] =e; // hash from type to the actual element
      }
    }
  
    // background rows  

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
      .style("stroke-width", 0.5)
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
              return "#ffc";
            }
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
        .style("fill" , function(d4){
          if (d4.isEnable==true)
            return getColor(d4[fieldName]);
          else 
            return "#333";
        }); 

      tip_svg.selectAll(".tipTypeDot_"+fieldName)
        .style("fill" , function(d4){
          var tipdata;
          for (var i=0;i<d["tip_"+fieldName].length;i++){
             if (d["tip_"+fieldName][i][fieldName]==d4[fieldName]) 
                tipdata = d["tip_"+fieldName][i];
          }
         // debugger;
          if (tipdata.isEnable==true)
            return getColor(d4.type);
          else 
            return "#222";
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

    // Add control buttons
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
  }

}