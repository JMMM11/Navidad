function createSnowflake() {
  const snowContainer = document.getElementById("snow-container")
  const snowflake = document.createElement("div")
  snowflake.classList.add("snowflake")
  snowflake.innerHTML = "❄"

  snowflake.style.left = Math.random() * 100 + "%"
  snowflake.style.fontSize = Math.random() * 10 + 10 + "px"
  snowflake.style.opacity = Math.random() * 0.6 + 0.4

  const duration = Math.random() * 5 + 5
  snowflake.style.animationDuration = duration + "s"

  snowContainer.appendChild(snowflake)

  setTimeout(() => {
    snowflake.remove()
  }, duration * 1000)
}

function startSnow() {
  for (let i = 0; i < 50; i++) {
    setTimeout(createSnowflake, Math.random() * 3000)
  }

  setInterval(createSnowflake, 300)
}

window.addEventListener("load", () => {
  startSnow()
})
