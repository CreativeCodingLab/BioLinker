## BioLinker: Bottom-up Exploration of Protein Interaction Networks
Please click to watch the overview video.
[![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/TeaserVideo.png)](http://www2.cs.uic.edu/~tdang/BioLinker/BioLinker.mp4)

BioLinker is an interactive visualization system that helps users to perform bottom-up exploration of complex protein interaction networks. Five interconnected views provide the user with a range of ways to explore pathway data: Overview/ protein selector, context view, main view, publication view, and conflict matrix.  
![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure1.png)


### 1) Overview / Protein Selector:
This panel provides an overview of a subset of millions of index cards in the database, such as protein interaction within the *cos-7* cell line. Users can select any protein within this overview network to start with. Users also have the option to instead input protein name into a search box on the top left. This will perform a request to load the selected protein and its immediate neighbors from our index card database. The left panel of the following figure shows an example of using the search box to select an initial protein. As users iteratively expand the subnetwork in the main view, the overview keeps track of the expanded sub-network over the overall context as depicted in the right panel.
![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure2.png)

### 2) Main View:
A subnetwork encircling the selected protein is initially shown in the main view. A user can iteratively expand the network on demand by clicking on individual elements. Node (protein) sizes are computed based on the number of direct neighbors. Edges (index cards) are color-encoded by interaction types. BioLinker supports finding paths between selected proteins. The following figure shows an example. Users specify source, target, and the maximum number of hops in between source and target. BioLinker displays all possible paths under that condition. Source node is pinned to the left while target node is pinned to the right of the visualization. The shortest path from *PIK3CA* to *TRAF6* goes through two hops *Akt* and *NF-kappaB*.
![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure4.png)

### 3) Context View:
Systems biologists and cancer researchers are frequently interested in understanding the contexts of biochemical reactions and comparing protein interaction sub-networks by context. The top left panel in the next figure shows the context view for the network in the main view (top right panel). In particular, we show a 2-degree separation network of a selected protein *antigen* which is located in the center of the main view. The lower panel depicts brushing and linking of two views. We have selected *mouse* in the *species* category. Other context categories are updated accordingly. In the main view (on the bottom right), we notice that all protein interactions in *mouse* are between *antigen* and its immediate neighbors, but not the second degree separated neighbors.  
![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure5.png)

### 4) Publication View:
We use [TimeArcs visualization](https://github.com/CreativeCodingLab/TimeArcs) to show the discoveries of these index cards by publication year. A request to load relevant publications for new index cards is sent to the PMC publication database on our server every time the protein network is expanded. The next Fig.(b) shows an example of publication view of the graph in Fig.(a). In particular, time axis goes from left (2004) to right (2012). An arc connects two proteins/complexes at a particular time (based on when the interaction was discovered/ publication year). The colors encode interaction types, such as green for *increase_activity*, red for *decrease_activity*, orange for *translocation*, and blue for *binds*. As depicted in Fig.(c), mousing over an arcs display publication data associated to an index card, such as paper title, authors' names, authors' contacts, affiliations, publication year, journal name, and external link. Users can go to the actual paper by a clicking on the provided link.
![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure6.png)

### Acknowledgments
This work was funded by the DARPA Big Mechanism Program under ARO contract WF911NF-14-1-0395.


