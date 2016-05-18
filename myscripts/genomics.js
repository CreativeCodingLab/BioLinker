var cBioPortalData = {};

function getGenomics(){
	var str ="";
    nodes2.forEach(function(d,i){
    	var text = d.ref.fields.entity_text;
    	if (cBioPortalData[text]==undefined){
    		cBioPortalData[text] = {};
    		cBioPortalData[text].altered=-1;
	    	if (str=="")
	      		str+=text;
	      	else 
	      		str+=","+text;
      	}
    });
    console.log("cBioPortal names= "+str);
  	
  	if (str=="")  
		updateNodeColors(); 
  	else{
	    var request = '/pcviz/cancer/context/blca_tcga_pub/mutation,cna,exp/'+str;   //PIK3CA,Akt,p70,TRAF6,Src,ERK,Ras,NFkappaB,IL6,IL1R,IGF1,pioglitazone,PTK6,Acrp30,p110alpha,Insulin,Myostatin,PKC,PI3K,hUCBSC,dasatinib,EGFR,HGF,result,Met,Abl,CskKD,Cox,PI3kinase,CagA,CX3CL1,IRAK,IL8,damage,MMP12,tobacco,SL327,cocaine,sorafenib,FGF,p16INK4A,Rb,TheMEK,p65,NOS,actin,TGFbeta1,pERK,CXCL12,cisplatin,PKCdelta,TNFalpha,bFGF,STAT5,GTP,CD45+,HRas,cRaf,genistein,AID,IKKDN,BCR,IKK,RANKL,prdm1,BCG,MOL294,PMX464,CDK,Tax,curcumin,LPS,SAA3,DR5,undefined,PDTC,SN50,sodium,salicylate,syntenin,Nnat,ANGII,OVA,CyP,IL1beta,EDN,AR,PGN,PAF,GSK3,STAT3,HPs,gp120,Tat,Th1,EGCG,DNFB'
		d3.json('http://localhost:8777' + request, function(error, json) {
			if (error) {
				console.warn("warn: "+error);
				updateNodeColors();
				return;
			}	
		})
		 .get()
		 .on('load', function(d) { 
		 	console.log(d); 
		 	for (key in d) {
		 		cBioPortalData[key] = d[key];
		 	}	
		    updateNodeColors();	 		
		});   
	} 
}

function updateNodeColors(){
	var maxAlter = 0;
    for (key in cBioPortalData) {
      if (cBioPortalData[key].altered > maxAlter)
      	maxAlter = cBioPortalData[key].altered;
    }

    if (maxAlter>0){
   		var sc = d3.scale.linear()
	      .domain([0, maxAlter])
	      .range([222, 0]);

	    svg2.selectAll(".node")
	      .style("fill" , function(d){
	        if (cBioPortalData[d.ref.fields.entity_text]){
	       		if (cBioPortalData[d.ref.fields.entity_text].altered>=0) {	
		          var altered = cBioPortalData[d.ref.fields.entity_text].altered;
		          var sat = Math.floor(sc(altered));
		          console.log("Protein: "+d.ref.fields.entity_text+" altered="+altered+"sat="+sat+" maxAlter"+maxAlter);
		          return "rgb("+222+", "+sat+", "+222+")" ;
	          	}
	          	else
	          	  return "rgb("+240+", "+240+", "+240+")" ;
	        }  
	        else
	          return "rgb("+0+", "+0+", "+200+")" ;
	    });  
    } 
}	

