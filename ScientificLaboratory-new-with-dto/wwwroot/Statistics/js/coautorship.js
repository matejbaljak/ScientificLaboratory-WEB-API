< !DOCTYPE html >
    <html lang="en">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Network Graph</title>
                    <style>
        /* Basic styles for the SVG canvas */
                        svg {
                            width: 100%;
                        height: 600px;
                        border: 1px solid lightgray;
        }
                    </style>
                </head>
                <body>

                    <svg id="network-graph"></svg>

                    <!-- Include D3.js -->
                    <script src="https://d3js.org/d3.v7.min.js"></script>
                    <script>
        // JavaScript to create the network graph
                        const width = 800;
                        const height = 600;

                        const data = {
                            "nodes": [
                        {"id": "Pablo Orduña", "group": 1},
                        {"id": "Unai Hernández-Jayo", "group": 1},
                        {"id": "David Buján Carballal", "group": 1},
                        {"id": "Javier García-Zubía", "group": 2},
                        {"id": "Josuka Díaz Labrador", "group": 2},
                        {"id": "Ana Belén Lago", "group": 1},
                        // Add more nodes as needed
                        ],
                        "links": [
                        {"source": "Pablo Orduña", "target": "Unai Hernández-Jayo", "value": 1},
                        {"source": "Pablo Orduña", "target": "David Buján Carballal", "value": 1},
                        {"source": "Unai Hernández-Jayo", "target": "David Buján Carballal", "value": 1},
                        {"source": "Javier García-Zubía", "target": "Josuka Díaz Labrador", "value": 1},
                        // Add more links as needed
                        ]
        };

                        const svg = d3.select("#network-graph")
                        .attr("width", width)
                        .attr("height", height);

                        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
                        .force("charge", d3.forceManyBody().strength(-300))
                        .force("center", d3.forceCenter(width / 2, height / 2));

                        const link = svg.append("g")
                        .attr("stroke", "#999")
                        .attr("stroke-opacity", 0.6)
                        .selectAll("line")
                        .data(data.links)
                        .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

                        const node = svg.append("g")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1.5)
                        .selectAll("circle")
                        .data(data.nodes)
                        .join("circle")
                        .attr("r", 10)
            .attr("fill", d => d.group === 1 ? "#1f77b4" : "#ff7f0e")
                        .call(drag(simulation));

                        node.append("title")
            .text(d => d.id);

        simulation.on("tick", () => {
                            link
                                .attr("x1", d => d.source.x)
                                .attr("y1", d => d.source.y)
                                .attr("x2", d => d.target.x)
                                .attr("y2", d => d.target.y);

                        node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

                        function drag(simulation) {
            return d3.drag()
                .on("start", event => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                        event.subject.fx = event.subject.x;
                        event.subject.fy = event.subject.y;
                })
                .on("drag", event => {
                            event.subject.fx = event.x;
                        event.subject.fy = event.y;
                })
                .on("end", event => {
                    if (!event.active) simulation.alphaTarget(0);
                        event.subject.fx = null;
                        event.subject.fy = null;
                });
        }
                    </script>
                </body>
            </html>
