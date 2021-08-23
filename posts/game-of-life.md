---
title: 'The Game of L̶i̶f̶e̶'
author: 'Harris Beg'
date: 'July 20, 2020'
description: 'John Conway - a brilliant mathematician who demonstrated the chaos of entities based on simple rules - passed away in April. This is a tribute to his work.'
hero_image: 'https://ninja.dog/T9pabD.gif'
---
## I. Foreword
This blog post is dedicated to **John Conway**, a brilliant mathematician who devised the Game of Life. Besides introducing many concepts of [cellular automaton](https://en.wikipedia.org/wiki/Cellular_automaton) and motivating the idea that complex life can be made up of basic forms, his life's work was dedicated to exploration. Conway passed away in April, but his legacy shall remain.

## II. Game of Life
You may be wondering - what is the Game of Life? The Game of Life is a grid-based game in which cells either die or survive. The rules are stated plainly here:

### Alive Cells:
- An alive cell dies of isolation if it has zero or one alive neighbour.
- An alive cell stays alive if it has two or three alive neighbours.
- An alive cell dies of overcrowding if it has four or more alive neighbours.

### Dead Cells
- A dead cell stays dead if it has two or less, or four or more alive neighbours.
- A dead cell comes alive if it has exactly three alive neighbours.

In our case, a cell is demarcated by a single pixel. If the cell lives, a white pixel will appear. If it dies, the white pixel will disappear to the background.

But here's a twist - **how can we simulate COVID-19 using the Game of Life**? Well, we happen to know approximations for the mortality rate, and we can establish a radius around a pixel such that the surrounding pixels are at risk of getting infected.

To create our simulation's base case, we will establish a few parameters, as described below:
- For the base population, **we will set up a population density of 0.1**. This means that for every 9 background squares, there will be one cell that is alive.
- Of the cells that are alive, we need a rate of infection. In the United States, we have an infection rate of **1.45%** at the time of writing.
- Of the cells that are infected, we must determine a mortality rate. **The mortality rate in the United States happens to be 3.7% amongst the observed cases**.

For every iteration, we must also establish a rate of infection from exposure within the aforementioned radius.
- Let us construct a fixed radius of infection. Arbitrarily, `r=6px` was selected to emulate reality.
- To demonstrate the importance of safety procedures (such as wearing masks, washing hands, etc.), we will observe 3 rates of infection amongst the exposed: 10%, 40%, and 80%. These rates will represent good, mediocre, and unfavorable hygienic practices, respectively.

> It is also worth noting that the **overpopulation rules** of Conway's Game of Life act against COVID by enforcing some form of distancing and preventing large clusters. We will reframe this rule in the context of social distancing. Conversely, the birth of cells will simply be reframed as movement within the background.

### TL;DR

We established the rules of Conway's Game of Life as well as a few more parameters to introduce COVID into the population. We will compare three cases to see the isolated effects of hygiene techniques.

By removing the confounding variable of clusters and social distancing, we will attempt to motivate the implications of **hygienic practices** in a COVID-infected population.

## Implementation
### Generating a Base Case
With the parameters described above, we can easily set up a base case as follows:
```python
def generateGrid(im, w, h):
  grid = im.load()
  for i in range(h):
    for j in range(w):
      x = random.random()
      if x <= 0.1:
        grid[j,i] = (255,255,255)
        if x <= 0.0145:
          grid[j, i] = (255,0,0)
  return grid
```
Looking closely, we observe the population density of 0.1, as well as a rate of infection of 1.45%. **Red coloration indicates infected cells.**

We will also define the survival function as below:
```python
def survive(i, j, grid, w, h):
  n = countNeighbors(i, j, grid, w, h)
  if n >= 4 or n <= 1:
    return False
  if grid[j, i] == (0,0,0):
    if n == 2:
      return False
  return True
```

This method reiterates the rules established for the standard Game of Life, but it depends on a primitive algorithm for counting the neighbors that are alive:
```python
def countNeighbors(i, j, grid, w, h):
  ct = 0
  for x in range(max(i-1, 0), min(i+2, h)):
    for y in range(max(0, j-1), min(j+2, w)):
      if ct >= 4:
        return 4
      if grid[y, x] != (0,0,0):
        ct+=1
  return ct
```

We will also use a searching algorithm to determine if there are any infected cells around any given cell that is alive. To do this, I used a recursive implementation of Breadth First Search.
```python
def bfs(i, j, grid, w, h, visited, radius=6):
  if radius == 0:
    return False
  if (i, j) in visited:
    return False
  if i < 0 or j < 0 or i >= h or j >= w:
    return False
  if grid[j, i] == (255,0,0):
    return True
  d = [[1, 0], [0, 1], [-1, 0], [0, -1]]
  visited.append((i, j))
  for diff in d:
    dx, dy = diff
    if bfs(i+dx, j+dy, grid, w, h, visited, radius=radius-1):
      return True
  return False
```

Finally, we will combine all of these methods into one central function that will iterate the current game. We will go through it line by line.
```python
def iter(im, w, h, rate):
  c = im.copy()
  grid = im.load()
  g = c.load()
  for i in range(h):
    for j in range(w):
      if survive(i, j, grid, w, h):
        
        if grid[j, i] == (255, 0, 0):
          g[j, i] = (255, 0, 0)
        else:
          g[j, i] = (255,255,255)

        if bfs(i, j, grid, w, h, []):
          x = random.random()
          if x < rate:
            g[j, i] = (255, 0, 0)
            if x < 0.037:
              g[j, i] = (0, 0, 0)
      else:
        g[j, i] = (0,0,0)
  return c
```

First, we will copy the previous image which contains the previous cells. Then, we will look at every single pixel in this image. If the image remains alive by Conway's standard rules, we will make the pixel white. Then, we will search for infected cells around the current pixel using **bfs**. Finally, we will use the Exposure-Case rate prescribed above (10%, 40%, or 80%) to randomly determine if the cell also gets COVID. Worse, we will use the **3.7% mortality rate** to determine if the cell dies.

## III. The Results
As a control, we shall observe what happens at a **10% Exposure-Infected ratio**. Once again, this represents fabulous hygiene in the population - imagine if everyone wore N90 masks.

### 10% Rate
![10% Rate](https://ninja.dog/EO9qpI.gif)


As expected, the cases simmer out very quickly, and an observable distancing appears to occur. It's important to note that in these simulations, **we should concentrate on the amount of infected cells and the gaps between alive cells**. With this considered, the 10% rate population seems to do well. In fact, by the second frame (out of 33), there are nearly no cases left.

We go from this:

![High density cases](https://ninja.dog/thCwnc.png)


To this:

![Low density cases](https://ninja.dog/2EiGXv.gif)

### 40% Rate

![40% Rate](https://ninja.dog/HBAsLV.gif)

At first glance, some may say that this follows a similar fate to the 10% rate, but that is simply not true. In contrast to the first case, it takes nearly 16/33 iterations to completely get rid of the cases - in doing this, the amount of cells that die from COVID are amplified significantly. You can imagine that this persistence in a larger density or, perhaps, a larger grid would last much longer. With this understood, we immediately understand that this **40% rate** leads to significantly more deaths, despite having the same rules given in the first case. 

Here is the 40% simulation at iteration 5:
![](https://ninja.dog/K4WzpR.gif)

...and here is the 10% simulation:
![](https://ninja.dog/l4WaHM.gif)

Given this, it seems that although distancing is effective, not pertaining to measures that prevent person-to-person spread still has a drastic implication on the trajectory of the virus. Our cellular automaton see the same thing that our country has: an avoidance of large groups is not enough.

### 80% Rate

The 80% exposure-infection rate really just speaks for itself. Simply put, it's the destruction of an economy, jobs, and lives.

![](https://ninja.dog/gMYk1v.gif)

The massive gaps formed by the end are not distanced clusters - they're large-scale outbreaks as a result of the exposure we see over and over again. Noticeably, this simulation of Conway's Game of Life shows the degradation of the population density in a drastic sense - especially visible in the gaps. Again, some may note that although this is true, there are still many uninfected cells by the end. **This false conclusion is as a result of the folly of this simulation** - the only reason why there is not a larger spread is the 512 * 512 constraint on the grid. In a larger population, this inflammation would extend the virus to almost every cell.

## What does all this mean?

Surely, if you distance yourself 6 feet from almost everyone, you won't get infected regardless of whether or not you're wearing a mask, right? **Wrong**, for those cases that you miss, a significant inflammation of COVID patients may occur and devastate an entire community. Even within a primitive form of life, such as Conway's simulated automata, distancing is equally as important as limiting exposure through other methods. While this simulation undoubtedly has flaws, it amplifies the idea that every cell - every case - every measure - matters. In addition to limiting exposure, we must use preventative infection measures to beat COVID-19.
# Wear a mask - it's important for you, your community, and for **society**.

## IV. References

- Lipa, Chris. “Conway's Game of Life.” Conway's Game of Life', [pi.math.cornell.edu/~lipa/mec/lesson6.html](https://pi.math.cornell.edu/~lipa/mec/lesson6.html]).
- “Mortality Analyses.” Johns Hopkins Coronavirus Resource Center, [coronavirus.jhu.edu/data/mortality](https://coronavirus.jhu.edu/data/mortality).
- “Still Confused About Masks? Here's the Science Behind How Face Masks Prevent Coronavirus.” Still Confused About Masks? Here's the Science Behind How Face Masks Prevent Coronavirus | UC San Francisco, 14 July 2020, [Source](www.ucsf.edu/news/2020/06/417906/still-confused-about-masks-heres-science-behind-how-face-masks-prevent).