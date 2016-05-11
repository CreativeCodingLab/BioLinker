# BioLinker
Please click to watch the overview video.
[![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/TeaserVideo.png)](http://www2.cs.uic.edu/~tdang/BioLinker/BioLinker.mp4)

BioLinker is an interactive visualization system that helps users to perform bottom-up exploration of complex protein interaction networks. Five interconnected views provide the user with a range of ways to explore pathway data: Overview/ protein selector, context view, main view, publication view, and conflict matrix.  
![ScreenShot](https://github.com/CreativeCodingLab/BioLinker/blob/master/figures/Figure1.png)


A force-directed layout shows an overview of over 5,000 Fires index cards in BioLinker. Edges in the networks are encoded by interaction types such as green for add modification, red for remove modification.

![ScreenShot](http://www.cs.uic.edu/~tdang/BioLinker/images/BioLinkerOverview.png)

Users can start to investigate by selecting/searching for a protein. A mouse over highlights protein data extracted from index cards, statistics of direct neighbors (such as interaction types), meta data  (publication summary and/or [TimeArcs](https://github.com/CreativeCodingLab/TimeArcs) visualization of the selected protein and its direct neighbors), context data, and potential conflicts (for example a  [index card visualization matrix]( https://github.com/CreativeCodingLab/IndexCardVisualizations) of immediate neighbors). The three latest items are works in progress. A mouse click expands the direct neighbors iteratively.

![ScreenShot](http://www.cs.uic.edu/~tdang/BioLinker/images/BioLinker2.png)
