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

![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure5.png)

### Acknowledgments
This work was funded by the DARPA Big Mechanism Program under ARO contract WF911NF-14-1-0395.


