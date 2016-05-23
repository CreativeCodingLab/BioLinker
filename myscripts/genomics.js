var cBioPortalData = {};

var studyIds = ["paac_jhu_2014","laml_tcga_pub","laml_tcga","acyc_mskcc","acc_tcga","blca_mskcc_solit_2014","blca_mskcc_solit_2012","blca_mskcc_signet_ring_impact","blca_plasmacytoid_mskcc_2016","blca_bgi","blca_dfarber_mskcc_2014","blca_tcga_pub","blca_tcga","lgg_tcga","brca_bccrc","brca_broad","brca_sanger","brca_tcga_pub2015","brca_tcga_pub","brca_tcga","brca_bccrc_xenograft_2014","cellline_ccle_broad","cesc_tcga","chol_nccs_2013","chol_nus_2012","chol_tcga","ccrcc_utokyo_2013","coadread_genentech","coadread_tcga_pub","coadread_tcga","coadread_mskcc","cscc_dfarber_2015","desm_broad_2015","esca_broad","esca_tcga","escc_icgc","escc_ucla_2014","es_iocurie_2014","gbc_shanghai_2014","egc_tmucih_2015","gbm_tcga_pub2013","gbm_tcga_pub","gbm_tcga","hnsc_broad","hnsc_jhu","hnsc_tcga_pub","hnsc_tcga","all_stjude_2015","chol_jhu_2013","kich_tcga_pub","kich_tcga","kirc_bgi","kirc_tcga_pub","kirc_tcga","kirp_tcga","lihc_amc_prv","lihc_riken","lihc_tcga","lgg_ucsf_2014","luad_broad","luad_mskcc_2015","luad_tcga_pub","luad_tcga","luad_tsp","lusc_tcga_pub","lusc_tcga","dlbc_tcga","mpnst_mskcc","mbl_broad_2012","mbl_icgc","mbl_pcgp","skcm_broad_dfarber","lgggbm_tcga_pub","meso_tcga","prad_su2c_2015","mm_broad","ccrcc_irc_2014","cellline_nci60","npc_nusingapore","nbl_amc_2012","nepc_wcm","ov_tcga_pub","ov_tcga","paad_icgc","paad_tcga","paad_utsw_2015","panet_jhu_2011","thca_tcga_pub","es_dfarber_broad_2014","pcpg_tcga","thyroid_mskcc_2016","pcnsl_mayo_2015","prad_broad_2013","prad_broad","prad_mskcc","prad_fhcrc","prad_tcga_pub","prad_tcga","prad_mskcc_2014","prad_mskcc_cheny1_organoids_2014","prad_mich","nccrcc_genentech_2014","rms_nih_2014","sarc_mskcc","sarc_tcga","skcm_broad","skcm_tcga","skcm_yale","scco_mskcc","sclc_clcgp","sclc_jhu","sclc_ucologne_2015","stad_pfizer_uhongkong","stad_tcga_pub","stad_tcga","stad_utokyo","stad_uhongkong","tgct_tcga","tet_nci_2014","thym_tcga","thca_tcga","ucs_jhu_2014","ucs_tcga","ucec_tcga","ucec_tcga_pub","uvm_tcga"];
var profileIds = ["_mutations","_gistic"];
var profileDefaultProperty = ["# DATA_TYPE	 Mutations","# DATA_TYPE	Putative copy-number alterations from GISTIC"];
var studyNames = ["Acinar Cell Carcinoma of the Pancreas (Johns Hopkins, J Pathol 2014)","Acute Myeloid Leukemia (TCGA, NEJM 2013)","Acute Myeloid Leukemia (TCGA, Provisional)","Adenoid Cystic Carcinoma (MSKCC, Nat Genet 2013)","Adrenocortical Carcinoma (TCGA, Provisional)","Bladder Cancer (MSKCC, Eur Urol 2014)","Bladder Cancer (MSKCC, J Clin Oncol 2013)","Bladder Cancer, Plasmacytoid Variant (MSKCC, Nat Genet 2016)","Bladder Cancer, Plasmacytoid Variant (MSKCC, Nat Genet 2016)","Bladder Urothelial Carcinoma (BGI, Nat Genet 2013)","Bladder Urothelial Carcinoma (Dana Farber & MSKCC, Cancer Discovery 2014)","Bladder Urothelial Carcinoma (TCGA, Nature 2014)","Bladder Urothelial Carcinoma (TCGA, Provisional)","Brain Lower Grade Glioma (TCGA, Provisional)","Breast Invasive Carcinoma (British Columbia, Nature 2012)","Breast Invasive Carcinoma (Broad, Nature 2012)","Breast Invasive Carcinoma (Sanger, Nature 2012)","Breast Invasive Carcinoma (TCGA, Cell 2015)","Breast Invasive Carcinoma (TCGA, Nature 2012)","Breast Invasive Carcinoma (TCGA, Provisional)","Breast cancer patient xenografts (British Columbia, Nature 2014)","Cancer Cell Line Encyclopedia (Novartis/Broad, Nature 2012)","Cervical Squamous Cell Carcinoma and Endocervical Adenocarcinoma (TCGA, Provisional)","Cholangiocarcinoma (National Cancer Centre of Singapore, Nat Genet 2013)","Cholangiocarcinoma (National University of Singapore, Nat Genet 2012)","Cholangiocarcinoma (TCGA, Provisional)","Clear Cell Renal Cell Carcinoma (U Tokyo, Nat Genet 2013)","Colorectal Adenocarcinoma (Genentech, Nature 2012)","Colorectal Adenocarcinoma (TCGA, Nature 2012)","Colorectal Adenocarcinoma (TCGA, Provisional)","Colorectal Adenocarcinoma Triplets (MSKCC, Genome Biology 2014)","Cutaneous squamous cell carcinoma (DFCI, Clin Cancer Res 2015)","Desmoplastic Melanoma (Broad Institute, Nat Genet 2015)","Esophageal Adenocarcinoma (Broad, Nat Genet 2013)","Esophageal Carcinoma (TCGA, Provisional)","Esophageal Squamous Cell Carcinoma (ICGC, Nature 2014)","Esophageal Squamous Cell Carcinoma (UCLA, Nat Genet 2014)","Ewing Sarcoma (Institut Cuire, Cancer Discov 2014)","Gallbladder Carcinoma (Shanghai, Nat Genet 2014)","Gastric Adenocarcinoma (TMUCIH, PNAS 2015)","Glioblastoma (TCGA, Cell 2013)","Glioblastoma (TCGA, Nature 2008)","Glioblastoma Multiforme (TCGA, Provisional)","Head and Neck Squamous Cell Carcinoma (Broad, Science 2011)","Head and Neck Squamous Cell Carcinoma (Johns Hopkins, Science 2011)","Head and Neck Squamous Cell Carcinoma (TCGA, Nature 2015)","Head and Neck Squamous Cell Carcinoma (TCGA, Provisional)","Infant MLL-Rearranged Acute Lymphoblastic Leukemia (St Jude, Nat Genet 2015)","Intrahepatic Cholangiocarcinoma (Johns Hopkins University, Nat Genet 2013)","Kidney Chromophobe (TCGA, Cancer Cell 2014)","Kidney Chromophobe (TCGA, Provisional)","Kidney Renal Clear Cell Carcinoma (BGI, Nat Genet 2012)","Kidney Renal Clear Cell Carcinoma (TCGA, Nature 2013)","Kidney Renal Clear Cell Carcinoma (TCGA, Provisional)","Kidney Renal Papillary Cell Carcinoma (TCGA, Provisional)","Liver Hepatocellular Carcinoma (AMC, Hepatology 2014)","Liver Hepatocellular Carcinoma (RIKEN, Nat Genet 2012)","Liver Hepatocellular Carcinoma (TCGA, Provisional)","Low-Grade Gliomas (UCSF, Science 2014)","Lung Adenocarcinoma (Broad, Cell 2012)","Lung Adenocarcinoma (MSKCC 2015)","Lung Adenocarcinoma (TCGA, Nature 2014)","Lung Adenocarcinoma (TCGA, Provisional)","Lung Adenocarcinoma (TSP, Nature 2008)","Lung Squamous Cell Carcinoma (TCGA, Nature 2012)","Lung Squamous Cell Carcinoma (TCGA, Provisional)","Lymphoid Neoplasm Diffuse Large B-cell Lymphoma (TCGA, Provisional)","Malignant Peripheral Nerve Sheath Tumor (MSKCC, Nat Genet 2014)","Medulloblastoma (Broad, Nature 2012)","Medulloblastoma (ICGC, Nature 2012)","Medulloblastoma (PCGP, Nature 2012)","Melanoma (Broad/Dana Farber, Nature 2012)","Merged Cohort of LGG and GBM (TCGA, 2016)","Mesothelioma (TCGA, Provisional)","Metastatic Prostate Cancer, SU2C/PCF Dream Team (Robinson et al., Cell 2015)","Multiple Myeloma (Broad, Cancer Cell 2014)","Multiregion Sequencing of Clear Cell Renal Cell Carcinoma (IRC, Nat Genet 2014)","NCI-60 Cell Lines (NCI, Cancer Res. 2012)","Nasopharyngeal Carcinoma (Singapore, Nat Genet 2014)","Neuroblastoma (AMC Amsterdam, Nature 2012)","Neuroendocrine Prostate Cancer (Trento/Cornell/Broad 2016)","Ovarian Serous Cystadenocarcinoma (TCGA, Nature 2011)","Ovarian Serous Cystadenocarcinoma (TCGA, Provisional)","Pancreatic Adenocarcinoma (ICGC, Nature 2012)","Pancreatic Adenocarcinoma (TCGA, Provisional)","Pancreatic Cancer (UTSW, Nat Commun 2015)","Pancreatic Neuroendocrine Tumors (Johns Hopkins University, Science 2011)","Papillary Thyroid Carcinoma (TCGA, Cell 2014)","Pediatric Ewing Sarcoma (DFCI, Cancer Discov 2014)","Pheochromocytoma and Paraganglioma (TCGA, Provisional)","Poorly-Differentiated and Anaplastic Thyroid Cancers (MSKCC, JCI 2016)","Primary Central Nervous System Lymphoma (Mayo Clinic, Clin Cancer Res 2015)","Prostate Adenocarcinoma (Broad/Cornell, Cell 2013)","Prostate Adenocarcinoma (Broad/Cornell, Nat Genet 2012)","Prostate Adenocarcinoma (MSKCC, Cancer Cell 2010)","Prostate Adenocarcinoma (Nelson Lab, Fred Hutchinson CRC)","Prostate Adenocarcinoma (TCGA, Cell 2015)","Prostate Adenocarcinoma (TCGA, Provisional)","Prostate Adenocarcinoma CNA study (MSKCC, PNAS 2014)","Prostate Adenocarcinoma Organoids (MSKCC, Cell 2014)","Prostate Adenocarcinoma, Metastatic (Michigan, Nature 2012)","Renal Non-Clear Cell Carcinoma (Genentech, Nat Genet 2014)","Rhabdomyosarcoma (NIH, Cancer Discov 2014)","Sarcoma (MSKCC/Broad, Nat Genet 2010)","Sarcoma (TCGA, Provisional)","Skin Cutaneous Melanoma (Broad, Cell 2012)","Skin Cutaneous Melanoma (TCGA, Provisional)","Skin Cutaneous Melanoma (Yale, Nat Genet 2012)","Small Cell Carcinoma of the Ovary (MSKCC, Nat Genet 2014)","Small Cell Lung Cancer (CLCGP, Nat Genet 2012)","Small Cell Lung Cancer (Johns Hopkins, Nat Genet 2012)","Small Cell Lung Cancer (U Cologne, Nature 2015)","Stomach Adenocarcinoma (Pfizer and UHK, Nat Genet 2014)","Stomach Adenocarcinoma (TCGA, Nature 2014)","Stomach Adenocarcinoma (TCGA, Provisional)","Stomach Adenocarcinoma (U Tokyo, Nat Genet 2014)","Stomach Adenocarcinoma (UHK, Nat Genet 2011)","Testicular Germ Cell Cancer (TCGA, Provisional)","Thymic Epithelial Tumors (NCI, Nat Genet 2014)","Thymoma (TCGA, Provisional)","Thyroid Carcinoma (TCGA, Provisional)","Uterine Carcinosarcoma (Johns Hopkins University, Nat Commun 2014)","Uterine Carcinosarcoma (TCGA, Provisional)","Uterine Corpus Endometrial Carcinoma (TCGA, Provisional)","Uterine Corpus Endometrioid Carcinoma (TCGA, Nature 2013)","Uveal Melanoma (TCGA, Provisional)"];

function getGenomics(geneName){
    console.log("getGenomics geneName= "+geneName);
  	
  	cBioPortalData[geneName] = new Object();
  	
  	if (geneName=="")  
		updateNodeColors(); 
  	else{
  		for (var p=0;p<profileIds.length;p++){  
  			cBioPortalData[geneName][p] = new Object();		 		
			for (var i=0;i<studyIds.length;i++){  
				var strServer = "http://www.cbioportal.org/webservice.do?";	
				// Profile blca_tcga_pub_gistic  blca_tcga_pub_mutations
				var study = studyIds[i];
				var profile = profileIds[p];
				var request = "cmd=getProfileData&case_set_id="+study+"_all&genetic_profile_id="+study+profile+"&gene_list="+geneName;
				var str2 = strServer+request;
				(function(request,i,p) { 	
					d3.csv(str2, function(error, json) {
					 	if (error) {
							console.warn("warn: "+error);
						//	updateNodeColors();
							return;
						}	
					})
					.get()
					.on('load', function(d) { 
					 	console.log(d); 
					 	/*for (key in d) {
					 		if (!cBioPortalData[key])
					 			cBioPortalData[key] = new Object();
					 		cBioPortalData[key][studyIds[i]] = d[key];
					 	}*/
					 	var count=0;
					 	if (d.length>0){
					 		var propertyName = profileDefaultProperty[p];
					 		//console.log("1_"+propertyName); 
					 		for (key in d[2]) {
					 			if (key.indexOf("# DATA_TYPE")>-1)
					 				propertyName = key;
					 			else if (key.indexOf("Unknown gene")>-1){
					 				propertyName = key;
					 			}
					 				
					 		}
					 		//console.log("2_"+propertyName); 
					 		if (propertyName.indexOf("Unknown gene")>-1)
					 			console.log(propertyName); 	
							else{
							 	var arr = d3.tsv.parseRows(d[2][propertyName])[0];
							 	
							 	for (var j=0;j<arr.length;j++){
							 		if (arr[j]!="NaN" && arr[j]!="0")
							 			count++;
							 	} 
							 	console.log(profileIds[p]+" "+i+" study="+studyIds[i]+" count="+count+ " /"+arr.length); 
						 		cBioPortalData[geneName][p][i] = new Object();	
						 		cBioPortalData[geneName][p][i]["count"] = count;
						 		cBioPortalData[geneName][p][i]["array"] = arr;		 		
						 	}
						}
						else
							console.log(profileIds[p]+" "+i+" study="+studyIds[i]+"  Empty result"); 	
					    
					    //updateNodeColors();	 		
					});  
				 })(request,i,p);
			} 
		}
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

