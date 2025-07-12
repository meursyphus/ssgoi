function getRootRect() {
  const root = document.querySelector('[data-ssgoi]')
  if (root == null) throw new Error("No root element found on ssgoi")
  return root.getBoundingClientRect()
}

export default getRootRect  