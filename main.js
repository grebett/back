// const result = Viz(`
// digraph g {
// graph [
// ];
// node [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// shape = "box"
// color = "black"
// width = "0.5"
// ];
// edge [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// color = "black"
// ];
// "22690" [
// label = "22690\n?"
// pname = "?"
// kind = "proc"
// ];
// "22692" [
// label = "22692\ndotty"
// pname = "dotty"
// kind = "proc"
// ];
// "116842+2595" [
// label = "116842+2595\n/home/ek/work/sun4/bin/dotty"
// fname = "/home/ek/work/sun4/bin/dotty"
// shape = "ellipse"
// kind = "file"
// ];
// "22693" [
// label = "22693\nlefty"
// pname = "lefty"
// kind = "proc"
// ];
// "182440-1" [
// label = "182440-1\n182441-1\npipe"
// fontsize = "7"
// fname = "pipe"
// shape = "doublecircle"
// subkind = "pipe"
// kind = "file"
// ];
// "182442-1" [
// label = "182442-1\n182443-1\npipe"
// fontsize = "7"
// fname = "pipe"
// shape = "doublecircle"
// subkind = "pipe"
// kind = "file"
// ];
// "22694" [
// label = "22694\ndot"
// pname = "dot"
// kind = "proc"
// ];
// "4761+2595" [
// label = "4761+2595\n/home/ek/pm2.dot"
// fname = "/home/ek/pm2.dot"
// shape = "ellipse"
// kind = "file"
// ];
// "22690" -> "22692" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// color = "black"
// ];
// "22692" -> "116842+2595" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// dir = "back"
// color = "black"
// ];
// "22692" -> "22693" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// color = "black"
// ];
// "22693" -> "182440-1" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// dir = "back"
// color = "black"
// ];
// "22693" -> "182442-1" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// dir = "forward"
// color = "black"
// ];
// "22693" -> "22694" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// color = "black"
// ];
// "22694" -> "182440-1" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// dir = "forward"
// color = "black"
// ];
// "22694" -> "182442-1" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// dir = "back"
// color = "black"
// ];
// "22693" -> "4761+2595" [
// fontsize = "14"
// fontname = "Times-Roman"
// fontcolor = "black"
// dir = "back"
// color = "black"
// ];
// }
// `)


function draw(data) {
  const d = SVG('drawing')
  d.svg(data)
  const svg = document.querySelector('svg')
  const nodes = svg.querySelectorAll('g[class="node"]')
  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      console.log(node.id, node.querySelector('title').textContent)
    })
  })
}

// keys
const listener = new keypress.Listener()
const keys = ['up', 'down', 'left', 'right']

let registers = []
keys.forEach(key => {
  registers.push({
    keys: key,
    is_exclusive: false, // well check that!
    on_keydown: move(key, 1),
  })
  registers.push({
    keys: `meta ${key}`,
    is_exclusive: false,
    on_keydown: move(key, 5),
  })

  if (key === 'up' || key === 'down') {
    const direction = key === 'down' ? 'in' : 'out'
    registers.push({
      keys: `alt ${key}`,
      is_exclusive: false,
      on_keydown: zoom(direction, 0.99),
    })
    registers.push({
      keys: `alt meta ${key}`,
      is_exclusive: false,
      on_keydown: zoom(direction, 0.9),
    })
  }
  registers.reverse()
})
listener.register_many(registers)

function zoom(direction, multiplier) {
  return () => {
    const graph = SVG.get('graph0')
    const values = graph.transform()
    const transform = {}
    switch (direction) {
      case 'in':
        transform.scaleX = values.scaleX * multiplier
        transform.scaleY = values.scaleY * multiplier
        break
      case 'out':
        transform.scaleX = values.scaleX / multiplier
        transform.scaleY = values.scaleY / multiplier
        break
    }
    graph.transform(transform)
  }
}

function move(direction, multiplier) {
  return () => {
    const graph = SVG.get('graph0')
    const values = graph.transform()
    const transform = {}
    switch (direction) {
      case 'up':
        transform.y = values.y - multiplier
        break
      case 'down':
        transform.y = values.y + multiplier
      break
      case 'left':
        transform.x = values.x - multiplier
      break
      case 'right':
        transform.x = values.x + multiplier
        break
    }
    graph.transform(transform)
  }
}

function createNode(name) {
  return `"${name}" [
label = "${name}"
pname = "toto"
kind = "proc"
];
`
}

function addEdge(node1, node2) {
  return `"${node1}" -> "${node2}" [
color = "red"
];
`
}

let start = `
digraph g {
graph [
];
node [
fontsize = "14"
fontname = "Times-Roman"
fontcolor = "black"
shape = "box"
color = "black"
width = "0.5"
];
edge [
fontsize = "14"
fontname = "Times-Roman"
fontcolor = "black"
color = "black"
];
`
let node1 = createNode('node1')
let node2 = createNode('node2')
let node3 = createNode('node3')
let node4 = createNode('node4')
let edge1 = addEdge('node1', 'node2')
let edge2 = addEdge('node3', 'node4')
let edge3 = addEdge('node1', 'node3')

function buildRepresentation(nodes, start) {
  for (let i = 0; i < nodes.length; i++) {
    start += nodes[i]
  }
  start += '}'
  return start
}

const data = buildRepresentation([node1, node2, node3, node4, edge1, edge2, edge3], start)
console.log(data)
const result = Viz(data)
draw(result)
