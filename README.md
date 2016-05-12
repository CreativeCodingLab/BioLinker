## BioLinker: Bottom-up Exploration of Protein Interaction Networks
Please click to watch the overview video.
[![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/TeaserVideo.png)](http://www2.cs.uic.edu/~tdang/BioLinker/BioLinker.mp4)

BioLinker is an interactive visualization system that helps users to perform bottom-up exploration of complex protein interaction networks. Five interconnected views provide the user with a range of ways to explore pathway data: Overview/ protein selector, context view, main view, publication view, and conflict matrix.  
![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure1.png)


### 1) Overview / Protein Selector:
This panel provides an overview of a subset of millions of index cards in the database, such as protein interaction within the \textit{cos-7} cell line. Users can select any protein within this overview network to start with. Users also have the option to instead input protein name into a search box on the top left. This will perform a request to load the selected protein and its immediate neighbors from our index card database. The left panel of the following figure shows an example of using the search box to select an initial protein. As users iteratively expand the subnetwork in the main view, the overview keeps track of the expanded sub-network over the overall context as depicted in the right panel.
![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure2.png)

Users can start to investigate by selecting/searching for a protein. A mouse over highlights protein data extracted from index cards, statistics of direct neighbors (such as interaction types), meta data  (publication summary and/or [TimeArcs](https://github.com/CreativeCodingLab/TimeArcs) visualization of the selected protein and its direct neighbors), context data, and potential conflicts (for example a  [index card visualization matrix]( https://github.com/CreativeCodingLab/IndexCardVisualizations) of immediate neighbors). The three latest items are works in progress. A mouse click expands the direct neighbors iteratively.

![ScreenShot](http://www.cs.uic.edu/~tdang/BioLinker/images/BioLinker2.png)
