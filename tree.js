function createChristmasTree() {
  const treeContainer = document.getElementById("tree-3d")

  const star = document.createElement("div")
  star.className = "star-top"
  treeContainer.appendChild(star)

  const wrapper = document.createElement("div")
  wrapper.className = "tree-3d-wrapper"
  treeContainer.appendChild(wrapper)

  const layers = 12
  const pixelsPerLayer = 20

  for (let layer = 0; layer < layers; layer++) {
    const layerDiv = document.createElement("div")
    layerDiv.className = "tree-layer"

    const yPos = layer * 35
    const radius = 15 + layer * 8

    layerDiv.style.top = yPos + "px"

    for (let i = 0; i < pixelsPerLayer; i++) {
      const angle = (i / pixelsPerLayer) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      const pixel = document.createElement("div")
      pixel.className = "pixel"

      const greenShade = Math.floor(100 + layer * 10)
      const darkGreen = Math.floor(50 + layer * 5)
      pixel.style.background = `linear-gradient(135deg, 
        rgb(${darkGreen}, ${greenShade}, ${darkGreen}) 0%, 
        rgb(${darkGreen - 20}, ${greenShade - 30}, ${darkGreen - 20}) 100%)`

      pixel.style.transform = `translateX(${x}px) translateZ(${z}px)`

      layerDiv.appendChild(pixel)
    }

    if (layer % 2 === 0 && layer > 1) {
      const ornamentCount = 3 + Math.floor(Math.random() * 3)
      for (let o = 0; o < ornamentCount; o++) {
        const ornament = document.createElement("div")
        ornament.className = "ornament"

        const colors = ["#ff4444", "#ffd700", "#4444ff", "#44ff44", "#ff44ff", "#00ffff"]
        ornament.style.background = colors[Math.floor(Math.random() * colors.length)]
        ornament.style.color = ornament.style.background

        const oAngle = (o / ornamentCount) * Math.PI * 2
        const oX = Math.cos(oAngle) * (radius - 5)
        const oZ = Math.sin(oAngle) * (radius - 5)

        ornament.style.transform = `translateX(${oX}px) translateZ(${oZ}px)`
        ornament.style.animationDelay = `${Math.random() * 2}s`

        layerDiv.appendChild(ornament)
      }
    }

    wrapper.appendChild(layerDiv)
  }

  const trunk = document.createElement("div")
  trunk.className = "trunk"
  treeContainer.appendChild(trunk)
}

window.addEventListener("load", () => {
  createChristmasTree()
})
