var y_svg;
var cellHeight2 = 13;

function addStacking(){
  y_svg = width/4;
  svg.selectAll(".stackingRect").remove();
  svg.append("rect")
    .attr("class", "stackingRect")
    .attr("x", 0)
    .attr("y", y_svg)
    .attr("width", width/3)
    .attr("height", height-y_svg)
    .style("stroke-opacity",0)
    .style("fill","#fff"); 
  svg.append("rect")
    .attr("class", "stackingRect")
    .attr("x", 0)
    .attr("y", y_svg+6)
    .attr("width", width/3)
    .attr("height", height-y_svg)
    //.style("stroke","#000")
    .style("fill","#ccc"); 

  addStacking2("type", "Interaction types");
  addStacking2("Context_Species", "Context-Species", speciesMap);
  addStacking2("Context_Organ", "Context-Organ", organMap);
  addStacking2("Context_CellType", "Context-CellType",celltypeMap);
}  

function addStacking2(fieldName,label, map){
  y_svg += 25; // inital y position     
  var obj = {};
  sort_tlinks(); // In TimeArcs.js 

   // Compute statistics for neighbors ***************************************
  var types = new Object();
  for (var i=0; i<tlinks.length;i++){
    var l = tlinks[i].ref;

    var name = getContextFromID(""+l[fieldName],map);
    if (name==undefined)
      name="?";
    l[fieldName+"_name"] = name;
    if (types[name]==undefined){
        types[name] = new Object();
        types[name].count = 1;
    }
    else{
        types[name].count++;   
    }
    if (types[name].list==undefined)
      types[name].list = [];
    types[name].list.push(l); 
  }
        
  if (obj["tip_"+fieldName]==undefined){
    obj["tip_"+fieldName] = [];
    obj["ylabel_"+fieldName] = y_svg-4;
    for (key in types) {
      var e= new Object;
      e[fieldName] = key;
      e.count= types[key].count;
      e.list= types[key].list;        
      obj["tip_"+fieldName].push(e);
      obj["tip_"+fieldName][e[fieldName]] =e; // hash from type to the actual element
    }
  }
  // Sort by number of links for each type
  obj["tip_"+fieldName].sort(function (a, b) {
    if (a.count > b.count) {
      return -1;
    }
    if (a.count < b.count) {
      return 1;
    }
    return 0;
  });  
  // Initialize the type list postion and values
  obj["tip_"+fieldName].forEach(function(e){
    e.y = y_svg;  
    y_svg+=cellHeight2;  // the next y position
    e.isEnable = true;
    e.backgroundColor = "#fff";
    e.stroke= "#000";    
  });

    // Label ********************************************************
    svg.selectAll(".tiplabel_"+fieldName).remove();
    svg.append('text')
    .attr("class", "tiplabel_"+fieldName)
    .attr("x", 10)
    .attr("y", obj["ylabel_"+fieldName])
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .style("text-anchor", "start")
    .text(label)
    .style("fill", "#000");
  
    // background rows ********************************************************
    svg.selectAll(".tipTypeRect_"+fieldName).remove();
    svg.selectAll(".tipTypeRect_"+fieldName).data(obj["tip_"+fieldName])
      .enter().append('rect')
      .attr("class", "tipTypeRect_"+fieldName)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", 20)
      .attr("y", function(d2, index){
        return d2.y;
      })
      .attr("width", width/3-40)
      .attr("height", cellHeight2)
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
     

    svg.selectAll(".tipTypeText_"+fieldName).remove();
    svg.selectAll(".tipTypeText_"+fieldName).data(obj["tip_"+fieldName])
      .enter().append('text')
      .attr("class", "tipTypeText_"+fieldName)
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("x", 125)
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
      svg.selectAll(".tipTypeRect_"+fieldName)
          .style("fill" , function(d2){
            if (obj[fieldName]==d2[fieldName]){
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
      for (var i=0; i<curNode.directLinks.length;i++){
        var l = curNode.directLinks[i];
        item.isEnable = d2.isEnable;
      }
      setTypeColor(d2);
    } 

    function setTypeColor(d2){
      svg.selectAll(".tipTypeRect_"+fieldName)
        .style("fill" , function(d4){
            return d4.backgroundColor;
        })
        .style("stroke" , function(d4){
         if (d4.isEnable==true)
            return d4.stroke;
            
        });   
      svg.selectAll(".tipTypeText_"+fieldName)
        .style("fill-opacity" , function(d4){
          if (d4.isEnable==true)
            return 1;
          else 
            return 0.15;
        }); 

      svg.selectAll(".tipTypeDot_"+fieldName)
        .style("fill-opacity" , function(d4){
          var tipdata;
          for (var i=0;i<obj["tip_"+fieldName].length;i++){
             if (obj["tip_"+fieldName][i][fieldName]==d4[fieldName]) 
                tipdata = obj["tip_"+fieldName][i];
          }
          if (tipdata.isEnable==true)
            return 1;
          else 
            return 0.1;
        })   
    }

  
  
  svg.selectAll(".arc_"+fieldName).remove();
  svg.selectAll(".arc_"+fieldName).data(tlinks).enter()
    .append("path")
    .attr("class", "arc_"+fieldName)
    .style("fill-opacity", 0)
    .style("stroke", function (l) {
        return getColor(l.ref.type);
    })
    .style("stroke-width", function (d) {
        return  1.2;
    })
    .attr("d", function(l){
      if (types[l.ref[fieldName+"_name"]].currentIndex==undefined){
          types[l.ref[fieldName+"_name"]].currentIndex=0;
      }
      else{
        types[l.ref[fieldName+"_name"]].currentIndex++;
      }
      var xx = 130+types[l.ref[fieldName+"_name"]].currentIndex*2;
      var yy = obj["tip_"+fieldName][l.ref[fieldName+"_name"]].y+1.2;
      var rr = 5.2;
      return "M" + xx + "," + yy + "A" + rr + "," + rr*1.25 + " 0 0,1 " + xx + "," + (yy+rr*2);
    });  


      

  obj["tip_"+fieldName].forEach(function(d2){   // make sure disable types are greyout on the second mouse over
    mouseoutType(d2);
  });   
}

function getContextFromID(id_, map){
  if (id_.indexOf("uniprot:")>-1){
    var id = id_.replace("uniprot:","");
    return uniprotMap[id];
  }
  else if (id_.indexOf("taxonomy:")>-1){
    var id = id_.replace("taxonomy:", "");
    return map[id];
  }
  else if (id_.indexOf("uazid:")>-1){
    var id = id_.replace("uazid:", "");
    return map[id];
  } 
  else{
    return id_;
  } 
}  
